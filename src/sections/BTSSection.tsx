import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BTSSectionProps {
  className?: string;
}

const cards = [
  {
    label: 'Παραγωγή στο πεδίο',
    image: '/images/vaggelis-nakis-hamogelo-tou-paidiou-beater-gr.jpg',
  },
  {
    label: 'Συνεντεύξεις',
    image: '/images/«Δύο-Ζωές»ταινία-αφιερωμένη-στα-25-Χρόνια-του-Χαμόγελου-του-Παιδιού-1-600x399.jpg',
  },
  {
    label: 'Color grading',
    image: '/images/bts-3.jpg',
  },
  {
    label: 'Υποτιτλισμός & προσβασιμότητα',
    image: '/images/bts-4.jpg',
  },
];

export default function BTSSection({ className = '' }: BTSSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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

      // Header
      scrollTl.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        headerRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.8
      );

      // Cards with alternating directions
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        const isLeft = index % 2 === 0;
        const fromX = isLeft ? '-60vw' : '60vw';
        const fromRotateY = isLeft ? 25 : -25;

        scrollTl.fromTo(
          card,
          { x: fromX, rotateY: fromRotateY, opacity: 0 },
          { x: 0, rotateY: 0, opacity: 1, ease: 'none' },
          index * 0.04
        );

        scrollTl.fromTo(
          card,
          { y: 0, opacity: 1 },
          { y: '18vh', opacity: 0.25, ease: 'power2.in' },
          0.7
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`section-pinned ${className}`}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-background">
        <div className="vignette" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-[8vw]">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Πίσω από τις κάμερες
          </h2>
          <p className="text-lg text-white/60">
            Η τεχνική που κάνει την ιστορία να αντέχει.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[50vh]">
          {cards.map((card, index) => (
            <div
              key={card.label}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="relative rounded-[1.125rem] overflow-hidden card-hover group perspective-1000"
            >
              <img
                src={card.image}
                alt={card.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
              
              {/* Label */}
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-sm font-medium text-white">
                  {card.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}