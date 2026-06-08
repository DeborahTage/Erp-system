import React, { createContext, useContext, useMemo, useState } from 'react';
import { getTranslationValue, LANGUAGE_STORAGE_KEY } from '../i18n';

const LanguageContext = createContext(null);
const FIXED_LANGUAGE = 'en';

export const LanguageProvider = ({ children }) => {
  const [language] = useState(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, FIXED_LANGUAGE);
    return FIXED_LANGUAGE;
  });

  const setLanguage = () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, FIXED_LANGUAGE);
  };

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (key, vars = {}) => {
      const result = getTranslationValue(language, key);
      if (typeof result !== 'string') return result;
      return Object.entries(vars).reduce(
        (text, [name, value]) => text.replace(new RegExp(`{{${name}}}`, 'g'), value ?? ''),
        result
      );
    }
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
