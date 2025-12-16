import React, { useState, useCallback, useRef } from 'react';
import { Download, Trash2, Camera, RefreshCw, ArrowRight, Layers, Image as ImageIcon, Sparkles, Archive, Loader2 } from 'lucide-react';
import JSZip from 'jszip'; // ★追加: ZIP用ライブラリ

// ==========================================
// コンポーネント: 比較スライダー
// ==========================================
const CompareSlider = ({ original, processed, opacity }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMouseDown = (e) => { setIsDragging(true); updatePosition(e.clientX); };
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => { if (isDragging) updatePosition(e.clientX); };
  
  const handleTouchStart = (e) => { setIsDragging(true); updatePosition(e.touches[0].clientX); };
  const handleTouchMove = (e) => { if (isDragging) updatePosition(e.touches[0].clientX); };
  const handleTouchEnd = () => setIsDragging(false);

  const updatePosition = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden rounded-xl border border-zinc-700 shadow-2xl cursor-ew-resize bg-zinc-950"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 【修正のポイント】 レイヤーを3層構造にします 
      */}

      {/* 1. 最下層 (Base): 元画像 
          → Opacityが0になったとき、これが見えるようになります
      */}
      <img 
        src={original} 
        alt="Original Base" 
        className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
      />

      {/* 2. 中間層 (Effect): 処理後画像 (Result)
          → Opacityで制御され、最下層の元画像とブレンドされます
      */}
      <img 
        src={processed} 
        alt="Processed Overlay" 
        className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
        style={{ opacity: opacity }} 
      />

      {/* 3. 最上層 (Compare): 左側の「元画像」表示用
          → clipPathで左側だけを表示し、右側(1と2のブレンド結果)を見せます
      */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img 
          src={original} 
          alt="Original Left" 
          className="absolute inset-0 w-full h-full object-contain"
        />
        {/* 境界線を見やすくするためのシャドウ */}
        <div className="absolute inset-0 shadow-[0_0_20px_rgba(0,0,0,0.5)] pointer-events-none"></div>
      </div>

      {/* スライダーのハンドル */}
      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-white cursor-col-resize z-20 pointer-events-none drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white text-zinc-900 rounded-full flex items-center justify-center shadow-lg text-xs font-bold border-2 border-zinc-200">
          ↔
        </div>
      </div>
      
      {/* ラベル */}
      <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded pointer-events-none backdrop-blur-sm border border-white/10">
        Original
      </div>
      <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded pointer-events-none backdrop-blur-sm border border-white/10">
        Result
      </div>
    </div>
  );
};

