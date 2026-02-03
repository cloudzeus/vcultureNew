import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface PartnersSectionProps {
  className?: string;
}

const partners = [
  'Το Χαμόγελο του Παιδιού',
  'Beater.gr',
  'Ευρωπαϊκά Προγράμματα',
  'Τοπικές Κοινότητες',
];

export default function PartnersSection({ className = '' }: PartnersSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

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

      // Left block
      scrollTl.fromTo(
        leftRef.current,
        { x: '-50vw', autoAlpha: 0 },
        { x: 0, autoAlpha: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        leftRef.current,
        { x: 0, autoAlpha: 1 },
        { x: '-10vw', autoAlpha: 0.25, ease: 'power2.in' },
        0.7
      );

      // Right card
      scrollTl.fromTo(
        rightRef.current,
        { x: '50vw', rotateY: -16, autoAlpha: 0 },
        { x: 0, rotateY: 0, autoAlpha: 1, ease: 'none' },
        0.08
      );

      scrollTl.fromTo(
        rightRef.current,
        { x: 0, autoAlpha: 1 },
        { x: '10vw', autoAlpha: 0.25, ease: 'power2.in' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <div ref={bgRef} className="absolute inset-0 w-full h-full">
        <img
          src="/images/partners-bg.jpg"
          alt="Partners background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-8 md:px-[8vw]">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Partners List */}
          <div ref={leftRef} className="lg:w-[34vw]">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Συνεργασίες με
            </h2>

            <ul className="space-y-4">
              {partners.map((partner) => (
                <li
                  key={partner}
                  className="text-xl text-zinc-300 hover:text-white transition-colors"
                >
                  {partner}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Card */}
          <div
            ref={rightRef}
            className="lg:w-[34vw] w-full max-w-md perspective-1000"
          >
            <div className="glass-card p-8">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Ας μιλήσουμε.
              </h3>

              <p className="text-zinc-300 mb-6">
                Για συνεργασίες, καμπάνιες, προβολές ή εκπαιδευτικές δράσεις, στείλε ένα μήνυμα.
              </p>

              <div className="flex items-center gap-3 mb-6">
                <Mail className="w-5 h-5 text-primary" />
                <a
                  href="mailto:hello@vculture.studio"
                  className="text-white hover:text-primary transition-colors"
                >
                  hello@vculture.studio
                </a>
              </div>

              <button className="btn-primary w-full justify-center">
                <Calendar className="w-4 h-4 mr-2" />
                Κλείσε ραντεβού
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}