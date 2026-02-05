'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, Globe } from 'lucide-react';
import { useContact } from '@/context/ContactContext';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const getNavLinks = (t: (el: string, en?: string | null) => string) => [
    { label: t('Αρχική', 'Home'), href: '/', isRoute: true },
    { label: t('Projects', 'Projects'), href: '/movies', isRoute: true },
    { label: t('Υπηρεσίες', 'Services'), href: '#services' },
    { label: t('Studio', 'Studio'), href: '#studio' },
    { label: t('Journal', 'Journal'), href: '/journal', isRoute: true },
    { label: t('Επικοινωνία', 'Contact'), href: '#contact' },
];

export default function Navigation() {
    const router = useRouter();
    const pathname = usePathname();
    const { openContact } = useContact();
    const { language, toggleLanguage, t } = useLanguage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const navLinks = getNavLinks(t);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (navRef.current) {
            gsap.to(navRef.current, {
                y: isScrolled ? 0 : -100,
                opacity: isScrolled ? 1 : 0,
                duration: 0.4,
                ease: 'power2.out',
            });
        }
    }, [isScrolled]);

    const handleNavClick = (href: string, isRoute?: boolean) => {
        setIsMobileMenuOpen(false);

        if (href === '#contact') {
            openContact();
            return;
        }

        if (isRoute) {
            router.push(href);
        } else {
            if (pathname !== '/') {
                router.push('/');
                setTimeout(() => {
                    const element = document.querySelector(href);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 300);
            } else {
                const element = document.querySelector(href);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    };

    return (
        <div id="nav-container">
            <nav
                ref={navRef}
                className="fixed top-0 left-0 right-0 z-[1000] opacity-0 -translate-y-full"
                aria-label="Main navigation"
            >
                <div className="mx-4 mt-4">
                    <div className="glass-card px-8 py-4 flex items-center justify-between w-full">
                        <button
                            onClick={() => {
                                router.push('/');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex items-center"
                            aria-label="vculture home"
                        >
                            <img
                                src="/images/logo-dark.png"
                                alt="vculture logo"
                                className="h-8 w-auto"
                            />
                        </button>

                        <div className="hidden md:flex items-center gap-10">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavClick(link.href, link.isRoute);
                                    }}
                                    className="text-base text-white/90 hover:text-white transition-colors duration-300 font-medium"
                                >
                                    {link.label}
                                </a>
                            ))}

                            {/* Desktop Language Switcher */}
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-1 text-sm text-white/80 hover:text-white uppercase font-medium"
                            >
                                <Globe className="w-4 h-4" />
                                <span>{language === 'el' ? 'EN' : 'EL'}</span>
                            </button>
                        </div>

                        <a
                            href="#contact"
                            onClick={(e) => {
                                e.preventDefault();
                                openContact();
                            }}
                            className="hidden md:inline-flex btn-primary text-base py-3 px-8 ml-4"
                        >
                            {t('Ξεκίνα ένα project', 'Start a project')}
                        </a>

                        <div className="md:hidden flex items-center gap-4">
                            <button
                                onClick={toggleLanguage}
                                className="text-white/80 uppercase font-medium"
                            >
                                {language === 'el' ? 'EN' : 'EL'}
                            </button>
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 text-white"
                                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                                aria-expanded={isMobileMenuOpen}
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div
                className={`fixed inset-0 z-[999] bg-background/95 backdrop-blur-xl transition-all duration-500 md:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
            >
                <div className="flex flex-col items-center justify-center h-full gap-8">
                    {navLinks.map((link, index) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick(link.href, link.isRoute);
                            }}
                            className="text-2xl font-medium text-white hover:text-primary transition-colors"
                            style={{
                                transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms',
                                opacity: isMobileMenuOpen ? 1 : 0,
                                transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                            }}
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="#contact"
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick('#contact');
                        }}
                        className="btn-primary mt-4 text-sm py-2 px-6 h-auto"
                        style={{
                            transitionDelay: isMobileMenuOpen ? '250ms' : '0ms',
                            opacity: isMobileMenuOpen ? 1 : 0,
                        }}
                    >
                        {t('Ξεκίνα ένα project', 'Start a project')}
                    </a>
                </div>
            </div>

            <div
                className={`fixed top-8 left-8 z-[100] transition-opacity duration-500 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
            >
                <img
                    src="/images/logo-lite.png"
                    alt="vculture"
                    className="h-8 w-auto"
                />
            </div>

            <div
                className={`fixed top-8 right-8 z-[100] hidden md:flex items-center gap-10 transition-opacity duration-500 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
            >
                {navLinks.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(link.href, link.isRoute);
                        }}
                        className="text-base text-white/80 hover:text-white transition-colors duration-300 font-medium"
                    >
                        {link.label}
                    </a>
                ))}

                {/* Static Nav Language Switcher */}
                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-1 text-sm text-white/80 hover:text-white uppercase font-medium"
                >
                    <Globe className="w-4 h-4" />
                    <span>{language === 'el' ? 'EN' : 'EL'}</span>
                </button>
            </div>
        </div>
    );
}
