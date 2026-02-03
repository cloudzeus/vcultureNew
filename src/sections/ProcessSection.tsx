import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ProcessSectionProps {
  className?: string;
}

export default function ProcessSection({ className = '' }: ProcessSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

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
          src="/images/5.jpg"
          alt="Textured background"
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
          >
            «Η κάμερα δεν είναι
            <br />
            ουδέτερη.
            <br />
            Διαλέγει πλευρά.»
          </h2>

          {/* Body */}
          <p
            ref={bodyRef}
            className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed"
          >
            Εμείς διαλέγουμε τους ανθρώπους.
          </p>
        </div>
      </div>
    </section>
  );
}