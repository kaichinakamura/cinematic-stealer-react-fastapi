import React from 'react';
import { X, Sparkles } from 'lucide-react';

const HelpModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Sparkles className="text-purple-500" size={20}/> Quick Guide
        </h2>
        
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-400 border border-zinc-700">1</div>
            <div>
              <h3 className="text-zinc-200 font-bold mb-1">Upload Images</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                <span className="text-purple-400 font-medium">Target</span>（変えたい画像）と
                <span className="text-blue-400 font-medium"> Reference</span>（真似したい色味）
                をそれぞれドラッグ&ドロップします。
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-400 border border-zinc-700">2</div>
            <div>
              <h3 className="text-zinc-200 font-bold mb-1">Select & Create</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                好みのAlgorithmを選び、<span className="text-zinc-200 bg-zinc-800 px-1.5 py-0.5 rounded text-xs border border-zinc-700">Create Result</span> を押します。
                Histogramが最も汎用的でおすすめです。
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-400 border border-zinc-700">3</div>
            <div>
              <h3 className="text-zinc-200 font-bold mb-1">Snapshot & LUT</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                結果が気に入ればSnapshotで保存。
                あとから画像や3D LUT (.cube) としてダウンロードできます。
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-zinc-100 text-zinc-900 font-bold py-2 px-6 rounded-full hover:bg-zinc-300 transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;