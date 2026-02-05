'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, ScrollToPlugin } from 'gsap/all';
import Navigation from './NavigationNext';
import ContactModal from '@/components/ContactModal';
import HeroSection from '../../sections/HeroSection';
import StudioSection from '../../sections/StudioSection';
import GallerySection from '../../sections/GallerySection';
import ProcessSection from '../../sections/ProcessSection';
import ServicesSection from '../../sections/ServicesSection';
import ImpactSection from '../../sections/ImpactSection';
import CTASection from '../../sections/CTASection';
import StoryFeatureSection from '../../sections/StoryFeatureSection';
import BTSSection from '../../sections/BTSSection';
import PartnersSection from '../../sections/PartnersSection';
import ClosingSection from '../../sections/ClosingSection';
import JournalSection from '../../sections/JournalSection';
import Footer from '../../sections/Footer';
import { HomeClientProps } from '@/types/database';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

export default function HomeClient({
    initialProjects,
    initialHeroData,
    initialJournalPosts,
    initialImpactData,
    initialStudioData,
    initialProcessData,
    initialStoryData,
    initialBTSData,
    initialServicesData
}: HomeClientProps) {
    const [mounted, setMounted] = useState(false);
    const mainRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);

        const refreshTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

        if (typeof window !== 'undefined' && window.location.hash) {
            const hash = window.location.hash;
            setTimeout(() => {
                gsap.to(window, {
                    duration: 2.5,
                    scrollTo: { y: hash, autoKill: false },
                    ease: 'power2.inOut'
                });
            }, 500);
        }

        return () => {
            clearTimeout(refreshTimer);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    // We still render on server for SEO, but we use suppressHydrationWarning
    // on the root container to handle minor GSAP/extension mismatches.
    return (
        <div
            ref={mainRef}
            className="relative bg-background"
            suppressHydrationWarning
        >
            <Navigation />
            <ContactModal />

            <div className="main-wrapper relative">
                <main className="relative">
                    <HeroSection className="z-10" data={initialHeroData} />
                    <StudioSection className="z-20" data={initialStudioData} />
                    <GallerySection className="z-30" projects={initialProjects} />
                    <ProcessSection className="z-40" data={initialProcessData} />
                    <ServicesSection className="z-50" data={initialServicesData} />
                    <ImpactSection className="z-[60]" data={initialImpactData} />
                    <CTASection className="z-[70]" />
                    <StoryFeatureSection className="z-[80]" data={initialStoryData} />
                    <BTSSection className="z-[90]" data={initialBTSData} />
                    <PartnersSection className="z-[100]" />
                    <ClosingSection className="z-[110]" />
                    <JournalSection className="z-[120]" posts={initialJournalPosts} />
                    <Footer className="z-[130]" />
                </main>
            </div>
        </div>
    );
}
