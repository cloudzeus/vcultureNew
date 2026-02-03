import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CTASectionProps {
  className?: string;
}

export default function CTASection({ className = '' }: CTASectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
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

      // Watermark
      scrollTl.fromTo(
        watermarkRef.current,
        { scale: 0.92, autoAlpha: 0 },
        { scale: 1, autoAlpha: 0.04, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        watermarkRef.current,
        { autoAlpha: 0.04 },
        { autoAlpha: 0, ease: 'power2.in' },
        0.8
      );

      // Headline
      scrollTl.fromTo(
        headlineRef.current,
        { y: 50, rotateX: 30, autoAlpha: 0 },
        { y: 0, rotateX: 0, autoAlpha: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        headlineRef.current,
        { y: 0, autoAlpha: 1 },
        { y: -30, autoAlpha: 0.2, ease: 'power2.in' },
        0.7
      );

      // Body
      scrollTl.fromTo(
        bodyRef.current,
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, ease: 'none' },
        0.08
      );

      scrollTl.fromTo(
        bodyRef.current,
        { autoAlpha: 1 },
        { autoAlpha: 0.2, ease: 'power2.in' },
        0.72
      );

      // CTA
      scrollTl.fromTo(
        ctaRef.current,
        { y: 30, scale: 0.96, autoAlpha: 0 },
        { y: 0, scale: 1, autoAlpha: 1, ease: 'back.out(1.4)' },
        0.1
      );

      scrollTl.fromTo(
        ctaRef.current,
        { y: 0, autoAlpha: 1 },
        { y: 20, autoAlpha: 0.2, ease: 'power2.in' },
        0.74
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`section-pinned ${className}`}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-secondary" />

      {/* Watermark */}
      <div
        ref={watermarkRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
      >
        <span className="text-[18vw] font-bold text-white whitespace-nowrap">
          ΣΥΝΕΡΓΑΣΙΑ
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-8 md:px-[8vw]">
        <div className="max-w-2xl text-center perspective-1000">
          {/* Headline */}
          <h2
            ref={headlineRef}
            className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6"
          >
            Ας χτίσουμε
            <br />
            την επόμενη ιστορία.
          </h2>

          {/* Body */}
          <p
            ref={bodyRef}
            className="text-lg text-zinc-300 leading-relaxed mb-10"
          >
            Πες μας για το όραμά σου. Θα σχεδιάσουμε ένα πλάνο παραγωγής που ταιριάζει στο timeline, τον budget και τις αξίες σου.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-wrap justify-center gap-4">
            <a href="#contact" className="btn-primary">
              Ξεκίνα ένα project
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}