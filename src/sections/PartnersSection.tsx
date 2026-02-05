import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Mail } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

interface PartnersSectionProps {
  className?: string;
}

export default function PartnersSection({ className = '' }: PartnersSectionProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const partners = [
    t('Το Χαμόγελο του Παιδιού', 'The Smile of the Child'),
    'Beater.gr',
    t('Ευρωπαϊκά Προγράμματα', 'European Programs'),
    t('Τοπικές Κοινότητες', 'Local Communities'),
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          pinSpacing: true,
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="contact"
      className={`${className} relative overflow-hidden`}
    >
      <div ref={pinRef} className="h-screen w-full relative">
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
                {t('Συνεργασίες με', 'Partnerships with')}
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
                  {t('Ας μιλήσουμε.', "Let's talk.")}
                </h3>

                <p className="text-zinc-300 mb-6">
                  {t(
                    'Για συνεργασίες, καμπάνιες, προβολές ή εκπαιδευτικές δράσεις, στείλε ένα μήνυμα.',
                    'For collaborations, campaigns, screenings, or educational actions, send us a message.'
                  )}
                </p>

                <div className="flex items-center gap-3 mb-6">
                  <Mail className="w-5 h-5 text-primary" />
                  <a
                    href="mailto:hello@vculture.gr"
                    className="text-white hover:text-primary transition-colors"
                  >
                    hello@vculture.gr
                  </a>
                </div>

                <a href="mailto:hello@vculture.gr" className="btn-primary w-full justify-center flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {t('Κλείσε ραντεβού', 'Book a meeting')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}