import React from 'react';
import { Sparkles, HelpCircle, RefreshCw, Languages } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

const Header = ({ onShowHelp, onSwap }) => {
  const { toggleLanguage, lang } = useTranslation();

  return (
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
      <div className="flex items-center gap-3">
        {/* ★追加: 言語切り替えボタン */}
        <button 
          onClick={toggleLanguage} 
          className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-700 transition-all flex items-center gap-1"
          title="Switch Language"
        >
          <Languages size={20} />
          <span className="text-xs font-bold w-4">{lang === 'ja' ? 'JP' : 'EN'}</span>
        </button>

        <button 
          onClick={onShowHelp} 
          className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-700 transition-all"
          title="How to use"
        >
          <HelpCircle size={20} />
        </button>
        <button onClick={onSwap} className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 px-5 py-2.5 rounded-full transition-all hover:border-zinc-500 active:scale-95 text-sm font-medium">
          <RefreshCw size={16} /> Swap Images
        </button>
      </div>
    </header>
  );
};

export default Header;