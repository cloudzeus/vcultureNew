import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/context/LanguageContext';
import { ProcessData } from '@/types/database';

gsap.registerPlugin(ScrollTrigger);

interface ProcessSectionProps {
  className?: string;
  data: ProcessData | null;
}

export default function ProcessSection({ className = '', data }: ProcessSectionProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
        },
      });

      // Background
      scrollTl.fromTo(
        bgRef.current,
        { scale: 1.1, opacity: 0.7 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1, opacity: 1 },
        { scale: 1.05, opacity: 0.5, ease: 'power2.in' },
        0.7
      );

      // Headline
      scrollTl.fromTo(
        headlineRef.current,
        { y: 60, rotateX: 35, autoAlpha: 0 },
        { y: 0, rotateX: 0, autoAlpha: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        headlineRef.current,
        { y: 0, autoAlpha: 1 },
        { y: -40, autoAlpha: 0.2, ease: 'power2.in' },
        0.7
      );

      // Body
      scrollTl.fromTo(
        bodyRef.current,
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, ease: 'none' },
        0.08
      );

      scrollTl.fromTo(
        bodyRef.current,
        { y: 0, autoAlpha: 1 },
        { y: -20, autoAlpha: 0.2, ease: 'power2.in' },
        0.72
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const bgImage = data?.backgroundImageUrl || '/images/5.jpg';
  const headline = t(
    data?.headline || '«Η κάμερα δεν είναι<br />ουδέτερη.<br />Διαλέγει πλευρά.»',
    data?.headlineEn
  );
  const description = t(data?.description || 'Εμείς διαλέγουμε τους ανθρώπους.', data?.descriptionEn);

  return (
    <section
      ref={containerRef}
      className={`${className} relative overflow-hidden`}
    >
      <div ref={pinRef} className="h-screen w-full relative">
        {/* Background Image */}
        <div ref={bgRef} className="absolute inset-0 w-full h-full">
          <img
            src={bgImage}
            alt="Process background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-8 md:px-[8vw]">
          <div className="max-w-4xl text-center perspective-1000">
            {/* Headline */}
            <h2
              ref={headlineRef}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8"
              dangerouslySetInnerHTML={{ __html: headline }}
            />

            {/* Body */}
            <p
              ref={bodyRef}
              className="text-lg md:text-xl text-zinc-200 max-w-2xl mx-auto leading-relaxed"
            >
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}