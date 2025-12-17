FROM python:3.11-slim

WORKDIR /app

# 画像処理に必要なライブラリ
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ★Hugging Face対応: ユーザーID 1000 (Linuxの標準ユーザー) を作成して使う
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

COPY --chown=user . .

# ★Hugging Face対応: ポート7860で起動
# ローカル開発時はdocker-composeでこのコマンドを上書き(override)することも可能ですが
# 基本的にこのままでOKです。
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]