'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'el' | 'en';

type LanguageContextType = {
    language: Language;
    toggleLanguage: () => void;
    setLanguage: (lang: Language) => void;
    t: (el: string, en?: string | null) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('el');

    useEffect(() => {
        // Load persisted language preference
        const saved = localStorage.getItem('vculture-lang') as Language;
        if (saved && (saved === 'el' || saved === 'en')) {
            setLanguageState(saved);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('vculture-lang', lang);
    };

    const toggleLanguage = () => {
        setLanguage(language === 'el' ? 'en' : 'el');
    };

    // Helper translation function
    // Usage: t(data.title, data.titleEn)
    // If english is selected and available, return english, else return greek
    const t = (el: string, en?: string | null) => {
        if (language === 'en' && en) {
            return en;
        }
        return el;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        // Prevent crash during hydration/SSR mismatches
        console.warn('useLanguage must be used within a LanguageProvider');
        return {
            language: 'el',
            toggleLanguage: () => console.warn('LanguageContext missing'),
            setLanguage: () => console.warn('LanguageContext missing'),
            t: (el: string) => el
        } as LanguageContextType;
    }
    return context;
}
