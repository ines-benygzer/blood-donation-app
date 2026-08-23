import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';
import arTranslation from './locales/ar.json';
import frTranslation from './locales/fr.json';

const resources = {
    en: {
        translation: enTranslation
    },
    ar: {
        translation: arTranslation
    },
    fr: {
        translation: frTranslation
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

// Handle RTL for Arabic
i18n.on('languageChanged', (lng) => {
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
});

// Set initial direction
document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = i18n.language || 'en';

export default i18n;
