import React from 'react';
import { Archive, Loader2, Trash2, Download } from 'lucide-react';

const SnapshotGallery = ({ 
  snapshots, 
  setSnapshots, 
  onDownloadZip, 
  isZipping, 
  onDownloadLut 
}) => {
  return (
    <section className="pt-8 border-t border-zinc-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-300">
          Snapshots <span className="bg-zinc-800 text-xs px-2 py-0.5 rounded-full text-zinc-500">{snapshots.length}</span>
        </h2>
        {snapshots.length > 1 && (
          <button 
            onClick={onDownloadZip} 
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
                <button onClick={() => onDownloadLut(snap)} className="bg-zinc-800 hover:bg-zinc-700 text-purple-400 text-xs py-2 rounded text-center flex justify-center items-center gap-1 transition">
                  <Download size={12}/> LUT
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SnapshotGallery;