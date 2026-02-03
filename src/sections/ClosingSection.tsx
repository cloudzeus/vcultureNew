import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ClosingSectionProps {
  className?: string;
}

export default function ClosingSection({ className = '' }: ClosingSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.6,
        },
      });

      // Background
      scrollTl.fromTo(
        bgRef.current,
        { scale: 1.05, opacity: 0.7 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        bgRef.current,
        { opacity: 1 },
        { opacity: 0.4, ease: 'power2.in' },
        0.7
      );

      // Headline
      scrollTl.fromTo(
        headlineRef.current,
        { y: 70, rotateX: 35, autoAlpha: 0 },
        { y: 0, rotateX: 0, autoAlpha: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        headlineRef.current,
        { y: 0, autoAlpha: 1 },
        { y: -30, autoAlpha: 0.2, ease: 'power2.in' },
        0.7
      );

      // CTA
      scrollTl.fromTo(
        ctaRef.current,
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(
        ctaRef.current,
        { autoAlpha: 1 },
        { autoAlpha: 0.2, ease: 'power2.in' },
        0.75
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <div ref={bgRef} className="absolute inset-0 w-full h-full">
        <img
          src="/images/closing-bg.jpg"
          alt="Closing background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-8 md:px-[8vw]">
        <div className="max-w-4xl text-center perspective-1000">
          {/* Headline */}
          <h2
            ref={headlineRef}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-10"
          >
            Οι ιστορίες ξεκινούν
            <br />
            πάντα από μια συζήτηση.
            <br />
            <span className="text-3xl md:text-5xl font-medium text-zinc-200">
              Ας είναι αυτή η πρώτη.
            </span>
          </h2>

          {/* CTA */}
          <div ref={ctaRef} className="flex flex-wrap justify-center gap-4">
            <a href="#work" className="btn-primary">
              Δες τη δουλειά μας
            </a>
            <a href="#contact" className="btn-secondary">
              Επικοινώνησε
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}