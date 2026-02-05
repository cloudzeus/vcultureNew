import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import { HeroData } from '@/types/database';
import { useLanguage } from '@/context/LanguageContext';
import { useContact } from '@/context/ContactContext';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  className?: string;
  data: HeroData | null;
}

export default function HeroSection({ className = '', data }: HeroSectionProps) {
  const { t } = useLanguage();
  const { openContact } = useContact();
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const titleMain = t(data?.titleMain || 'vculture', data?.titleMainEn);
  const titleSubtitle1 = t(data?.titleSubtitle1 || 'Κοινωνικές ιστορίες', data?.titleSubtitle1En);
  const titleSubtitle2 = t(data?.titleSubtitle2 || 'με αληθινούς ανθρώπους', data?.titleSubtitle2En);
  const description = t(
    data?.description || 'Οπτικοακουστικές αφηγήσεις για ανθρώπινα δικαιώματα, αξιοπρέπεια και τις φωνές που συνήθως δεν ακούγονται.',
    data?.descriptionEn
  );
  const primaryCtaText = t(data?.primaryCtaText || 'Δες τη δουλειά μας', data?.primaryCtaTextEn);
  const primaryCtaLink = data?.primaryCtaLink || '/movies';
  const secondaryCtaText = t(data?.secondaryCtaText || 'Συνεργάσου με τη vculture', data?.secondaryCtaTextEn);
  const secondaryCtaLink = data?.secondaryCtaLink || '#contact';
  const backgroundImageUrl = data?.backgroundImageUrl || '/images/1.jpg';
  const backgroundVideoUrl = data?.backgroundVideoUrl || undefined;
  const bannerImage = data?.afisaImageUrl || '/Banner1.png';
  const bannerLink = data?.afisaUrl || '/afisa.pdf';
  const showAfisa = data?.showAfisa ?? true;
  const afisaRef = useRef<HTMLDivElement>(null);

  // Auto-play entrance animation on load
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        bgRef.current,
        { autoAlpha: 0, scale: 1.1 },
        { autoAlpha: 1, scale: 1, duration: 1.2 }
      );

      tl.fromTo(
        headlineRef.current,
        { y: 60, rotateX: 35, autoAlpha: 0 },
        { y: 0, rotateX: 0, autoAlpha: 1, duration: 1 },
        0.2
      );

      tl.fromTo(
        subheadlineRef.current,
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8 },
        0.4
      );

      tl.fromTo(
        ctaRef.current,
        { y: 30, scale: 0.95, autoAlpha: 0 },
        { y: 0, scale: 1, autoAlpha: 1, duration: 0.6, ease: 'back.out(1.6)' },
        0.6
      );

      tl.fromTo(
        afisaRef.current,
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8 },
        0.8
      );

      tl.fromTo(
        scrollHintRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.5 },
        1
      );

      gsap.to(scrollHintRef.current, {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven exit animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
        },
      });

      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, autoAlpha: 1 },
        { x: '-18vw', autoAlpha: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        subheadlineRef.current,
        { x: 0, autoAlpha: 1 },
        { x: '-14vw', autoAlpha: 0, ease: 'power2.in' },
        0.72
      );

      scrollTl.fromTo(
        ctaRef.current,
        { x: 0, autoAlpha: 1 },
        { x: '-10vw', autoAlpha: 0, ease: 'power2.in' },
        0.74
      );

      scrollTl.fromTo(
        afisaRef.current,
        { x: 0, autoAlpha: 1 },
        { x: '10vw', autoAlpha: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        scrollHintRef.current,
        { autoAlpha: 1 },
        { autoAlpha: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1, y: 0 },
        { scale: 1.06, y: '-3vh', ease: 'none' },
        0.7
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToWork = (e: React.MouseEvent) => {
    if (primaryCtaLink.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(primaryCtaLink);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSecondaryClick = (e: React.MouseEvent) => {
    if (secondaryCtaLink === '#contact') {
      e.preventDefault();
      openContact();
    }
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className={`${className} relative overflow-hidden`}
    >
      <div ref={pinRef} className="h-screen w-full relative">
        {/* Background Media */}
        <div
          ref={bgRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          {backgroundVideoUrl ? (
            <video
              src={backgroundVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={backgroundImageUrl}
              alt="Hero background"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-background/35 via-background/20 to-background/72" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-[8vw]">
          <div className="max-w-4xl perspective-1000">
            <div className="w-24 h-px bg-primary mb-8" />

            <h1
              ref={headlineRef}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tight mb-8"
              style={{ opacity: 0, visibility: 'hidden' }}
            >
              {titleMain}
              <br />
              <span className="text-3xl md:text-5xl lg:text-6xl font-medium">
                {titleSubtitle1}
                <br />
                {titleSubtitle2}
              </span>
            </h1>

            <p
              ref={subheadlineRef}
              className="text-lg md:text-xl text-zinc-100 max-w-xl leading-relaxed mb-10"
              style={{ opacity: 0, visibility: 'hidden' }}
            >
              {description}
            </p>

            <div ref={ctaRef} className="flex flex-wrap gap-4" style={{ opacity: 0, visibility: 'hidden' }}>
              <a href={primaryCtaLink} onClick={scrollToWork} className="btn-primary">
                {primaryCtaText}
              </a>
              <a href={secondaryCtaLink} onClick={handleSecondaryClick} className="btn-secondary">
                {secondaryCtaText}
              </a>
            </div>
          </div>
        </div>

        {/* Banner/Afisa */}
        {showAfisa && (
          <div
            ref={afisaRef}
            className="absolute bottom-12 right-8 md:right-12 z-20 block w-full max-w-[280px] md:max-w-[420px]"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <a
              href={bannerLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-transform hover:scale-105 duration-300"
            >
              <img
                src={bannerImage}
                alt={t('Προβολή αφίσας', 'View poster')}
                className="w-full h-auto drop-shadow-2xl rounded-sm"
              />
            </a>
          </div>
        )}

        {/* Scroll Hint */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          <span className="text-xs tracking-widest uppercase">{t('Κύλιση', 'Scroll')}</span>
          <ChevronDown size={20} />
        </div>
      </div>
    </section>
  );
}