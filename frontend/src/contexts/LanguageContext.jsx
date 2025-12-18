import React, { createContext, useState, useContext, useCallback } from 'react';
import { translations } from '../locales/translations';

// 1. コンテキスト（データの通り道）を作成
const LanguageContext = createContext();

// 2. プロバイダー（データを配信する親コンポーネント）を作成
export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('ja'); // デフォルトは日本語

  // 言語切り替え関数
  const toggleLanguage = useCallback(() => {
    setLang((prev) => (prev === 'ja' ? 'en' : 'ja'));
  }, []);

  // 翻訳関数 t('key.subkey')
  const t = useCallback((path) => {
    const keys = path.split('.');
    let value = translations[lang];
    
    for (const key of keys) {
      if (value === undefined) return path; // 見つからなければキーをそのまま返す
      value = value[key];
    }
    return value;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 3. 簡単に使うためのカスタムフック
export const useTranslation = () => useContext(LanguageContext);