// ==========================================
// メインアプリ
// ==========================================
function App() {
  const [targetFile, setTargetFile] = useState(null);
  const [targetPreview, setTargetPreview] = useState(null);
  const [refFile, setRefFile] = useState(null);
  const [refPreview, setRefPreview] = useState(null);
  const [method, setMethod] = useState("histogram");
  const [preserveLum, setPreserveLum] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [processedPreview, setProcessedPreview] = useState(null);
  const [blendOpacity, setBlendOpacity] = useState(0.8);
  const [snapshots, setSnapshots] = useState([]);
  
  // ★追加: ZIP作成中のローディング状態
  const [isZipping, setIsZipping] = useState(false);

  const handleDrop = useCallback((e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      if (type === 'target') {
        setTargetFile(file);
        setTargetPreview(url);
      } else {
        setRefFile(file);
        setRefPreview(url);
      }
      setProcessedPreview(null);
    }
  }, []);

  const handleSwap = () => {
    setTargetFile(refFile);
    setTargetPreview(refPreview);
    setRefFile(targetFile);
    setRefPreview(targetPreview);
    setProcessedPreview(null);
  };

  const runProcess = async () => {
    if (!targetFile || !refFile) return alert("画像を2枚選択してください");
    setIsLoading(true);
    const formData = new FormData();
    formData.append("target", targetFile);
    formData.append("reference", refFile);
    formData.append("method", method);
    formData.append("preserve_luminance", preserveLum);

    try {
      const res = await fetch("http://localhost:8000/api/process", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Processing failed");
      const blob = await res.blob();
      setProcessedPreview(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      alert("エラーが発生しました。Backendを確認してください。");
    } finally {
      setIsLoading(false);
    }
  };

  const takeSnapshot = () => {
    if (!processedPreview || !targetPreview) return;
    const newSnap = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleTimeString(),
      processed: processedPreview,
      target: targetPreview,
      refFile: refFile, 
      method: method, 
      preserveLum: preserveLum, 
      intensity: blendOpacity
    };
    setSnapshots([newSnap, ...snapshots]);
  };

  const downloadLut = async (snap) => {
    const formData = new FormData();
    formData.append("reference", snap.refFile);
    formData.append("method", snap.method);
    formData.append("preserve_luminance", snap.preserveLum);
    formData.append("intensity", snap.intensity);

    try {
      const res = await fetch("http://localhost:8000/api/generate_lut", {
        method: "POST",
        body: formData,
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cinematic_${snap.method}.cube`;
      a.click();
    } catch (err) {
      alert("LUT生成エラー");
    }
  };

  // ★追加: すべてのスナップショットをZIPでダウンロード
  const downloadAllAsZip = async () => {
    if (snapshots.length === 0) return;
    setIsZipping(true);
    const zip = new JSZip();
    const folder = zip.folder("cinematic_snapshots");

    try {
      // Promise.allで並列処理（画像取得 & LUT生成）
      await Promise.all(snapshots.map(async (snap, index) => {
        const prefix = `snap_${index + 1}_${snap.method}`;

        // 1. 画像のバイナリを取得 (Blob URLからfetch)
        const imgBlob = await fetch(snap.processed).then(r => r.blob());
        folder.file(`${prefix}.png`, imgBlob);

        // 2. メタデータテキスト
        const info = `Method: ${snap.method}\nIntensity: ${snap.intensity}\nPreserve Luminance: ${snap.preserveLum}\nDate: ${snap.date}`;
        folder.file(`${prefix}_info.txt`, info);

        // 3. APIを叩いてLUT (.cube) を生成して取得
        const formData = new FormData();
        formData.append("reference", snap.refFile);
        formData.append("method", snap.method);
        formData.append("preserve_luminance", snap.preserveLum);
        formData.append("intensity", snap.intensity);
        
        const lutRes = await fetch("http://localhost:8000/api/generate_lut", {
          method: "POST", body: formData
        });
        if (lutRes.ok) {
          const lutBlob = await lutRes.blob();
          folder.file(`${prefix}.cube`, lutBlob);
        }
      }));

      // ZIPを生成してダウンロード
      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = "cinematic_snapshots.zip";
      a.click();

    } catch (e) {
      console.error(e);
      alert("ZIP作成中にエラーが発生しました");
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-purple-500 selection:text-white">
      <div className="max-w-7xl mx-auto p-6 space-y-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-zinc-800 pb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl shadow-lg shadow-purple-900/20">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400">
                Cinematic Color Stealer
              </h1>
              <p className="text-zinc-500 text-sm">AI-Powered Color Grading Tool</p>
            </div>
          </div>
          <button onClick={handleSwap} className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 px-5 py-2.5 rounded-full transition-all hover:border-zinc-500 active:scale-95 text-sm font-medium">
            <RefreshCw size={16} /> Swap Images
          </button>
        </header>

        {/* D&D Area */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            { id: 'target', label: 'Target Image', sub: '変えたい画像', preview: targetPreview, color: 'text-purple-400', border: 'hover:border-purple-500/50 hover:bg-purple-500/5' },
            { id: 'reference', label: 'Reference Image', sub: '憧れの色味', preview: refPreview, color: 'text-blue-400', border: 'hover:border-blue-500/50 hover:bg-blue-500/5' }
          ].map((area) => (
            <div key={area.id} className="space-y-3">
              <h3 className={`font-bold flex items-center gap-2 ${area.color}`}>
                <ImageIcon size={18} /> {area.label} <span className="text-zinc-600 text-xs font-normal">/ {area.sub}</span>
              </h3>
              <div 
                className={`
                  aspect-video rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900/50 
                  flex items-center justify-center overflow-hidden relative group transition-all duration-300
                  ${area.border}
                `}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, area.id)}
              >
                {area.preview ? (
                  <>
                    <img src={area.preview} className="w-full h-full object-contain z-10" alt={area.label} />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 pointer-events-none">
                      <p className="text-white font-medium">Replace Image</p>
                    </div>
                  </>
                ) : (
                  <div className="text-zinc-600 text-center pointer-events-none group-hover:text-zinc-400 transition-colors">
                    <Download className="mx-auto mb-2 opacity-50" size={32} />
                    <p className="text-sm">Drag & Drop or Click</p>
                  </div>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-50" onChange={(e) => handleDrop({preventDefault:()=>{}, dataTransfer:{files: e.target.files}}, area.id)} />
              </div>
            </div>
          ))}
        </section>

        {/* Controls */}
        <section className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Algorithm</label>
              <div className="flex flex-wrap gap-2">
                {[{id: 'histogram', label: 'Histogram'},{id: 'reinhard', label: 'Reinhard'},{id: 'covariance', label: 'Covariance'},{id: 'kmeans', label: 'Clustering AI'},].map((m) => (
                  <label key={m.id} className={`cursor-pointer px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${method === m.id ? 'bg-zinc-100 text-black border-zinc-100 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'}`}>
                    <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={(e) => setMethod(e.target.value)} className="hidden" />{m.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-3 flex items-center">
              <label className="flex items-center gap-3 cursor-pointer select-none group">
                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${preserveLum ? 'bg-purple-500 border-purple-500' : 'bg-zinc-800 border-zinc-600 group-hover:border-zinc-500'}`}>
                  {preserveLum && <ArrowRight className="text-white rotate-[-45deg]" size={14} strokeWidth={4} />}
                </div>
                <input type="checkbox" checked={preserveLum} onChange={(e) => setPreserveLum(e.target.checked)} className="hidden" />
                <span className="text-zinc-300 text-sm group-hover:text-white transition-colors">Preserve Luminance<br/><span className="text-xs text-zinc-500">明るさを維持</span></span>
              </label>
            </div>
            <div className="md:col-span-2">
              <button onClick={runProcess} disabled={isLoading || !targetFile || !refFile} className={`w-full py-4 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${isLoading ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-purple-900/30'}`}>
                {isLoading ? 'Processing...' : <>Create Result <ArrowRight size={16}/></>}
              </button>
            </div>
          </div>
        </section>

        {/* Result Area */}
        {processedPreview && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
            <div className="flex justify-between items-end">
              <h2 className="text-2xl font-bold text-zinc-200">Result</h2>
              <button onClick={takeSnapshot} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition border border-zinc-700">
                <Camera size={16}/> Snapshot
              </button>
            </div>
            <div className="bg-zinc-950 rounded-2xl shadow-2xl overflow-hidden border border-zinc-800 aspect-video relative">
               <CompareSlider original={targetPreview} processed={processedPreview} opacity={blendOpacity}/>
            </div>
            <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50 flex items-center gap-4">
              <Layers className="text-purple-400" />
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-2 text-zinc-400">
                  <span>Effect Opacity (Blend)</span>
                  <span className="font-mono text-zinc-200">{Math.round(blendOpacity * 100)}%</span>
                </div>
                <input type="range" min="0" max="1" step="0.01" value={blendOpacity} onChange={(e) => setBlendOpacity(parseFloat(e.target.value))} className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
              </div>
            </div>
          </section>
        )}

        {/* Snapshots */}
        {snapshots.length > 0 && (
          <section className="pt-8 border-t border-zinc-800">
            {/* ★修正: ZIPダウンロードボタンを追加 */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-300">
                Snapshots <span className="bg-zinc-800 text-xs px-2 py-0.5 rounded-full text-zinc-500">{snapshots.length}</span>
              </h2>
              {snapshots.length > 1 && (
                <button 
                  onClick={downloadAllAsZip} 
                  disabled={isZipping}
                  className="text-sm bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 px-4 py-2 rounded-full flex items-center gap-2 transition"
                >
                  {isZipping ? <Loader2 className="animate-spin" size={16} /> : <Archive size={16} />}
                  Download All as ZIP
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {snapshots.map((snap) => (
                <div key={snap.id} className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden group hover:border-zinc-600 transition-all">
                  <div className="aspect-video bg-zinc-950 relative">
                    <img src={snap.target} className="absolute inset-0 w-full h-full object-cover" alt="target base" />
                    <img 
                      src={snap.processed} 
                      className="absolute inset-0 w-full h-full object-cover transition-opacity" 
                      style={{opacity: snap.intensity}} 
                      alt="processed overlay" 
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono text-zinc-500">{snap.date}</span>
                      <button onClick={() => setSnapshots(s => s.filter(i => i.id !== snap.id))} className="text-zinc-600 hover:text-red-400 transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    {/* ★修正: Luminance情報を表示に追加 */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="text-xs font-bold px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded uppercase">{snap.method}</span>
                      <span className="text-xs text-zinc-500">{Math.round(snap.intensity * 100)}%</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${snap.preserveLum ? 'border-purple-500/30 text-purple-400' : 'border-zinc-700 text-zinc-500'}`}>
                        {snap.preserveLum ? '💡 Lum: ON' : '🌑 Lum: OFF'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <a href={snap.processed} download={`snap_${snap.id}.png`} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs py-2 rounded text-center transition">
                        Image
                      </a>
                      <button onClick={() => downloadLut(snap)} className="bg-zinc-800 hover:bg-zinc-700 text-purple-400 text-xs py-2 rounded text-center flex justify-center items-center gap-1 transition">
                        <Download size={12}/> LUT
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;