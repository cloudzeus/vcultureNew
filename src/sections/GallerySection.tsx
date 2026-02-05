import { useRef, useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Play } from 'lucide-react';
import VideoModal from '../components/VideoModal';
import { ProjectWithCategory } from '@/types/database';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

interface GallerySectionProps {
  className?: string;
  projects?: ProjectWithCategory[];
}

const defaultProjects = [
  {
    title: 'Οι σκέψεις της Νεφέλης',
    titleEn: 'Nefeli\'s Thoughts',
    meta: 'Μικρού μήκους • Σχολικός εκφοβισμός',
    metaEn: 'Short Film • School Bullying',
    image: '/images/3.jpg',
    video: 'https://vculture.b-cdn.net/video/nefeli%203%20trailer.mp4',
    category: { name: 'Παιδιά & Νεολαία', nameEn: 'Youth & Children' },
  },
  {
    title: 'Ρόδα είναι και γυρίζει',
    titleEn: 'The Wheel Turns',
    meta: 'Ντοκιμαντέρ • ΑμεΑ',
    metaEn: 'Documentary • PwD',
    image: '/images/rodaIne.jpg',
    video: 'https://vculture.b-cdn.net/video/rodaIneKaiGyriziTrailer.mp4',
    category: { name: 'ΑμεΑ', nameEn: 'PwD' },
  },
  {
    title: 'Κάθε στιγμή που έζησα',
    titleEn: 'Every Moment I Lived',
    meta: 'Μικρού μήκους • Κοινωνικό',
    metaEn: 'Short Film • Social',
    image: '/images/4.jpg',
    video: 'https://vculture.b-cdn.net/video/katheStigmiPuEzisaTrailer.mp4',
    category: { name: 'Κοινωνικό', nameEn: 'Social' },
  },
];

