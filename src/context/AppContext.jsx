import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { I18N } from '../data/portfolioData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('grela_dev_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // localStorage may be unavailable or restricted
    }
    return 'dark';
  });

  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('grela_dev_lang');
      if (saved === 'en' || saved === 'pl') return saved;
    } catch {
      // ignore
    }
    return 'en';
  });

  const [filterActive, setFilterActive] = useState(new Set());
  const [filterQuery, setFilterQuery] = useState('');

  const t = useCallback((k) => (I18N[lang] && I18N[lang][k]) || k, [lang]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      if (document.body) {
        document.body.setAttribute('data-theme', theme);
      }
    }
    try {
      localStorage.setItem('grela_dev_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', lang);
    }
    try {
      localStorage.setItem('grela_dev_lang', lang);
    } catch {
      // ignore
    }
  }, [lang]);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        lang,
        setLang,
        t,
        filterActive,
        setFilterActive,
        filterQuery,
        setFilterQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
