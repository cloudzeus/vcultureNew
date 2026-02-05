'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface ContactContextType {
    isOpen: boolean;
    openContact: () => void;
    closeContact: () => void;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export function ContactProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openContact = () => setIsOpen(true);
    const closeContact = () => setIsOpen(false);

    return (
        <ContactContext.Provider value={{ isOpen, openContact, closeContact }}>
            {children}
        </ContactContext.Provider>
    );
}

export function useContact() {
    const context = useContext(ContactContext);
    if (context === undefined) {
        // Prevent crash during hydration/SSR mismatches, but warn
        console.warn('useContact must be used within a ContactProvider');
        return {
            isOpen: false,
            openContact: () => console.warn('ContactContext missing: openContact called'),
            closeContact: () => console.warn('ContactContext missing: closeContact called'),
        };
    }
    return context;
}
