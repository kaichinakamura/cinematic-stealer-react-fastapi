import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext'; // ★追加

const ControlPanel = ({ 
  method, 
  setMethod, 
  preserveLum, 
  setPreserveLum, 
  onRun, 
  isLoading, 
  disabled 
}) => {
  const { t } = useTranslation(); // ★追加

  // ★変更: t()を使うためコンポーネント内部で定義
  const ALGORITHMS = [
    {id: 'histogram', label: 'Histogram', desc: t('control.desc.histogram')},
    {id: 'reinhard', label: 'Reinhard', desc: t('control.desc.reinhard')},
    {id: 'covariance', label: 'Covariance', desc: t('control.desc.covariance')},
    {id: 'kmeans', label: 'Clustering AI', desc: t('control.desc.kmeans')},
  ];

  return (
    <section className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold text-sm shadow-inner">2</div>
        <h2 className="text-xl font-bold text-zinc-200">{t('control.step')}</h2> {/* ★翻訳 */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 space-y-3">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{t('control.algo_label')}</label> {/* ★翻訳 */}
          <div className="flex flex-wrap gap-2">
            {ALGORITHMS.map((m) => (
              <label key={m.id} className={`relative group cursor-pointer px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${method === m.id ? 'bg-zinc-100 text-black border-zinc-100 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'}`}>
                <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={(e) => setMethod(e.target.value)} className="hidden" />
                {m.label}
                <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-2.5 bg-zinc-950/95 text-zinc-300 text-xs rounded-lg border border-zinc-800 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 text-center shadow-2xl translate-y-2 group-hover:translate-y-0 backdrop-blur-sm">
                  {m.desc}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-950/95"></div>
                </div>
              </label>
            ))}
          </div>
          <p className="text-xs text-zinc-500 h-4 pl-1">
            {ALGORITHMS.find(a => a.id === method)?.desc}
          </p>
        </div>
        
        <div className="md:col-span-3 flex items-center">
          <label className="flex flex-wrap md:flex-nowrap items-center gap-3 cursor-pointer select-none group relative w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 flex-shrink-0 rounded flex items-center justify-center border transition-colors ${preserveLum ? 'bg-purple-500 border-purple-500' : 'bg-zinc-800 border-zinc-600 group-hover:border-zinc-500'}`}>
                {preserveLum && <ArrowRight className="text-white rotate-[-45deg]" size={14} strokeWidth={4} />}
              </div>
              <input type="checkbox" checked={preserveLum} onChange={(e) => setPreserveLum(e.target.checked)} className="hidden" />
              <span className="text-zinc-300 text-sm group-hover:text-white transition-colors">
                {t('control.preserve_lum')}<br/> {/* ★翻訳 */}
                <span className="text-xs text-zinc-500">{t('control.preserve_lum_sub')}</span> {/* ★翻訳 */}
              </span>
            </div>
            
            <div className="
              static block mt-2 w-full text-left
              md:absolute md:bottom-full md:left-1/2 md:-translate-x-1/2 md:mb-3 md:w-64 md:text-center md:mt-0
              p-3 bg-zinc-950/95 text-zinc-300 text-xs rounded-lg border border-zinc-800 
              md:pointer-events-none 
              opacity-100 md:opacity-0 md:group-hover:opacity-100 
              transition-all duration-200 z-50 shadow-2xl 
              md:translate-y-2 md:group-hover:translate-y-0 backdrop-blur-sm
            ">
              <div className="space-y-1">
                <p><span className="text-purple-400 font-bold">ON:</span> {t('control.lum_tooltip_on')}</p> {/* ★翻訳 */}
                <p><span className="text-zinc-500 font-bold">OFF:</span> {t('control.lum_tooltip_off')}</p> {/* ★翻訳 */}
              </div>
              <div className="mt-2 text-zinc-500 text-[10px] border-t border-zinc-800 pt-1">
                {t('control.lum_tooltip_note')} {/* ★翻訳 */}
              </div>
              <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-950/95"></div>
            </div>
          </label>
        </div>
        <div className="md:col-span-2">
          <button onClick={onRun} disabled={disabled} className={`w-full py-4 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${disabled ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-purple-900/30'}`}>
            {isLoading ? t('control.processing') : <>{t('control.create_btn')} <ArrowRight size={16}/></>} {/* ★翻訳 */}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ControlPanel;