import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Film, Megaphone, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ServicesData, ServiceItem } from '@/types/database';

gsap.registerPlugin(ScrollTrigger);

interface ServicesSectionProps {
  className?: string;
  data: ServicesData | null;
}

const iconMap: Record<string, any> = {
  Film,
  Megaphone,
  Heart
};

const defaultServices = [
  {
    iconName: 'Film',
    title: 'Social Documentaries',
    titleEn: 'Social Documentaries',
    description:
      'Κινηματογραφημένες ανθρώπινες ιστορίες που εστιάζουν σε καθημερινές ζωές, αόρατες ανισότητες και μικρές νίκες αξιοπρέπειας.',
    descriptionEn: 'Filmed human stories focusing on daily lives, invisible inequalities and small victories of dignity.',
    bullets: ['Έρευνα και ανάπτυξη concept', 'Γυρίσματα σε πραγματικούς χώρους', 'Μοντάζ με cinematic αισθητική'],
    bulletsEn: ['Research and concept development', 'Filming on location', 'Cinematic editing'],
  },
  {
    iconName: 'Megaphone',
    title: 'Campaigns για NGOs',
    titleEn: 'Campaigns for NGOs',
    description:
      'Σχεδιάζουμε video καμπάνιες που μεταφράζουν δύσκολα κοινωνικά ζητήματα σε κατανοητές, συναισθηματικά φορτισμένες ιστορίες.',
    descriptionEn: 'We design video campaigns that translate complex social issues into understandable, emotionally charged stories.',
    bullets: ['Spots για social media & TV', 'Content σειρές', 'Στρατηγική διάδοσης'],
    bulletsEn: ['Spots for social media & TV', 'Content series', 'Dissemination strategy'],
  },
  {
    iconName: 'Heart',
    title: 'Advocacy Videos',
    titleEn: 'Advocacy Videos',
    description:
      'Videos που λειτουργούν ως εργαλεία υπεράσπισης δικαιωμάτων, ενημέρωσης φορέων και εκπαίδευσης κοινού.',
    descriptionEn: 'Videos that serve as tools for advocacy, stakeholder information and public education.',
    bullets: ['Video για καμπάνιες κατά του bullying', 'Περιεχόμενο για ημερίδες & συνέδρια', 'Υλικό για ευρωπαϊκά προγράμματα'],
    bulletsEn: ['Anti-bullying campaign videos', 'Content for conferences & seminars', 'Material for European programs'],
  },
];

export default function ServicesSection({ className = '', data }: ServicesSectionProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: '+=140%',
          pin: true,
          pinSpacing: true,
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
        { y: 0, autoAlpha: 1 },
        { y: -100, autoAlpha: 0, ease: 'power2.in' },
        0.5
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const headline = t(data?.headline || 'Τι δημιουργούμε', data?.headlineEn);
  const description = t(
    data?.description || 'Συνεργασίες με ΜΚΟ, οργανισμούς, ιδρύματα και brands που θέλουν να πουν μια κοινωνική ιστορία με σεβασμό και αλήθεια.',
    data?.descriptionEn
  );
  const backgroundUrl = data?.backgroundImageUrl;

  const displayServices = (data?.services?.length ? data.services : defaultServices).map(s => {

    // We need to handle array manually or update t to handle arrays.
    // Let's assume t(el, en) returns string.
    // If we want to translate arrays, we need to pick the array based on language.

    // Manual language check:
    // We can't access `language` directly here easily without using `useLanguage` which we have.
    // `t` is for strings.
    // Let's use `t` for strings, and manually pick arrays.
    // We can expose `language` from useLanguage.

    return {
      ...s,
      Icon: iconMap[s.iconName] || Film,
      // We will process titles/descriptions inside the map loop below to be cleaner?
      // Or process them here.
    };
  }) as any[];

  // Re-map to resolve translations
  const { language } = useLanguage();

  const optimizedServices = displayServices.map(s => ({
    ...s,
    title: language === 'en' && s.titleEn ? s.titleEn : s.title,
    description: language === 'en' && s.descriptionEn ? s.descriptionEn : s.description,
    bullets: (language === 'en' && s.bulletsEn && s.bulletsEn.length > 0) ? s.bulletsEn : s.bullets
  }));

  return (
    <section
      ref={containerRef}
      id="services"
      className={`${className} relative overflow-hidden`}
    >
      <div ref={pinRef} className="h-screen w-full relative">
        {/* Background */}
        <div className="absolute inset-0 bg-background">
          {backgroundUrl && (
            <img
              src={backgroundUrl}
              alt="Services background"
              className="w-full h-full object-cover opacity-30"
            />
          )}
          <div className="vignette" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-[8vw]">
          {/* Header */}
          <div ref={headerRef} className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {headline}
            </h2>
            <p className="text-lg text-zinc-300 max-w-xl">
              {description}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {optimizedServices.map((service, index) => (
              <div
                key={service.title} // better key?
                ref={(el) => { cardsRef.current[index] = el; }}
                className="glass-card p-8 perspective-1000 card-hover"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <service.Icon className="w-6 h-6 text-primary" />
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
                  {(service.bullets as string[]).map((bullet) => (
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
      </div>
    </section>
  );
}