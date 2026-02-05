import { useRef, useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { journalPosts as staticPosts } from '../data/journal';
import { JournalPostWithTags } from '@/types/database';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

interface JournalSectionProps {
  className?: string;
  posts?: JournalPostWithTags[];
}

export default function JournalSection({ className = '', posts: dynamicPosts }: JournalSectionProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const articlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const imageRef = useRef<HTMLDivElement>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        headerRef.current,
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
          },
        }
      );

      // Articles initial reveal
      articlesRef.current.forEach((article, index) => {
        if (!article) return;
        gsap.fromTo(
          article,
          { y: 20, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: article,
              start: 'top 90%',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Floating image follow logic with smoothing and skew
  const onMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current || !hoveredImage) return;

    const bounds = sectionRef.current?.getBoundingClientRect();
    if (!bounds) return;

    // Relative to the section
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    // Movement speed for skew
    const xMove = e.movementX || 0;
    const skew = gsap.utils.clamp(-15, 15, xMove * 0.8);

    gsap.to(imageRef.current, {
      x: e.clientX,
      y: e.clientY,
      rotation: skew * 0.2,
      skewX: skew * 0.1,
      duration: 1,
      ease: 'power4.out',
      overwrite: 'auto'
    });
  };

  const displayArticles = (dynamicPosts && dynamicPosts.length > 0
    ? dynamicPosts.map(p => ({
      id: p.slug || p.id,
      title: t(p.title, p.titleEn),
      category: p.tags[0]?.tag.name || 'Field Notes',
      image: p.featuredImageUrl || '/images/bts-1.jpg'
    }))
    : staticPosts.map(p => ({
      id: p.id,
      title: t(p.title, p.titleEn),
      category: t(p.category, p.categoryEn),
      image: p.image
    }))
  ).slice(0, 5);

  return (
    <section
      ref={sectionRef}
      id="journal"
      className={`relative bg-background py-32 md:py-48 min-h-screen flex flex-col justify-center overflow-hidden cursor-none ${className}`}
      onMouseMove={onMouseMove}
    >
      {/* Floating Image Container (Fixed for stable follow) */}
      <div
        ref={imageRef}
        className="fixed pointer-events-none z-[100] w-[200px] h-[280px] md:w-[380px] md:h-[260px] -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-700 overflow-hidden rounded-lg shadow-2xl"
        style={{
          opacity: hoveredImage ? 0.4 : 0,
          mixBlendMode: 'screen',
          top: 0,
          left: 0
        }}
      >
        {hoveredImage && (
          <img
            src={hoveredImage}
            alt="Preview"
            className="w-full h-full object-cover grayscale brightness-125"
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-8 md:px-[8vw] relative z-10 w-full">
        {/* Header - Centered */}
        <div className="text-center mb-12 md:mb-20">
          <span className="micro-label block mb-4">{t('Σκέψεις & Ιστορίες', 'Thoughts & Stories')}</span>
          <h2 className="text-3xl md:text-6xl font-bold text-white tracking-tighter">
            {t('Journal', 'Journal')}
          </h2>
        </div>

        {/* Articles List - Centered Text Only */}
        <div className="flex flex-col items-center">
          {displayArticles.map((article) => (
            <div
              key={article.id}
              onMouseEnter={() => setHoveredImage(article.image)}
              onMouseLeave={() => setHoveredImage(null)}
              onClick={() => router.push(`/journal/${article.id}`)}
              className="group relative py-6 md:py-10 border-b border-white/5 w-full text-center cursor-pointer transition-all duration-500"
            >
              <div className="inline-block relative">
                <span className="block text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-primary mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  {article.category}
                </span>

                <h3 className="text-lg md:text-3xl lg:text-5xl xl:text-6xl font-bold text-white/20 group-hover:text-white transition-all duration-700 leading-[1.1] text-balance max-w-[90vw] mx-auto">
                  {article.title}
                </h3>

                {/* Underline mask effect */}
                <div className="absolute -bottom-2 left-0 w-0 h-[2px] bg-primary transition-all duration-700 group-hover:w-full" />
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-20 md:mt-32 text-center">
          <button
            onClick={() => router.push('/journal')}
            className="group inline-flex flex-col items-center gap-2"
          >
            <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors duration-300 tracking-widest uppercase">
              {t('Δείτε όλο το journal', 'Explore all stories')}
            </span>
            <div className="w-12 h-px bg-primary/40 group-hover:w-24 group-hover:bg-primary transition-all duration-500" />
          </button>
        </div>
      </div>
    </section>
  );
}