export default function GallerySection({ className = '', projects: dynamicProjects }: GallerySectionProps) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightTopRef = useRef<HTMLDivElement>(null);
  const rightBottomRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLButtonElement>(null);

  // Map dynamic projects or use defaults
  const displayProjects = dynamicProjects && dynamicProjects.length > 0
    ? dynamicProjects.map(p => {
      // Translation helper for project type
      const typeMap: Record<string, string> = {
        'SHORT_FILM': t('Μικρού μήκους', 'Short Film'),
        'DOCUMENTARY': t('Ντοκιμαντέρ', 'Documentary'),
        'CAMPAIGN': t('Καμπάνια', 'Campaign'),
        'COMMERCIAL': t('Διαφήμιση', 'Commercial')
      };
      const typeText = typeMap[p.type] || p.type;
      const durationText = p.duration; // Assuming duration is universal "15'" or "15 min"

      return {
        title: t(p.title, p.titleEn),
        meta: `${typeText} • ${durationText}`,
        image: p.heroImageUrl || '/images/3.jpg',
        video: p.trailerUrl || '',
        category: t(p.category?.name || 'Category', p.category?.nameEn),
      };
    })
    : defaultProjects.map(p => ({
      title: t(p.title, p.titleEn),
      meta: t(p.meta, p.metaEn),
      image: p.image,
      video: p.video,
      category: t(p.category.name, p.category.nameEn)
    }));

  // Fill up with defaults if fewer than 3
  while (displayProjects.length < 3 && defaultProjects.length >= 3) {
    const defaultProjRaw = defaultProjects[displayProjects.length];
    const defaultProj = {
      title: t(defaultProjRaw.title, defaultProjRaw.titleEn),
      meta: t(defaultProjRaw.meta, defaultProjRaw.metaEn),
      image: defaultProjRaw.image,
      video: defaultProjRaw.video,
      category: t(defaultProjRaw.category.name, defaultProjRaw.category.nameEn)
    };
    displayProjects.push(defaultProj);
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: '+=140%',
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
        },
      });

      // Left hero card
      scrollTl.fromTo(
        leftCardRef.current,
        { x: '-60vw', rotateY: 22, autoAlpha: 0 },
        { x: 0, rotateY: 0, autoAlpha: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        leftCardRef.current,
        { y: 0, rotateY: 0, autoAlpha: 1 },
        { y: '14vh', rotateY: -12, autoAlpha: 0.3, ease: 'power2.in' },
        0.7
      );

      // Right top card
      scrollTl.fromTo(
        rightTopRef.current,
        { x: '40vw', y: '-30vh', rotateZ: 6, autoAlpha: 0 },
        { x: 0, y: 0, rotateZ: 0, autoAlpha: 1, ease: 'none' },
        0.08
      );

      scrollTl.fromTo(
        rightTopRef.current,
        { x: 0, autoAlpha: 1 },
        { x: '18vw', autoAlpha: 0.25, ease: 'power2.in' },
        0.7
      );

      // Right bottom card
      scrollTl.fromTo(
        rightBottomRef.current,
        { x: '45vw', y: '30vh', rotateZ: -6, autoAlpha: 0 },
        { x: 0, y: 0, rotateZ: 0, autoAlpha: 1, ease: 'none' },
        0.12
      );

      scrollTl.fromTo(
        rightBottomRef.current,
        { x: 0, autoAlpha: 1 },
        { x: '18vw', autoAlpha: 0.25, ease: 'power2.in' },
        0.7
      );

      // View all link
      scrollTl.fromTo(
        linkRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, ease: 'none' },
        0.2
      );

      scrollTl.fromTo(
        linkRef.current,
        { autoAlpha: 1 },
        { autoAlpha: 0, ease: 'power2.in' },
        0.8
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handlePlayVideo = (videoUrl: string, title: string) => {
    if (!videoUrl) return;
    setSelectedVideo({ url: videoUrl, title });
  };

  const viewAllText = t('Δες όλη τη δουλειά', 'View all work');

  return (
    <>
      <section
        ref={containerRef}
        id="work"
        className={`${className} relative overflow-hidden`}
      >
        <div ref={pinRef} className="h-screen w-full relative">
          {/* Background */}
          <div className="absolute inset-0 bg-background">
            <div className="vignette" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center px-8 md:px-[8vw]">
            <div className="w-full flex flex-col lg:flex-row gap-6 h-[72vh]">
              {/* Left Hero Card */}
              {displayProjects[0] && (
                <div
                  ref={leftCardRef}
                  className="lg:w-[52vw] w-full h-full perspective-1000"
                >
                  <div className="relative h-full rounded-[1.125rem] overflow-hidden card-hover group">
                    <img
                      src={displayProjects[0].image}
                      alt={displayProjects[0].title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                    {/* Play button */}
                    <button
                      onClick={() => handlePlayVideo(displayProjects[0].video, displayProjects[0].title)}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center transition-transform hover:scale-110 z-20"
                      aria-label={`Play video: ${displayProjects[0].title}`}
                    >
                      <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                    </button>

                    {/* Card Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary mb-3 inline-block">
                        {displayProjects[0].category}
                      </span>
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {displayProjects[0].title}
                      </h3>
                      <p className="text-zinc-300">{displayProjects[0].meta}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Right Column */}
              <div className="lg:w-[28vw] w-full flex flex-col gap-4 h-full">
                {/* Top Card */}
                {displayProjects[1] && (
                  <div
                    ref={rightTopRef}
                    className="flex-1 perspective-1000"
                  >
                    <div className="relative h-full rounded-[1.125rem] overflow-hidden card-hover group">
                      <img
                        src={displayProjects[1].image}
                        alt={displayProjects[1].title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                      {/* Play button */}
                      <button
                        onClick={() => handlePlayVideo(displayProjects[1].video, displayProjects[1].title)}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center transition-transform hover:scale-110 z-20"
                        aria-label={`Play video: ${displayProjects[1].title}`}
                      >
                        <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary mb-2 inline-block">
                          {displayProjects[1].category}
                        </span>
                        <h3 className="text-xl font-semibold text-white mb-1">
                          {displayProjects[1].title}
                        </h3>
                        <p className="text-sm text-zinc-300">{displayProjects[1].meta}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Card */}
                {displayProjects[2] && (
                  <div
                    ref={rightBottomRef}
                    className="flex-1 perspective-1000"
                  >
                    <div className="relative h-full rounded-[1.125rem] overflow-hidden card-hover group">
                      <img
                        src={displayProjects[2].image}
                        alt={displayProjects[2].title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                      {/* Play button */}
                      <button
                        onClick={() => handlePlayVideo(displayProjects[2].video, displayProjects[2].title)}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center transition-transform hover:scale-110 z-20"
                        aria-label={`Play video: ${displayProjects[2].title}`}
                      >
                        <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary mb-2 inline-block">
                          {displayProjects[2].category}
                        </span>
                        <h3 className="text-xl font-semibold text-white mb-1">
                          {displayProjects[2].title}
                        </h3>
                        <p className="text-sm text-zinc-300">{displayProjects[2].meta}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* View All Link */}
          <button
            ref={linkRef}
            onClick={() => router.push('/movies')}
            className="absolute bottom-8 right-[8vw] flex items-center gap-2 text-zinc-300 hover:text-primary transition-colors z-20"
          >
            <span className="text-sm">{viewAllText}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
        />
      )}
    </>
  );
}