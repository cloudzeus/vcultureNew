import { useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, ArrowRight } from 'lucide-react';
import { journalPosts } from '../data/journal';

gsap.registerPlugin(ScrollTrigger);

interface JournalSectionProps {
  className?: string;
}

export default function JournalSection({ className = '' }: JournalSectionProps) {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const articlesRef = useRef<(HTMLDivElement | null)[]>([]);

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
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Articles reveal
      articlesRef.current.forEach((article, index) => {
        if (!article) return;

        gsap.fromTo(
          article,
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: article,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="journal"
      className={`relative bg-background py-24 md:py-32 ${className}`}
    >
      <div className="px-8 md:px-[8vw]">
        {/* Header */}
        <div ref={headerRef} className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Journal of voices
          </h2>
          <p className="text-lg text-zinc-300">
            Άρθρα, σημειώσεις από τα γυρίσματα και φωτογραφικά δοκίμια που φωτίζουν όσα δεν φαίνονται στην οθόνη.
          </p>
        </div>

        {/* Articles List */}
        <div className="space-y-6">
          {journalPosts.slice(0, 4).map((article, index) => (
            <div
              key={article.id}
              ref={(el: HTMLDivElement | null) => { articlesRef.current[index] = el; }}
              onClick={() => navigate(`/journal/${article.id}`)}
              className="group cursor-pointer"
            >
              <div className="flex flex-col md:flex-row gap-6 p-6 rounded-[1.125rem] border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-300">
                {/* Thumbnail */}
                <div className="md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-xs font-medium tracking-wider uppercase text-primary">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-zinc-400">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors mb-2">
                    {article.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-zinc-400 group-hover:text-primary transition-colors">
                    <span>Διάβασε το άρθρο</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/journal')}
            className="btn-secondary mb-6"
          >
            Δες όλα τα άρθρα
          </button>
          <p className="text-zinc-400">
            «Αν ένα κείμενο εδώ σε άγγιξε, μοιράσου το. Κάπως έτσι αρχίζει η αλλαγή.»
          </p>
        </div>
      </div>
    </section>
  );
}