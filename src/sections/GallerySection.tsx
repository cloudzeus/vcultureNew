import { useRef, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Play } from 'lucide-react';
import VideoModal from '../components/VideoModal';

gsap.registerPlugin(ScrollTrigger);

interface GallerySectionProps {
  className?: string;
}

const projects = [
  {
    title: 'Οι σκέψεις της Νεφέλης',
    meta: 'Μικρού μήκους • Σχολικός εκφοβισμός',
    image: '/images/3.jpg',
    video: 'https://vculture.b-cdn.net/video/nefeli%203%20trailer.mp4',
    category: 'Παιδιά & Νεολαία',
  },
  {
    title: 'Ρόδα είναι και γυρίζει',
    meta: 'Ντοκιμαντέρ • ΑμεΑ',
    image: '/images/rodaIne.jpg',
    video: 'https://vculture.b-cdn.net/video/rodaIneKaiGyriziTrailer.mp4',
    category: 'ΑμεΑ',
  },
  {
    title: 'Κάθε στιγμή που έζησα',
    meta: 'Μικρού μήκους • Κοινωνικό',
    image: '/images/4.jpg',
    video: 'https://vculture.b-cdn.net/video/katheStigmiPuEzisaTrailer.mp4',
    category: 'Κοινωνικό',
  },
];

export default function GallerySection({ className = '' }: GallerySectionProps) {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightTopRef = useRef<HTMLDivElement>(null);
  const rightBottomRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.6,
        },
      });

      // Left hero card
      scrollTl.fromTo(
        leftCardRef.current,
        { x: '-60vw', rotateY: 22, opacity: 0 },
        { x: 0, rotateY: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        leftCardRef.current,
        { y: 0, rotateY: 0, opacity: 1 },
        { y: '14vh', rotateY: -12, opacity: 0.3, ease: 'power2.in' },
        0.7
      );

      // Right top card
      scrollTl.fromTo(
        rightTopRef.current,
        { x: '40vw', y: '-30vh', rotateZ: 6, opacity: 0 },
        { x: 0, y: 0, rotateZ: 0, opacity: 1, ease: 'none' },
        0.08
      );

      scrollTl.fromTo(
        rightTopRef.current,
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      // Right bottom card
      scrollTl.fromTo(
        rightBottomRef.current,
        { x: '45vw', y: '30vh', rotateZ: -6, opacity: 0 },
        { x: 0, y: 0, rotateZ: 0, opacity: 1, ease: 'none' },
        0.12
      );

      scrollTl.fromTo(
        rightBottomRef.current,
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      // View all link
      scrollTl.fromTo(
        linkRef.current,
        { opacity: 0 },
        { opacity: 1, ease: 'none' },
        0.2
      );

      scrollTl.fromTo(
        linkRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.8
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handlePlayVideo = (videoUrl: string, title: string) => {
    setSelectedVideo({ url: videoUrl, title });
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="work"
        className={`section-pinned ${className}`}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-background">
          <div className="vignette" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-8 md:px-[8vw]">
          <div className="w-full flex flex-col lg:flex-row gap-6 h-[72vh]">
            {/* Left Hero Card */}
            <div
              ref={leftCardRef}
              className="lg:w-[52vw] w-full h-full perspective-1000"
            >
              <div className="relative h-full rounded-[1.125rem] overflow-hidden card-hover group">
                <img
                  src={projects[0].image}
                  alt={projects[0].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                {/* Play button */}
                <button
                  onClick={() => handlePlayVideo(projects[0].video, projects[0].title)}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center transition-transform hover:scale-110 z-20"
                  aria-label={`Play video: ${projects[0].title}`}
                >
                  <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                </button>

                {/* Card Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary mb-3 inline-block">
                    {projects[0].category}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {projects[0].title}
                  </h3>
                  <p className="text-zinc-300">{projects[0].meta}</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:w-[28vw] w-full flex flex-col gap-4 h-full">
              {/* Top Card */}
              <div
                ref={rightTopRef}
                className="flex-1 perspective-1000"
              >
                <div className="relative h-full rounded-[1.125rem] overflow-hidden card-hover group">
                  <img
                    src={projects[1].image}
                    alt={projects[1].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                  {/* Play button */}
                  <button
                    onClick={() => handlePlayVideo(projects[1].video, projects[1].title)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center transition-transform hover:scale-110 z-20"
                    aria-label={`Play video: ${projects[1].title}`}
                  >
                    <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary mb-2 inline-block">
                      {projects[1].category}
                    </span>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {projects[1].title}
                    </h3>
                    <p className="text-sm text-zinc-300">{projects[1].meta}</p>
                  </div>
                </div>
              </div>

              {/* Bottom Card */}
              <div
                ref={rightBottomRef}
                className="flex-1 perspective-1000"
              >
                <div className="relative h-full rounded-[1.125rem] overflow-hidden card-hover group">
                  <img
                    src={projects[2].image}
                    alt={projects[2].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                  {/* Play button */}
                  <button
                    onClick={() => handlePlayVideo(projects[2].video, projects[2].title)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center transition-transform hover:scale-110 z-20"
                    aria-label={`Play video: ${projects[2].title}`}
                  >
                    <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary mb-2 inline-block">
                      {projects[2].category}
                    </span>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {projects[2].title}
                    </h3>
                    <p className="text-sm text-zinc-300">{projects[2].meta}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View All Link */}
        <button
          ref={linkRef}
          onClick={() => navigate('/movies')}
          className="absolute bottom-8 right-[8vw] flex items-center gap-2 text-zinc-300 hover:text-primary transition-colors z-20"
        >
          <span className="text-sm">Δες όλη τη δουλειά</span>
          <ArrowRight size={16} />
        </button>
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