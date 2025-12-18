import React, { useState } from 'react';
import { Camera, Layers } from 'lucide-react'; // 残ったアイコンのみインポート
import CompareSlider from './components/CompareSlider';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ControlPanel from './components/ControlPanel'; // ★追加
import SnapshotGallery from './components/SnapshotGallery'; // ★追加
import HelpModal from './components/HelpModal'; // ★追加
import { useImageProcessor } from './hooks/useImageProcessor';

// ==========================================
// メインアプリ
// ==========================================
function App() {
  const {
    targetFile, targetPreview,
    refFile, refPreview,
    method, setMethod,
    preserveLum, setPreserveLum,
    isLoading,
    processedPreview,
    snapshots, setSnapshots,
    isZipping,
    handleDrop,
    handleFileSelect,
    handleSwap,
    runProcess,
    takeSnapshot,
    downloadLut,
    downloadAllAsZip
  } = useImageProcessor();

  const [blendOpacity, setBlendOpacity] = useState(0.8);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-purple-500 selection:text-white">
      <div className="max-w-7xl mx-auto p-6 space-y-12">
        
        <Header onShowHelp={() => setShowHelp(true)} onSwap={handleSwap} />

        {/* Step 1: Upload Images */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold text-sm shadow-inner">1</div>
            <h2 className="text-xl font-bold text-zinc-200">Upload Images</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              { id: 'target', label: 'Target Image', sub: '変えたい画像', preview: targetPreview, color: 'text-purple-400', border: 'hover:border-purple-500/50 hover:bg-purple-500/5' },
              { id: 'reference', label: 'Reference Image', sub: '憧れの色味', preview: refPreview, color: 'text-blue-400', border: 'hover:border-blue-500/50 hover:bg-blue-500/5' }
            ].map((area) => (
              <ImageUploader
                key={area.id}
                label={area.label}
                sub={area.sub}
                preview={area.preview}
                color={area.color}
                border={area.border}
                onDrop={(e) => handleDrop(e, area.id)}
                onSelect={(e) => handleFileSelect(e, area.id)}
              />
            ))}
          </div>
        </section>

        {/* Step 2: Controls (コンポーネント化) */}
        <ControlPanel 
          method={method}
          setMethod={setMethod}
          preserveLum={preserveLum}
          setPreserveLum={setPreserveLum}
          onRun={runProcess}
          isLoading={isLoading}
          disabled={isLoading || !targetFile || !refFile}
        />

        {/* Step 3: Result Area (ここはまだApp.jsxに残しています) */}
        {processedPreview && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold text-sm shadow-inner">3</div>
                <h2 className="text-2xl font-bold text-zinc-200">Result</h2>
              </div>
              <button onClick={() => takeSnapshot(blendOpacity)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition border border-zinc-700">
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

        {/* Snapshots (コンポーネント化) */}
        {snapshots.length > 0 && (
          <SnapshotGallery 
            snapshots={snapshots}
            setSnapshots={setSnapshots}
            onDownloadZip={downloadAllAsZip}
            isZipping={isZipping}
            onDownloadLut={downloadLut}
          />
        )}
      
        {/* Help Modal (コンポーネント化) */}
        {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      </div>
    </div>
  );
}

export default App;