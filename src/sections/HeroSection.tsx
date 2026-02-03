import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = '' }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Auto-play entrance animation on load
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Background fade in
      tl.fromTo(
        bgRef.current,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1.2 }
      );

      // Headline animation
      tl.fromTo(
        headlineRef.current,
        { y: 60, rotateX: 35, opacity: 0 },
        { y: 0, rotateX: 0, opacity: 1, duration: 1 },
        0.2
      );

      // Subheadline animation
      tl.fromTo(
        subheadlineRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.4
      );

      // CTA animation
      tl.fromTo(
        ctaRef.current,
        { y: 30, scale: 0.95, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.6)' },
        0.6
      );

      // Scroll hint animation
      tl.fromTo(
        scrollHintRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        1
      );

      // Continuous scroll hint bounce
      gsap.to(scrollHintRef.current, {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven exit animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset all elements to visible when scrolling back to top
            gsap.set([headlineRef.current, subheadlineRef.current, ctaRef.current], {
              opacity: 1,
              x: 0,
              y: 0,
            });
            gsap.set(bgRef.current, { scale: 1, y: 0 });
          },
        },
      });

      // ENTRANCE (0-30%): Hold (already visible from load animation)
      // SETTLE (30-70%): Static

      // EXIT (70-100%)
      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        subheadlineRef.current,
        { x: 0, opacity: 1 },
        { x: '-14vw', opacity: 0, ease: 'power2.in' },
        0.72
      );

      scrollTl.fromTo(
        ctaRef.current,
        { x: 0, opacity: 1 },
        { x: '-10vw', opacity: 0, ease: 'power2.in' },
        0.74
      );

      scrollTl.fromTo(
        scrollHintRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1, y: 0 },
        { scale: 1.06, y: '-3vh', ease: 'none' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToWork = () => {
    const element = document.querySelector('#work');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0 }}
      >
        <img
          src="/images/1.jpg"
          alt="Documentary scene"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/35 via-background/20 to-background/72" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-[8vw]">
        <div className="max-w-4xl perspective-1000">
          {/* Accent line */}
          <div className="w-24 h-px bg-primary mb-8" />

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tight mb-8"
            style={{ opacity: 0 }}
          >
            vculture
            <br />
            <span className="text-3xl md:text-5xl lg:text-6xl font-medium">
              Κοινωνικές ιστορίες
              <br />
              με αληθινούς ανθρώπους
            </span>
          </h1>

          {/* Subheadline */}
          <p
            ref={subheadlineRef}
            className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed mb-10"
            style={{ opacity: 0 }}
          >
            Οπτικοακουστικές αφηγήσεις για ανθρώπινα δικαιώματα, αξιοπρέπεια
            και τις φωνές που συνήθως δεν ακούγονται.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-wrap gap-4" style={{ opacity: 0 }}>
            <button onClick={scrollToWork} className="btn-primary">
              Δες τη δουλειά μας
            </button>
            <a href="#contact" className="btn-secondary">
              Συνεργάσου με τη vculture
            </a>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="absolute bottom-24 right-8 z-20 hidden md:block">
        <a
          href="/afisa.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="block transition-transform hover:scale-105 duration-300"
        >
          <img
            src="/Banner1.png"
            alt="Προβολή αφίσας σε PDF"
            className="w-[25vw] max-w-[500px] drop-shadow-2xl"
          />
        </a>
      </div>

      {/* Scroll Hint */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
        style={{ opacity: 0 }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={20} />
      </div>
    </section>
  );
}