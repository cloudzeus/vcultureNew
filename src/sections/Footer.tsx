import { Instagram, Linkedin, Video } from 'lucide-react';
import { useContact } from '../context/ContactContext';

interface FooterProps {
  className?: string;
}

const navLinks = [
  { label: 'Δουλειά', href: '#work' },
  { label: 'Υπηρεσίες', href: '#services' },
  { label: 'Studio', href: '#studio' },
  { label: 'Journal', href: '#journal' },
  { label: 'Επικοινωνία', href: '#contact' },
];

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Video, href: '#', label: 'Vimeo' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export default function Footer({ className = '' }: FooterProps) {
  const { openContact } = useContact();

  const scrollToSection = (href: string) => {
    if (href === '#contact') {
      openContact();
      return;
    }

    if (href === '#') return;
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className={`relative bg-background border-t border-white/5 ${className}`}>
      <div className="px-8 md:px-[8vw] py-16">
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          {/* Left Column */}
          <div className="lg:w-1/2">
            {/* Logo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="mb-4 inline-block"
            >
              <img
                src="/images/logo-lite.png"
                alt="vculture"
                className="h-10 w-auto"
              />
            </a>

            {/* Tagline */}
            <p className="text-zinc-400 max-w-md mb-6">
              Κοινωνική βιντεοπαραγωγή με σαφήνεια και φροντίδα.
            </p>

            {/* Email */}
            <a
              href="mailto:hello@vculture.gr"
              className="text-primary hover:underline"
            >
              hello@vculture.gr
            </a>
          </div>

          {/* Right Column */}
          <div className="lg:w-1/2">
            {/* Navigation */}
            <nav className="flex flex-wrap gap-x-8 gap-y-3 mb-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 transition-all"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">
            © 2026 vculture. Με επιφύλαξη παντός δικαιώματος.
          </p>
          <p className="text-sm text-zinc-500">
            Φτιαγμένο με φροντίδα για ιστορίες που μετράνε.
          </p>
        </div>
      </div>
    </footer>
  );
}