import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { X, Mail, MapPin, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { useContact } from '../context/ContactContext';

export default function ContactModal() {
    const { isOpen, closeContact } = useContact();
    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Form state
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeContact();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [closeContact]);

    // Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            if (isOpen) {
                // Prevent body scroll
                document.body.style.overflow = 'hidden';

                // Make visible and interactive
                gsap.set(modalRef.current, { autoAlpha: 1 });

                const tl = gsap.timeline();

                // Reset states
                gsap.set(overlayRef.current, { opacity: 0 });
                gsap.set(contentRef.current, { opacity: 0, y: 50, scale: 0.95 });

                // Animate in
                tl.to(overlayRef.current, {
                    duration: 0.4,
                    opacity: 1,
                    ease: 'power2.out'
                })
                    .to(contentRef.current, {
                        duration: 0.5,
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        ease: 'back.out(1.2)'
                    }, '-=0.2');

            } else {
                // Re-enable body scroll
                document.body.style.overflow = '';

                // Animate out
                const tl = gsap.timeline({
                    onComplete: () => {
                        gsap.set(modalRef.current, { autoAlpha: 0 });
                    }
                });

                tl.to(contentRef.current, {
                    duration: 0.3,
                    opacity: 0,
                    y: 20,
                    scale: 0.95,
                    ease: 'power2.in'
                })
                    .to(overlayRef.current, {
                        duration: 0.3,
                        opacity: 0,
                        ease: 'power2.in'
                    }, '-=0.2');
            }
        });

        return () => ctx.revert();
    }, [isOpen]);

    const formContainerRef = useRef<HTMLDivElement>(null);
    const successContainerRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);

        // Success Animation
        const tl = gsap.timeline();

        // 1. Fade out form
        tl.to(formContainerRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.4,
            ease: 'power2.in',
            pointerEvents: 'none'
        });

        // 2. Fade in success message
        tl.fromTo(successContainerRef.current, {
            opacity: 0,
            y: 20,
            scale: 0.9
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
            pointerEvents: 'auto'
        }, '-=0.1');

        // 3. Wait and Close
        tl.to({}, { duration: 2.5 }); // Wait time

        tl.add(() => {
            closeContact();
            // Reset form after close animation completes
            setTimeout(() => {
                setFormState({ name: '', email: '', message: '' });
                // Reset transforms for next open
                gsap.set(formContainerRef.current, { opacity: 1, y: 0, pointerEvents: 'auto' });
                gsap.set(successContainerRef.current, { opacity: 0 });
            }, 500);
        });
    };

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-8 opacity-0 invisible"
            aria-hidden={!isOpen}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            {/* Backdrop */}
            <div
                ref={overlayRef}
                className="absolute inset-0 bg-background/95 backdrop-blur-xl" // Increased contrast backdrop
                onClick={closeContact}
            />

            {/* Modal Content */}
            <div
                ref={contentRef}
                className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px]"
            >
                {/* Close Button - Enhanced visibility */}
                <button
                    onClick={closeContact}
                    className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Left Side: Info */}
                <div className="w-full md:w-2/5 bg-gradient-to-br from-primary/20 to-zinc-900 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
                    {/* Noise & Decoration */}
                    <div className="noise-overlay opacity-30" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10">
                        <h3 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">Επικοινωνια</h3>
                        <h2 id="modal-title" className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6">
                            Ας πούμε την ιστορία σας.
                        </h2>
                        <p className="text-white/90 leading-relaxed font-medium"> {/* Increased contrast */}
                            Είμαστε εδώ για να ακούσουμε, να σχεδιάσουμε και να δημιουργήσουμε μαζί.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-8 mt-12 md:mt-0">
                        <div>
                            <div className="flex items-center gap-3 text-white mb-2">
                                <Mail className="w-5 h-5 text-primary" />
                                <span className="font-semibold">Email</span>
                            </div>
                            <a href="mailto:hello@vculture.studio" className="text-white/80 hover:text-white transition-colors block pl-8 text-lg">
                                hello@vculture.studio
                            </a>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 text-white mb-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                <span className="font-semibold">Studio</span>
                            </div>
                            <p className="text-white/80 pl-8 text-lg">
                                Αθήνα, Ελλάδα
                            </p>
                        </div>

                        <div className="pt-4 border-t border-white/20">
                            <div className="flex gap-4">
                                <a href="#" aria-label="Instagram" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-primary hover:bg-white/20 transition-all">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="#" aria-label="LinkedIn" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-primary hover:bg-white/20 transition-all">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form / Success */}
                <div className="w-full md:w-3/5 p-8 md:p-12 relative bg-background flex flex-col justify-center">

                    {/* Success Message (Absolute centered) */}
                    <div
                        ref={successContainerRef}
                        className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center pointer-events-none opacity-0"
                        aria-live="polite"
                    >
                        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                            <ArrowRight className="w-10 h-10 rotate-[-45deg]" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">Το μήνυμα εστάλη!</h3>
                        <p className="text-white/80 text-lg">Θα επικοινωνήσουμε μαζί σας σύντομα.</p>
                    </div>

                    {/* Form Container */}
                    <div ref={formContainerRef} className="relative z-10 w-full">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="group">
                                <label htmlFor="name" className="block text-sm font-bold text-white/70 uppercase tracking-wider mb-2 group-focus-within:text-primary transition-colors">
                                    Ονοματεπωνυμο
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    value={formState.name}
                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                    className="w-full bg-transparent border-b-2 border-white/20 py-3 text-xl text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors font-medium"
                                    placeholder="Πώς να σας αποκαλούμε;"
                                />
                            </div>

                            <div className="group">
                                <label htmlFor="email" className="block text-sm font-bold text-white/70 uppercase tracking-wider mb-2 group-focus-within:text-primary transition-colors">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={formState.email}
                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                    className="w-full bg-transparent border-b-2 border-white/20 py-3 text-xl text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors font-medium"
                                    placeholder="name@example.com"
                                />
                            </div>

                            <div className="group">
                                <label htmlFor="message" className="block text-sm font-bold text-white/70 uppercase tracking-wider mb-2 group-focus-within:text-primary transition-colors">
                                    Μηνυμα
                                </label>
                                <textarea
                                    id="message"
                                    required
                                    rows={4}
                                    value={formState.message}
                                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                    className="w-full bg-transparent border-b-2 border-white/20 py-3 text-xl text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors resize-none font-medium"
                                    placeholder="Πείτε μας για το project σας..."
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full text-base font-bold tracking-wide overflow-hidden hover:bg-neutral-200 focus:ring-4 focus:ring-white/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto justify-center"
                                >
                                    <span className="relative z-10">
                                        {isSubmitting ? 'Αποστολή...' : 'Αποστολή μηνύματος'}
                                    </span>
                                    {!isSubmitting && <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
