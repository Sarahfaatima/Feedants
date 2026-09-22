import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../i18n/translations';

const LANGUAGE_STORAGE_KEY = 'feedants.language';
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored === 'en' || stored === 'hi') setLanguageState(stored);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const setLanguage = useCallback(async (lang) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (err) {
      // non-fatal: language just won't persist across app restarts
    }
  }, []);

  // Translates a static UI string key, with optional {placeholder} interpolation.
  const t = useCallback(
    (key, params) => {
      const dict = translations[language] || translations.en;
      let str = dict[key] ?? translations.en[key] ?? key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, v);
        });
      }
      return str;
    },
    [language]
  );

  // Picks the right localized field from a backend { en, hi } object.
  const localize = useCallback(
    (localizedField) => {
      if (!localizedField) return '';
      return localizedField[language] || localizedField.en || '';
    },
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t, localize, ready }),
    [language, setLanguage, t, localize, ready]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
