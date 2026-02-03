import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Film, Megaphone, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ServicesSectionProps {
  className?: string;
}

const services = [
  {
    icon: Film,
    title: 'Social Documentaries',
    description:
      'Κινηματογραφημένες ανθρώπινες ιστορίες που εστιάζουν σε καθημερινές ζωές, αόρατες ανισότητες και μικρές νίκες αξιοπρέπειας.',
    bullets: ['Έρευνα και ανάπτυξη concept', 'Γυρίσματα σε πραγματικούς χώρους', 'Μοντάζ με cinematic αισθητική'],
  },
  {
    icon: Megaphone,
    title: 'Campaigns για NGOs',
    description:
      'Σχεδιάζουμε video καμπάνιες που μεταφράζουν δύσκολα κοινωνικά ζητήματα σε κατανοητές, συναισθηματικά φορτισμένες ιστορίες.',
    bullets: ['Spots για social media & TV', 'Content σειρές', 'Στρατηγική διάδοσης'],
  },
  {
    icon: Heart,
    title: 'Advocacy Videos',
    description:
      'Videos που λειτουργούν ως εργαλεία υπεράσπισης δικαιωμάτων, ενημέρωσης φορέων και εκπαίδευσης κοινού.',
    bullets: ['Video για καμπάνιες κατά του bullying', 'Περιεχόμενο για ημερίδες & συνέδρια', 'Υλικό για ευρωπαϊκά προγράμματα'],
  },
];

export default function ServicesSection({ className = '' }: ServicesSectionProps) {
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
        { y: -30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        headerRef.current,
        { autoAlpha: 1 },
        { autoAlpha: 0, ease: 'power2.in' },
        0.8
      );

      // Cards with stagger
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        scrollTl.fromTo(
          card,
          { y: `${80 + index * 20}vh`, rotateX: 45, autoAlpha: 0 },
          { y: 0, rotateX: 0, autoAlpha: 1, ease: 'none' },
          index * 0.06
        );

        scrollTl.fromTo(
          card,
          { y: 0, autoAlpha: 1 },
          { y: '-40vh', autoAlpha: 0.25, ease: 'power2.in' },
          0.7
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className={`section-pinned ${className}`}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-background">
        <div className="vignette" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-[8vw]">
        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Τι δημιουργούμε
          </h2>
          <p className="text-lg text-zinc-300 max-w-xl">
            Συνεργασίες με ΜΚΟ, οργανισμούς, ιδρύματα και brands που θέλουν να πουν μια κοινωνική ιστορία με σεβασμό και αλήθεια.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="glass-card p-8 perspective-1000 card-hover"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <service.icon className="w-6 h-6 text-primary" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-white mb-4">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Bullets */}
              <ul className="space-y-2">
                {service.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="text-sm text-zinc-400 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}