import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Clock, Calendar, User } from 'lucide-react';
import { journalPosts } from '../data/journal';
import Navigation from '../components/Navigation';

export default function JournalPostPage() {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const contentRef = useRef<HTMLDivElement>(null);

    const post = journalPosts.find((p) => p.id === postId);

    useEffect(() => {
        // Scroll to top on mount
        window.scrollTo(0, 0);

        // Animate content
        if (contentRef.current) {
            gsap.fromTo(
                contentRef.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.2 }
            );
        }
    }, [postId]);

    if (!post) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Δεν βρέθηκε το άρθρο</h1>
                    <button onClick={() => navigate('/journal')} className="btn-primary">
                        Επιστροφή στο Journal
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navigation />
            <div className="relative bg-background min-h-screen">
                {/* Noise overlay */}
                <div className="noise-overlay" />

                {/* Hero Image */}
                <div className="relative h-[60vh] overflow-hidden">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>

                {/* Content */}
                <div ref={contentRef} className="relative z-10 px-8 md:px-[8vw] -mt-32">
                    <article className="max-w-4xl mx-auto">
                        {/* Category Badge */}
                        <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
                            {post.category}
                        </span>

                        {/* Title */}
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            {post.title}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-6 mb-12 text-white/50 pb-8 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">
                                    {new Date(post.date).toLocaleDateString('el-GR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">{post.readTime}</span>
                            </div>
                            {post.author && (
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span className="text-sm">{post.author}</span>
                                </div>
                            )}
                        </div>

                        {/* Excerpt */}
                        <p className="text-xl text-white/70 mb-12 leading-relaxed italic border-l-4 border-primary pl-6">
                            {post.excerpt}
                        </p>

                        {/* Content */}
                        <div className="prose prose-invert prose-lg max-w-none">
                            <div
                                className="text-white/80 leading-relaxed space-y-6"
                                dangerouslySetInnerHTML={{
                                    __html: post.content
                                        .split('\n')
                                        .map((line) => {
                                            // Convert markdown-style headers
                                            if (line.startsWith('## ')) {
                                                return `<h2 class="text-3xl font-bold text-white mt-12 mb-6">${line.substring(3)}</h2>`;
                                            }
                                            if (line.startsWith('### ')) {
                                                return `<h3 class="text-2xl font-semibold text-white mt-8 mb-4">${line.substring(4)}</h3>`;
                                            }
                                            // Convert numbered lists
                                            if (line.match(/^\d+\.\s/)) {
                                                return `<li class="ml-6 mb-2">${line.substring(line.indexOf('.') + 2)}</li>`;
                                            }
                                            // Convert bullet lists
                                            if (line.startsWith('- ')) {
                                                return `<li class="ml-6 mb-2">${line.substring(2)}</li>`;
                                            }
                                            // Regular paragraphs
                                            if (line.trim()) {
                                                return `<p class="mb-4">${line}</p>`;
                                            }
                                            return '';
                                        })
                                        .join(''),
                                }}
                            />
                        </div>

                        {/* Divider */}
                        <div className="my-16 border-t border-white/10" />

                        {/* Share & Back */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-20">
                            <button
                                onClick={() => navigate('/journal')}
                                className="btn-secondary"
                            >
                                Επιστροφή στο Journal
                            </button>
                            <div className="text-white/60 text-sm">
                                Μοιράσου αυτό το άρθρο για να φτάσει σε περισσότερους ανθρώπους
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </>
    );
}
