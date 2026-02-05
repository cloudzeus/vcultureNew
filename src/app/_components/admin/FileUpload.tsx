'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X, Image as ImageIcon, Film, File } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FileUploadProps {
    onUploadComplete: (urls: string[]) => void;
    folder?: string;
    type?: 'image' | 'video' | 'any';
    multiple?: boolean;
    label?: string;
    initialImages?: string[];
}

export default function FileUpload({
    onUploadComplete,
    folder = 'uploads',
    type = 'image',
    multiple = false,
    label = 'Upload File',
    initialImages = [],
}: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [previews, setPreviews] = useState<string[]>(initialImages);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append('files', file);
        });
        formData.append('folder', folder);
        formData.append('type', type);

        try {
            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            onUploadComplete(data.urls);
            setPreviews(data.urls);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed. Please check your credentials or network.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removePreview = (index: number) => {
        const newPreviews = [...previews];
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const isImage = (url: string) => {
        return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(url);
    };

    return (
        <div className="space-y-4">
            <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed border-white/10 rounded-lg p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 transition-colors bg-white/5 ${uploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : '*/*'}
                    multiple={multiple}
                    className="hidden"
                    disabled={uploading}
                />

                {uploading ? (
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                ) : type === 'image' ? (
                    <ImageIcon className="w-10 h-10 text-white/40" />
                ) : type === 'video' ? (
                    <Film className="w-10 h-10 text-white/40" />
                ) : (
                    <File className="w-10 h-10 text-white/40" />
                )}

                <div className="text-center">
                    <p className="text-white font-medium">{label}</p>
                    <p className="text-white/40 text-sm">
                        {multiple ? 'Click to upload multiple files' : 'Click to upload a file'}
                    </p>
                </div>
            </div>

            {previews.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {previews.map((url, index) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden group border border-white/10 bg-white/5">
                            {isImage(url) ? (
                                <img src={url} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
                                    <File className="w-8 h-8 text-primary" />
                                    <p className="text-[10px] text-white/60 truncate w-full text-center">
                                        {url.split('/').pop()}
                                    </p>
                                </div>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removePreview(index);
                                }}
                                className="absolute top-1 right-1 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                <X className="w-3 h-3 text-white" />
                            </button>
                            <div className="absolute bottom-1 left-1">
                                <Badge variant="secondary" className="text-[10px] bg-black/50 backdrop-blur-sm border-none">
                                    {isImage(url) ? 'Image' : 'Document'}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
