import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { LanguageProvider } from './contexts/LanguageContext'; // ★追加

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ★AppをLanguageProviderで包む */}
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
);