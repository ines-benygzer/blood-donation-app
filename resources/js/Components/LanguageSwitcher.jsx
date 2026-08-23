import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
    const { i18n, t } = useTranslation();

    const languages = [
        { code: 'en', name: t('english'), flag: '🇺🇸' },
        { code: 'ar', name: t('arabic'), flag: '🇸🇦' },
        { code: 'fr', name: t('french'), flag: '🇫🇷' },
    ];

    const changeLanguage = (code) => {
        i18n.changeLanguage(code);
    };

    return (
        <div className="relative inline-block text-left">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${i18n.language === lang.code
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        title={lang.name}
                    >
                        <span className="mr-1 rtl:ml-1">{lang.flag}</span>
                        <span className="hidden sm:inline">{lang.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
