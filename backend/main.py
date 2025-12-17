from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import Response, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from PIL import Image, ImageOps  # ★修正1: ImageOpsを追加
import sys
import os

# coreモジュールのパス設定
sys.path.append(os.path.dirname(__file__))
# core内のクラスをインポート (Streamlit版のコードに合わせてください)
from core.image_processor import ColorGradingEngine
from core.lut_converter import LutGenerator

app = FastAPI()

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# エンジンの初期化 (起動時に一度だけロード)
grader = ColorGradingEngine()
lut_gen = LutGenerator()

def load_image(file_bytes):
    # ★修正2: 画像を開いた直後にEXIF情報を元に回転させ、その後にRGB変換する
    img = Image.open(BytesIO(file_bytes))
    img = ImageOps.exif_transpose(img)
    return img.convert("RGB")

@app.post("/api/process")
async def process_images(
    target: UploadFile = File(...),
    reference: UploadFile = File(...),
    method: str = Form(...),
    preserve_luminance: bool = Form(...)
):
    """画像処理を実行し、結果画像を返す"""
    t_img = load_image(await target.read())
    r_img = load_image(await reference.read())

    # 処理実行 (intensityはフロント側でブレンドするため、ここでは常に1.0で作る)
    result_img = grader.process(
        t_img, r_img, 
        intensity=1.0, 
        preserve_luminance=preserve_luminance, 
        method=method
    )

    img_byte_arr = BytesIO()
    result_img.save(img_byte_arr, format='PNG')
    return Response(content=img_byte_arr.getvalue(), media_type="image/png")

@app.post("/api/generate_lut")
async def generate_lut(
    reference: UploadFile = File(...),
    method: str = Form(...),
    preserve_luminance: bool = Form(...),
    intensity: float = Form(...)
):
    """現在の設定に基づいて.cubeファイルを生成して返す"""
    r_img = load_image(await reference.read())

    # Identity Haldに処理を適用
    identity_hald = lut_gen.generate_simple_identity_hald_8()
    processed_hald = grader.apply_to_hald(
        identity_hald, 
        r_img, 
        intensity=intensity,
        preserve_luminance=preserve_luminance,
        method=method
    )
    
    # Cubeテキスト生成
    lut_text = lut_gen.convert_to_cube(processed_hald, title="Cinematic_AI")
    
    return Response(
        content=lut_text, 
        media_type="text/plain",
        headers={"Content-Disposition": "attachment; filename=cinematic_look.cube"}
    )