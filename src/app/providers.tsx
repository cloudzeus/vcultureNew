'use client';

import { ContactProvider } from '@/context/ContactContext';
import { LanguageProvider } from '@/context/LanguageContext';
import SmoothScroll from '../components/SmoothScroll';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            <ContactProvider>
                <SmoothScroll>
                    {children}
                </SmoothScroll>
            </ContactProvider>
        </LanguageProvider>
    );
}
