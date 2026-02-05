import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play } from 'lucide-react';
import { StudioData } from '@/types/database';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

interface StudioSectionProps {
  className?: string;
  data: StudioData | null;
}

export default function StudioSection({ className = '', data }: StudioSectionProps) {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const eyebrow = t(data?.eyebrow || 'Το Studio', data?.eyebrowEn);
  const headline = t(data?.headline || 'Η vculture είναι ένα social-first video studio.', data?.headlineEn);
  const description = t(
    data?.description || 'Συνεργαζόμαστε με ΜΚΟ, ιδρύματα και συνειδητές εταιρείες για να μετατρέπουμε πολύπλοκες πραγματικότητες σε σαφείς, ανθρώπινες ιστορίες—χωρίς να χάνουμε τη νuance.',
    data?.descriptionEn
  );
  const bgImage = data?.backgroundImageUrl || '/images/2.jpg';

  const cardTitle = t(data?.cardTitle || 'Οι σκέψεις της Νεφέλης', data?.cardTitleEn);
  const cardSubtitle = t(data?.cardSubtitle || 'Μικρού μήκους ταινία • Σχολικός εκφοβισμός', data?.cardSubtitleEn);
  const cardDescription = t(data?.cardDescription || '«Για τον σχολικό εκφοβισμό και τις σιωπές που τον τρέφουν»', data?.cardDescriptionEn);
  const cardImage = data?.cardImageUrl || '/images/3.jpg';
  const cardVideo = data?.cardVideoUrl || 'https://vculture.b-cdn.net/video/nefeli%203%20trailer.mp4';

  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

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

      // Background animation
      scrollTl.fromTo(
        bgRef.current,
        { scale: 1.08, y: '6vh', autoAlpha: 0.6 },
        { scale: 1, y: 0, autoAlpha: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        bgRef.current,
        { y: 0, autoAlpha: 1 },
        { y: '-8vh', autoAlpha: 0.35, ease: 'power2.in' },
        0.7
      );

      // Left text block
      scrollTl.fromTo(
        textBlockRef.current,
        { x: '-40vw', autoAlpha: 0 },
        { x: 0, autoAlpha: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        textBlockRef.current,
        { x: 0, autoAlpha: 1 },
        { x: '-10vw', autoAlpha: 0.2, ease: 'power2.in' },
        0.7
      );

      // Right card
      scrollTl.fromTo(
        cardRef.current,
        { x: '45vw', rotateY: 18, autoAlpha: 0 },
        { x: 0, rotateY: 0, autoAlpha: 1, ease: 'none' },
        0.05
      );

      scrollTl.fromTo(
        cardRef.current,
        { y: 0, rotateY: 0, autoAlpha: 1 },
        { y: '10vh', rotateY: -10, autoAlpha: 0.25, ease: 'power2.in' },
        0.7
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="studio"
      className={`${className} relative overflow-hidden`}
    >
      <div ref={pinRef} className="h-screen w-full relative">
        {/* Background Image */}
        <div ref={bgRef} className="absolute inset-0 w-full h-full">
          <img
            src={bgImage}
            alt="Studio Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/50 to-background/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-8 md:px-[8vw]">
          <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Text Block */}
            <div
              ref={textBlockRef}
              className="lg:w-[34vw] max-w-xl"
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="micro-label">{eyebrow}</span>
              </div>

              {/* Headline */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                {headline}
              </h2>

              {/* Body */}
              <p className="text-lg text-zinc-200 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Right Card */}
            <div
              ref={cardRef}
              className="lg:w-[34vw] w-full max-w-md perspective-1000"
            >
              <div className="glass-card overflow-hidden card-hover">
                {/* Card Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={cardImage}
                    alt={cardTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

                  {/* Play button */}
                  <a
                    href={cardVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center transition-transform hover:scale-110"
                    aria-label={`Play: ${cardTitle}`}
                  >
                    <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
                  </a>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {cardTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {cardSubtitle}
                  </p>
                  <p className="text-sm text-zinc-400 mb-4">
                    {cardDescription}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                      {t('Βασικός Αντίκτυπος: Ευαισθητοποίηση στα σχολεία', 'Key Impact: Awareness in schools')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}