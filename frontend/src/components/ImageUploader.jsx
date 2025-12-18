import React from 'react';
import { Download, Image as ImageIcon } from 'lucide-react';

// ★変更: onSelect プロップを追加
const ImageUploader = ({ label, sub, preview, color, border, onDrop, onSelect }) => {
  
  return (
    <div className="space-y-3">
      <h3 className={`font-bold flex items-center gap-2 ${color}`}>
        <ImageIcon size={18} /> {label} <span className="text-zinc-600 text-xs font-normal">/ {sub}</span>
      </h3>
      <div 
        className={`
          aspect-video rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900/50 
          flex items-center justify-center overflow-hidden relative group transition-all duration-300
          ${border}
        `}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        {preview ? (
          <>
            <img src={preview} className="w-full h-full object-contain z-10" alt={label} />
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
        {/* ★変更: onChangeにはonSelectを直接渡す */}
        <input 
          type="file" 
          className="absolute inset-0 opacity-0 cursor-pointer z-50" 
          onChange={onSelect} 
        />
      </div>
    </div>
  );
};

export default ImageUploader;