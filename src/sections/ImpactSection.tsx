import { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ImpactSectionProps {
  className?: string;
}

const metrics = [
  { value: 50, suffix: '+', label: 'κοινωνικές ιστορίες' },
  { value: 10, suffix: '', label: 'χώρες' },
  { value: 20, suffix: '+', label: 'συνεργασίες με οργανισμούς' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const duration = 2000;
            const startTime = Date.now();

            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeOut = 1 - Math.pow(1 - progress, 3);
              setCount(Math.floor(easeOut * value));

              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };

            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={counterRef}>
      {count}
      {suffix}
    </span>
  );
}

export default function ImpactSection({ className = '' }: ImpactSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
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

      // Metrics
      scrollTl.fromTo(
        metricsRef.current,
        { x: '-50vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        metricsRef.current,
        { x: 0, opacity: 1 },
        { x: '-10vw', opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      // Quote card
      scrollTl.fromTo(
        quoteRef.current,
        { x: '50vw', rotateY: -18, opacity: 0 },
        { x: 0, rotateY: 0, opacity: 1, ease: 'none' },
        0.08
      );

      scrollTl.fromTo(
        quoteRef.current,
        { x: 0, opacity: 1 },
        { x: '10vw', opacity: 0.25, ease: 'power2.in' },
        0.7
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
          src="/images/oito.jpg"
          alt="Impact background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-8 md:px-[8vw]">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Metrics */}
          <div ref={metricsRef} className="lg:w-[34vw]">
            <p className="micro-label mb-6">Our impact in frames</p>
            <div className="space-y-8">
              {metrics.map((metric) => (
                <div key={metric.label} className="flex items-baseline gap-2">
                  <span className="text-5xl md:text-6xl font-bold text-white">
                    <AnimatedCounter value={metric.value} suffix={metric.suffix} />
                  </span>
                  <span className="text-lg text-zinc-300">{metric.label}</span>
                </div>
              ))}
            </div>
            <p className="text-zinc-400 mt-8 text-sm italic">
              «Κάθε νούμερο είναι ένας άνθρωπος, μια ανάσα, ένα βλέμμα στην κάμερα.»
            </p>
          </div>

          {/* Quote Card */}
          <div
            ref={quoteRef}
            className="lg:w-[34vw] w-full max-w-md perspective-1000"
          >
            <div className="glass-card p-8">
              <Quote className="w-10 h-10 text-primary mb-6" />

              <blockquote className="text-xl text-white leading-relaxed mb-6">
                «Δεν κάνουμε video για να "συγκινήσουμε". Κάνουμε video για να γίνει η συγκίνηση αφορμή να αλλάξει κάτι – έστω και σε έναν άνθρωπο.»
              </blockquote>

              <cite className="text-sm text-zinc-400 not-italic">
                — Vasilis Nakis, vculture
              </cite>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}