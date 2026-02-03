import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap, ScrollTrigger, ScrollToPlugin } from 'gsap/all';
import Navigation from '../components/Navigation';
import HeroSection from '../sections/HeroSection';
import StudioSection from '../sections/StudioSection';
import GallerySection from '../sections/GallerySection';
import ProcessSection from '../sections/ProcessSection';
import ServicesSection from '../sections/ServicesSection';
import ImpactSection from '../sections/ImpactSection';
import CTASection from '../sections/CTASection';
import StoryFeatureSection from '../sections/StoryFeatureSection';
import BTSSection from '../sections/BTSSection';
import PartnersSection from '../sections/PartnersSection';
import ClosingSection from '../sections/ClosingSection';
import JournalSection from '../sections/JournalSection';
import Footer from '../sections/Footer';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function HomePage() {
    const mainRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    useEffect(() => {
        // We rely on native scroll + ScrollTrigger for animations now.
        // The previous Observer implementation was hijacking scroll and causing issues.

        // Refresh ScrollTrigger when comp mounts/updates to ensure positions are correct
        ScrollTrigger.refresh();

        // Handle hash navigation
        if (location.hash) {
            // Force reset to top so animation starts from 0
            window.scrollTo(0, 0);

            // Smooth scroll to target
            setTimeout(() => {
                gsap.to(window, {
                    duration: 2.5,
                    scrollTo: { y: location.hash, autoKill: false },
                    ease: 'power2.inOut'
                });
            }, 100);
        }

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [location]);

    return (
        <div ref={mainRef} className="relative bg-background">
            {/* Noise overlay */}
            <div className="noise-overlay" />

            {/* Navigation */}
            <Navigation />

            {/* Main content */}
            <main className="relative">
                <HeroSection className="z-10" />
                <StudioSection className="z-20" />
                <GallerySection className="z-30" />
                <ProcessSection className="z-40" />
                <ServicesSection className="z-50" />
                <ImpactSection className="z-[60]" />
                <CTASection className="z-[70]" />
                <StoryFeatureSection className="z-[80]" />
                <BTSSection className="z-[90]" />
                <PartnersSection className="z-[100]" />
                <ClosingSection className="z-[110]" />
                <JournalSection className="z-[120]" />
                <Footer className="z-[130]" />
            </main>
        </div>
    );
}
