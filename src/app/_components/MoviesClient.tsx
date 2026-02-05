'use client';

import { useRef, useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play } from 'lucide-react';
import { movies } from '../../data/movies';
import VideoModal from '../../components/VideoModal';
import Navigation from './NavigationNext';
import { useLanguage } from '@/context/LanguageContext';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function MoviesClient() {
    const router = useRouter();
    const { t } = useLanguage();
    const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);
    const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

    useLayoutEffect(() => {
        // ... (existing code for animations)
        // Scroll to top on mount
        window.scrollTo(0, 0);

        const ctx = gsap.context(() => {
            sectionsRef.current.forEach((section) => {
                if (!section) return;

                // Simple fade-in animation on scroll
                const content = section.querySelector('.movie-content') as Element | null;
                const image = section.querySelector('.movie-image') as Element | null;
                const playBtn = section.querySelector('.play-btn') as Element | null;

                if (content && image) {
                    gsap.fromTo(
                        [content, image, playBtn].filter(Boolean),
                        { autoAlpha: 0, y: 50 },
                        {
                            autoAlpha: 1,
                            y: 0,
                            duration: 1,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: section,
                                start: 'top 80%',
                                end: 'top 20%',
                                toggleActions: 'play none none reverse',
                            },
                        }
                    );
                }
            });
        });

        // Ensure ScrollTrigger refreshes after a short delay to account for image layout
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);

        return () => {
            clearTimeout(timer);
            ctx.revert();
        };
    }, []);

    const handlePlayVideo = (videoUrl: string, title: string) => {
        setSelectedVideo({ url: videoUrl, title });
    };

    return (
        <>
            <Navigation />
            <div className="relative bg-background">
                <div className="noise-overlay" />

                {movies.map((movie, index) => (
                    <section
                        key={movie.id}
                        ref={(el: HTMLDivElement | null) => { sectionsRef.current[index] = el; }}
                        className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
                    >
                        <div className="absolute inset-0 movie-image">
                            <img
                                src={movie.image}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
                        </div>

                        <div className="relative z-10 px-8 md:px-[8vw] max-w-7xl mx-auto movie-content">
                            <div className="max-w-3xl">
                                {/* Category Badge */}
                                <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
                                    {t(movie.category, movie.categoryEn)}
                                </span>

                                {/* Title */}
                                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                                    {t(movie.title, movie.titleEn)}
                                </h1>

                                {/* Subtitle */}
                                <p className="text-xl md:text-2xl text-white/80 mb-8">
                                    {t(movie.subtitle, movie.subtitleEn)}
                                </p>

                                {/* Description */}
                                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                                    {t(movie.description, movie.descriptionEn)}
                                </p>

                                <div className="flex flex-wrap gap-6 mb-10 text-white/70">
                                    <div>
                                        <span className="text-xs uppercase tracking-wider block mb-1">{t('Έτος', 'Year')}</span>
                                        <span className="text-sm font-medium text-white">{movie.year}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs uppercase tracking-wider block mb-1">{t('Διάρκεια', 'Duration')}</span>
                                        <span className="text-sm font-medium text-white">{movie.duration}</span>
                                    </div>
                                    {movie.director && (
                                        <div>
                                            <span className="text-xs uppercase tracking-wider block mb-1">{t('Σκηνοθεσία', 'Director')}</span>
                                            <span className="text-sm font-medium text-white">{movie.director}</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => handlePlayVideo(movie.video, movie.title)}
                                    className="play-btn inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all hover:scale-105"
                                >
                                    <Play className="w-5 h-5" fill="currentColor" />
                                    <span>{t('Παρακολούθηση Trailer', 'Watch Trailer')}</span>
                                </button>
                            </div>
                        </div>

                        <div className="absolute bottom-8 right-8 text-white/20 text-6xl font-bold">
                            {String(index + 1).padStart(2, '0')}
                        </div>
                    </section>
                ))}

                <section className="relative min-h-[100dvh] flex items-center justify-center bg-secondary">
                    <div className="px-8 md:px-[8vw] text-center">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            {t('Έχεις μια ιστορία να πεις;', 'Do you have a story to tell?')}
                        </h2>
                        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                            {t(
                                'Ας τη φέρουμε στη ζωή μαζί. Επικοινώνησε μαζί μας για να ξεκινήσουμε.',
                                'Let\'s bring it to life together. Contact us to get started.'
                            )}
                        </p>
                        <button
                            onClick={() => router.push('/#contact')}
                            className="btn-primary"
                        >
                            {t('Ξεκίνα ένα project', 'Start a project')}
                        </button>
                    </div>
                </section>
            </div>

            {/* Video Modal */}
            {selectedVideo && (
                <VideoModal
                    isOpen={!!selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                    videoUrl={selectedVideo.url}
                    title={selectedVideo.title}
                />
            )}
        </>
    );
}
