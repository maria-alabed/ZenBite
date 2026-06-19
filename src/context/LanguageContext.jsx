// src/context/LanguageContext.jsx (نسخة محسنة)

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // استرجاع اللغة المحفوظة من localStorage
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'en';
  });

  // حفظ اللغة في localStorage عند التغيير
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // تغيير اللغة
  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  }, []);

  // تحديد اتجاه النص
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  // تطبيق الاتجاه على الـ HTML
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    document.body.classList.remove('lang-en', 'lang-ar');
    document.body.classList.add(`lang-${language}`);
    
    // 🔴 اختياري: تغيير اتجاه الـ scrollbar
    if (language === 'ar') {
      document.documentElement.style.setProperty('--scrollbar-direction', 'rtl');
    } else {
      document.documentElement.style.setProperty('--scrollbar-direction', 'ltr');
    }
  }, [dir, language]);

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    dir,
    isRTL: language === 'ar',
    isEN: language === 'en',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}