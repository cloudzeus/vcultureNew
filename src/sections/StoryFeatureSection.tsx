import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { StoryData } from '@/types/database';

gsap.registerPlugin(ScrollTrigger);

interface StoryFeatureSectionProps {
  className?: string;
  data: StoryData | null;
}

export default function StoryFeatureSection({ className = '', data }: StoryFeatureSectionProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

      // Background
      scrollTl.fromTo(
        bgRef.current,
        { scale: 1.08, y: '6vh' },
        { scale: 1, y: 0, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1, y: 0 },
        { scale: 1.05, y: '-6vh', ease: 'power2.in' },
        0.7
      );

      // Label
      scrollTl.fromTo(
        labelRef.current,
        { x: '20vw', autoAlpha: 0 },
        { x: 0, autoAlpha: 1, ease: 'none' },
        0.08
      );

      scrollTl.fromTo(
        labelRef.current,
        { autoAlpha: 1 },
        { autoAlpha: 0.2, ease: 'power2.in' },
        0.75
      );

      // Content
      scrollTl.fromTo(
        contentRef.current,
        { y: '40vh', autoAlpha: 0 },
        { y: 0, autoAlpha: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        contentRef.current,
        { y: 0, autoAlpha: 1 },
        { y: '18vh', autoAlpha: 0.25, ease: 'power2.in' },
        0.7
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const bgImage = data?.backgroundImageUrl || '/images/roda2.jpg';
  const label = t(data?.label || 'Ντοκιμαντέρ', data?.labelEn);
  const title = t(data?.title || 'Ρόδα είναι και γυρίζει', data?.titleEn);
  const description = t(
    data?.description || 'Ένα ντοκιμαντέρ για την ισότητα, την αναπηρία και τη δύναμη της ανθρώπινης θέλησης.',
    data?.descriptionEn
  );
  const videoUrl = data?.videoUrl || 'https://vculture.b-cdn.net/video/rodaIneKaiGyriziTrailer.mp4';
  const watchTrailerText = t('Δες το trailer', 'Watch trailer');

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
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>

        {/* Label */}
        <div
          ref={labelRef}
          className="absolute top-[10vh] right-[8vw] z-20"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full border border-white/20 text-sm text-zinc-200">
            {label}
          </span>
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="absolute bottom-[10vh] left-[8vw] right-[8vw] z-20"
        >
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {title}
            </h2>
            <p className="text-lg text-zinc-300 mb-6">
              {description}
            </p>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Play className="w-4 h-4" />
              <span>{watchTrailerText}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}