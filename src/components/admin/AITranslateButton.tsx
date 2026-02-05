import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AITranslateButtonProps {
    onTranslate: (translations: any) => void;
    fieldsToTranslate: Record<string, string>; // Key: FieldName, Value: Content
    className?: string;
    label?: string;
}

export default function AITranslateButton({
    onTranslate,
    fieldsToTranslate,
    className = "",
    label = "Auto-Translate to English"
}: AITranslateButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleTranslate = async () => {
        // Filter out empty fields to save tokens and avoid errors
        const validFields: Record<string, string> = {};
        let hasContent = false;

        Object.entries(fieldsToTranslate).forEach(([key, value]) => {
            if (value && typeof value === 'string' && value.trim() !== '') {
                validFields[key] = value;
                hasContent = true;
            }
        });

        if (!hasContent) {
            toast.error("No content found to translate.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/admin/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ context: validFields }),
            });

            if (!res.ok) {
                throw new Error('Translation failed');
            }

            const data = await res.json();

            if (data.translations) {
                onTranslate(data.translations);
                toast.success("Content translated successfully!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to translate content. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTranslate}
            disabled={loading}
            className={`gap-2 border-primary/20 hover:border-primary/50 hover:bg-primary/10 text-primary ${className}`}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Sparkles className="w-4 h-4" />
            )}
            {label}
        </Button>
    );
}
