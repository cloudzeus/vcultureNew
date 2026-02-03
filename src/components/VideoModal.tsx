import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { gsap } from 'gsap';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoUrl: string;
    title?: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (isOpen) {
            // Prevent body scroll
            document.body.style.overflow = 'hidden';

            // Animate in
            gsap.fromTo(
                overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: 'power2.out' }
            );

            gsap.fromTo(
                modalRef.current,
                { scale: 0.9, opacity: 0, y: 20 },
                { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.4)', delay: 0.1 }
            );
        } else {
            // Re-enable body scroll
            document.body.style.overflow = '';

            // Pause video when closing
            if (videoRef.current) {
                videoRef.current.pause();
            }
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleClose = () => {
        // Animate out
        gsap.to(modalRef.current, {
            scale: 0.9,
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: 'power2.in',
        });

        gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: onClose,
        });
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
            onClick={handleOverlayClick}
        >
            <div
                ref={modalRef}
                className="relative w-full max-w-6xl bg-secondary/50 rounded-2xl overflow-hidden border border-white/10"
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Title */}
                {title && (
                    <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm">
                        <h3 className="text-sm font-medium text-white">{title}</h3>
                    </div>
                )}

                {/* Video */}
                <div className="relative aspect-video w-full">
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        controls
                        autoPlay
                        className="w-full h-full"
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </div>
    );
}
