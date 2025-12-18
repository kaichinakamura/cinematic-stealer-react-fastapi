import React, { useState, useRef } from 'react';

// App.jsx から切り出したコンポーネント
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
      <img
        src={original}
        alt="Original Base"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />
      <img
        src={processed}
        alt="Processed Overlay"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        style={{ opacity: opacity }}
      />
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={original}
          alt="Original Left"
          className="absolute inset-0 w-full h-full object-contain"
        />
        <div className="absolute inset-0 shadow-[0_0_20px_rgba(0,0,0,0.5)] pointer-events-none"></div>
      </div>
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white cursor-col-resize z-20 pointer-events-none drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white text-zinc-900 rounded-full flex items-center justify-center shadow-lg text-xs font-bold border-2 border-zinc-200">
          ↔
        </div>
      </div>
      <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded pointer-events-none backdrop-blur-sm border border-white/10">
        Original
      </div>
      <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded pointer-events-none backdrop-blur-sm border border-white/10">
        Result
      </div>
    </div>
  );
};

export default CompareSlider;