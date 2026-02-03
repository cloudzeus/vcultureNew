import { useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, ArrowRight } from 'lucide-react';
import { journalPosts } from '../data/journal';
import Navigation from '../components/Navigation';

gsap.registerPlugin(ScrollTrigger);

export default function JournalPage() {
    const navigate = useNavigate();
    const headerRef = useRef<HTMLDivElement>(null);
    const postsRef = useRef<(HTMLElement | null)[]>([]);

    useLayoutEffect(() => {
        // Scroll to top on mount
        window.scrollTo(0, 0);

        const ctx = gsap.context(() => {
            // Header animation
            gsap.fromTo(
                headerRef.current,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.out',
                }
            );

            // Posts animation
            postsRef.current.forEach((post, index) => {
                if (!post) return;

                gsap.fromTo(
                    post,
                    { y: 60, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        delay: 0.2 + index * 0.1,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: post,
                            start: 'top 85%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <>
            <Navigation />
            <div className="relative bg-background min-h-screen">
                {/* Noise overlay */}
                <div className="noise-overlay" />

                {/* Content */}
                <div className="relative z-10 px-8 md:px-[8vw] py-24 md:py-32">
                    {/* Header */}
                    <div ref={headerRef} className="mb-16 max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                            Journal of voices
                        </h1>
                        <p className="text-xl text-white/60 leading-relaxed">
                            Άρθρα, σημειώσεις από τα γυρίσματα και φωτογραφικά δοκίμια που φωτίζουν όσα δεν φαίνονται στην οθόνη.
                        </p>
                    </div>

                    {/* Posts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                        {journalPosts.map((post, index) => (
                            <article
                                key={post.id}
                                ref={(el) => { postsRef.current[index] = el; }}
                                onClick={() => navigate(`/journal/${post.id}`)}
                                className="group cursor-pointer"
                                role="button"
                                tabIndex={0}
                                aria-label={`Read article: ${post.title}`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        navigate(`/journal/${post.id}`);
                                    }
                                }}
                            >
                                <div className="relative rounded-2xl overflow-hidden border border-white/10 hover:border-primary/30 bg-gradient-to-br from-white/[0.05] to-white/[0.02] hover:from-white/[0.08] hover:to-white/[0.04] transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
                                    {/* Image */}
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                                        {/* Category Badge on Image */}
                                        <div className="absolute top-4 left-4">
                                            <span className="inline-block px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold tracking-wider uppercase shadow-lg">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 md:p-8">
                                        {/* Meta */}
                                        <div className="flex items-center gap-4 mb-4 text-xs text-white/50">
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {post.readTime}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-white/30" />
                                            <span>
                                                {new Date(post.date).toLocaleDateString('el-GR', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h2 className="text-2xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors duration-300 mb-3 leading-tight">
                                            {post.title}
                                        </h2>

                                        {/* Excerpt */}
                                        <p className="text-white/70 group-hover:text-white/80 mb-6 line-clamp-2 leading-relaxed transition-colors duration-300">
                                            {post.excerpt}
                                        </p>

                                        {/* Read More */}
                                        <div className="flex items-center gap-2 text-sm font-medium text-primary/80 group-hover:text-primary transition-all duration-300">
                                            <span>Διάβασε περισσότερα</span>
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Bottom Quote */}
                    <div className="mt-20 text-center max-w-3xl mx-auto">
                        <p className="text-xl text-white/60 italic">
                            «Αν ένα κείμενο εδώ σε άγγιξε, μοιράσου το. Κάπως έτσι αρχίζει η αλλαγή.»
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
