'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Plus, Trash2, Image as ImageIcon, Video, Save } from 'lucide-react';
import FileUpload from '@/app/_components/admin/FileUpload';
import AITranslateButton from '@/components/admin/AITranslateButton';

interface HeroSection {
    id?: string;
    titleMain: string;
    titleMainEn?: string;
    titleSubtitle1: string;
    titleSubtitle1En?: string;
    titleSubtitle2: string;
    titleSubtitle2En?: string;
    description: string;
    descriptionEn?: string;
    primaryCtaText: string;
    primaryCtaTextEn?: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaTextEn?: string;
    secondaryCtaLink: string;
    backgroundImageUrl: string;
    backgroundVideoUrl: string;
    showAfisa: boolean;
    afisaUrl: string;
    afisaImageUrl: string;
}

interface StudioSection {
    id?: string;
    eyebrow: string;
    eyebrowEn?: string;
    headline: string;
    headlineEn?: string;
    description: string;
    descriptionEn?: string;
    backgroundImageUrl: string;
    cardTitle: string;
    cardTitleEn?: string;
    cardSubtitle: string;
    cardSubtitleEn?: string;
    cardDescription: string;
    cardDescriptionEn?: string;
    cardImageUrl: string;
    cardVideoUrl: string;
}

interface ImpactStat {
    id?: string;
    value: number;
    suffix: string;
    suffixEn?: string;
    label: string;
    labelEn?: string;
    order: number;
}

interface ImpactData {
    id?: string;
    heading: string;
    headingEn?: string;
    description?: string;
    descriptionEn?: string;
    backgroundImageUrl?: string;
    stats: ImpactStat[];
}

interface BTSCard {
    id?: string;
    label: string;
    labelEn?: string;
    imageUrl: string;
    order: number;
}

interface BTSData {
    id?: string;
    title: string;
    titleEn?: string;
    description?: string;
    descriptionEn?: string;
    cards: BTSCard[];
}

interface ProcessData {
    id?: string;
    headline: string;
    headlineEn?: string;
    description: string;
    descriptionEn?: string;
    backgroundImageUrl: string;
}

interface StoryData {
    id?: string;
    label: string;
    labelEn?: string;
    title: string;
    titleEn?: string;
    description: string;
    descriptionEn?: string;
    backgroundImageUrl: string;
    videoUrl: string;
}

interface ServiceItem {
    id?: string;
    iconName: string;
    title: string;
    titleEn?: string;
    description: string;
    descriptionEn?: string;
    bullets: string[];
    bulletsEn?: string[];
    order: number;
}

interface ServicesData {
    id?: string;
    headline: string;
    headlineEn?: string;
    description?: string;
    descriptionEn?: string;
    backgroundImageUrl?: string;
    services: ServiceItem[];
}

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [hero, setHero] = useState<HeroSection>({
        titleMain: 'vculture',
        titleMainEn: '',
        titleSubtitle1: 'Κοινωνικές ιστορίες',
        titleSubtitle1En: '',
        titleSubtitle2: 'με αληθινούς ανθρώπους',
        titleSubtitle2En: '',
        description: '',
        descriptionEn: '',
        primaryCtaText: 'Explore Projects',
        primaryCtaTextEn: '',
        primaryCtaLink: '/movies',
        secondaryCtaText: 'Read Journal',
        secondaryCtaTextEn: '',
        secondaryCtaLink: '/journal',
        backgroundImageUrl: '',
        backgroundVideoUrl: '',
        showAfisa: false,
        afisaUrl: '',
        afisaImageUrl: '',
    });

    const [studio, setStudio] = useState<StudioSection>({
        eyebrow: 'Το Studio',
        eyebrowEn: '',
        headline: 'Η vculture είναι ένα social-first video studio.',
        headlineEn: '',
        description: '',
        descriptionEn: '',
        backgroundImageUrl: '',
        cardTitle: '',
        cardTitleEn: '',
        cardSubtitle: '',
        cardSubtitleEn: '',
        cardDescription: '',
        cardDescriptionEn: '',
        cardImageUrl: '',
        cardVideoUrl: '',
    });

    const [impact, setImpact] = useState<ImpactData>({
        heading: 'Our impact in frames',
        headingEn: '',
        description: '',
        descriptionEn: '',
        backgroundImageUrl: '',
        stats: [],
    });

    const [process, setProcess] = useState<ProcessData>({
        headline: '',
        headlineEn: '',
        description: '',
        descriptionEn: '',
        backgroundImageUrl: '',
    });

    const [story, setStory] = useState<StoryData>({
        label: '',
        labelEn: '',
        title: '',
        titleEn: '',
        description: '',
        descriptionEn: '',
        backgroundImageUrl: '',
        videoUrl: '',
    });

    const [bts, setBts] = useState<BTSData>({
        title: '',
        titleEn: '',
        description: '',
        descriptionEn: '',
        cards: [],
    });

    const [services, setServices] = useState<ServicesData>({
        headline: '',
        headlineEn: '',
        description: '',
        descriptionEn: '',
        backgroundImageUrl: '',
        services: []
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        const fetchData = async (url: string, setter: (data: any) => void, label: string) => {
            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                if (data && !data.error) {
                    setter(data);
                }
            } catch (error) {
                console.error(`Error fetching ${label}:`, error);
            }
        };

        await Promise.all([
            fetchData('/api/admin/hero', setHero, 'Hero'),
            fetchData('/api/admin/studio', setStudio, 'Studio'),
            fetchData('/api/admin/impact', setImpact, 'Impact'),
            fetchData('/api/admin/process', setProcess, 'Process'),
            fetchData('/api/admin/story', setStory, 'Story'),
            fetchData('/api/admin/bts', setBts, 'BTS'),
            fetchData('/api/admin/services', setServices, 'Services')
        ]);
        setLoading(false);
    };

    const saveData = async (url: string, data: any, label: string, setter: (d: any) => void) => {
        setSaving(true);
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                const refreshed = await res.json();
                setter(refreshed);
                // alert(`${label} section updated!`); 
                // Removed alert for cleaner UX, could add toast
                router.refresh();
            }
        } catch (error) {
            console.error(`Error saving ${label}:`, error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Home Page Editor</h2>
                    <p className="text-white/60">Configure sections and dynamic content of the landing page</p>
                </div>
            </div>

            <Tabs defaultValue="hero" className="w-full">
                <TabsList className="bg-white/5 border border-white/10 p-1 flex-wrap h-auto">
                    <TabsTrigger value="hero" className="data-[state=active]:bg-primary text-xs">Hero</TabsTrigger>
                    <TabsTrigger value="studio" className="data-[state=active]:bg-primary text-xs">Studio</TabsTrigger>
                    <TabsTrigger value="process" className="data-[state=active]:bg-primary text-xs">Process</TabsTrigger>
                    <TabsTrigger value="services" className="data-[state=active]:bg-primary text-xs">Services</TabsTrigger>
                    <TabsTrigger value="story" className="data-[state=active]:bg-primary text-xs">Story Feature</TabsTrigger>
                    <TabsTrigger value="bts" className="data-[state=active]:bg-primary text-xs">BTS</TabsTrigger>
                    <TabsTrigger value="impact" className="data-[state=active]:bg-primary text-xs">Impact</TabsTrigger>
                </TabsList>

                {/* HERO TAB */}
                <TabsContent value="hero" className="mt-6">
                    <Card className="bg-zinc-900 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-white">Hero Section</CardTitle>
                                <CardDescription className="text-white/60">Configure the main entrance</CardDescription>
                            </div>
                            <AITranslateButton
                                fieldsToTranslate={{
                                    titleMain: hero.titleMain,
                                    titleSubtitle1: hero.titleSubtitle1,
                                    titleSubtitle2: hero.titleSubtitle2,
                                    description: hero.description,
                                    primaryCtaText: hero.primaryCtaText,
                                    secondaryCtaText: hero.secondaryCtaText
                                }}
                                onTranslate={(t) => setHero(prev => ({ ...prev, ...t }))}
                            />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Tabs defaultValue="el" className="w-full">
                                <TabsList className="bg-white/5 border border-white/10 mb-4">
                                    <TabsTrigger value="el">Greek (Original)</TabsTrigger>
                                    <TabsTrigger value="en">English (Translation)</TabsTrigger>
                                </TabsList>
                                <TabsContent value="el" className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2"><Label>Main Title</Label><Input value={hero.titleMain} onChange={e => setHero({ ...hero, titleMain: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                        <div className="space-y-2"><Label>Subtitle 1</Label><Input value={hero.titleSubtitle1} onChange={e => setHero({ ...hero, titleSubtitle1: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                        <div className="space-y-2"><Label>Subtitle 2</Label><Input value={hero.titleSubtitle2} onChange={e => setHero({ ...hero, titleSubtitle2: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                        <div className="space-y-2"><Label>Description</Label><Textarea value={hero.description} onChange={e => setHero({ ...hero, description: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                        <div className="space-y-2"><Label>Primary CTA</Label><Input value={hero.primaryCtaText} onChange={e => setHero({ ...hero, primaryCtaText: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                        <div className="space-y-2"><Label>Secondary CTA</Label><Input value={hero.secondaryCtaText} onChange={e => setHero({ ...hero, secondaryCtaText: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="en" className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2"><Label>Main Title (En)</Label><Input value={hero.titleMainEn || ''} onChange={e => setHero({ ...hero, titleMainEn: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                        <div className="space-y-2"><Label>Subtitle 1 (En)</Label><Input value={hero.titleSubtitle1En || ''} onChange={e => setHero({ ...hero, titleSubtitle1En: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                        <div className="space-y-2"><Label>Subtitle 2 (En)</Label><Input value={hero.titleSubtitle2En || ''} onChange={e => setHero({ ...hero, titleSubtitle2En: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                        <div className="space-y-2"><Label>Description (En)</Label><Textarea value={hero.descriptionEn || ''} onChange={e => setHero({ ...hero, descriptionEn: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                        <div className="space-y-2"><Label>Primary CTA (En)</Label><Input value={hero.primaryCtaTextEn || ''} onChange={e => setHero({ ...hero, primaryCtaTextEn: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                        <div className="space-y-2"><Label>Secondary CTA (En)</Label><Input value={hero.secondaryCtaTextEn || ''} onChange={e => setHero({ ...hero, secondaryCtaTextEn: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                            <FileUpload
                                label="Background Image"
                                onUploadComplete={urls => setHero({ ...hero, backgroundImageUrl: urls[0] })}
                                folder="hero"
                                initialImages={hero.backgroundImageUrl ? [hero.backgroundImageUrl] : []}
                            />

                            {/* AFISA / BANNER SECTION */}
                            <Card className="bg-white/5 border-white/10 p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-white">Funding Banner (Afisa)</Label>
                                        <p className="text-xs text-white/60">Display official funding logos & file link</p>
                                    </div>
                                    <Switch
                                        checked={hero.showAfisa}
                                        onCheckedChange={checked => setHero({ ...hero, showAfisa: checked })}
                                    />
                                </div>

                                {hero.showAfisa && (
                                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                                        <div className="space-y-4">
                                            <Label className="text-white text-xs uppercase tracking-wider opacity-70">1. Banner Image (Logos)</Label>
                                            <FileUpload
                                                label="Upload Logos Banner"
                                                onUploadComplete={urls => setHero({ ...hero, afisaImageUrl: urls[0] })}
                                                folder="afisa"
                                                initialImages={hero.afisaImageUrl ? [hero.afisaImageUrl] : []}
                                            />
                                            <p className="text-[10px] text-white/40 italic">Note: If empty, defaults to /Banner1.png</p>
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-white text-xs uppercase tracking-wider opacity-70">2. Linked File (PDF/Doc)</Label>
                                            <Input
                                                value={hero.afisaUrl || ''}
                                                onChange={e => setHero({ ...hero, afisaUrl: e.target.value })}
                                                placeholder="/afisa.pdf"
                                                className="bg-white/5 border-white/10 text-white text-sm"
                                            />
                                            <FileUpload
                                                label="Upload Document"
                                                onUploadComplete={urls => setHero({ ...hero, afisaUrl: urls[0] })}
                                                folder="afisa_files"
                                                type="any"
                                                initialImages={hero.afisaUrl ? [hero.afisaUrl] : []}
                                            />
                                            <p className="text-[10px] text-white/40 italic">Note: If empty, defaults to /afisa.pdf</p>
                                        </div>
                                    </div>
                                )}
                            </Card>

                            <div className="flex justify-end"><Button onClick={() => saveData('/api/admin/hero', hero, 'Hero', setHero)} disabled={saving}>Save Hero</Button></div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* STUDIO TAB */}
                <TabsContent value="studio" className="mt-6">
                    <Card className="bg-zinc-900 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-white">Studio Section</CardTitle>
                            <AITranslateButton
                                fieldsToTranslate={{
                                    eyebrow: studio.eyebrow,
                                    headline: studio.headline,
                                    description: studio.description,
                                    cardTitle: studio.cardTitle,
                                    cardSubtitle: studio.cardSubtitle,
                                    cardDescription: studio.cardDescription
                                }}
                                onTranslate={(t) => setStudio(prev => ({ ...prev, ...t }))}
                            />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Tabs defaultValue="el" className="w-full">
                                <TabsList className="bg-white/5 border border-white/10 mb-4">
                                    <TabsTrigger value="el">Greek</TabsTrigger>
                                    <TabsTrigger value="en">English</TabsTrigger>
                                </TabsList>
                                <TabsContent value="el" className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2"><Label>Eyebrow</Label><Input value={studio.eyebrow} onChange={e => setStudio({ ...studio, eyebrow: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                        <div className="space-y-2"><Label>Headline</Label><Input value={studio.headline} onChange={e => setStudio({ ...studio, headline: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                        <div className="col-span-2 space-y-2"><Label>Description</Label><Textarea value={studio.description} onChange={e => setStudio({ ...studio, description: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                        <div className="col-span-2 mt-4 font-bold text-lg text-white">Card Details</div>
                                        <div className="space-y-2"><Label>Card Title</Label><Input value={studio.cardTitle} onChange={e => setStudio({ ...studio, cardTitle: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                        <div className="space-y-2"><Label>Card Subtitle</Label><Input value={studio.cardSubtitle} onChange={e => setStudio({ ...studio, cardSubtitle: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                        <div className="col-span-2 space-y-2"><Label>Card Description</Label><Textarea value={studio.cardDescription} onChange={e => setStudio({ ...studio, cardDescription: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="en" className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2"><Label>Eyebrow (En)</Label><Input value={studio.eyebrowEn || ''} onChange={e => setStudio({ ...studio, eyebrowEn: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                        <div className="space-y-2"><Label>Headline (En)</Label><Input value={studio.headlineEn || ''} onChange={e => setStudio({ ...studio, headlineEn: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                        <div className="col-span-2 space-y-2"><Label>Description (En)</Label><Textarea value={studio.descriptionEn || ''} onChange={e => setStudio({ ...studio, descriptionEn: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                        <div className="col-span-2 mt-4 font-bold text-lg text-white">Card Details (English)</div>
                                        <div className="space-y-2"><Label>Card Title (En)</Label><Input value={studio.cardTitleEn || ''} onChange={e => setStudio({ ...studio, cardTitleEn: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                        <div className="space-y-2"><Label>Card Subtitle (En)</Label><Input value={studio.cardSubtitleEn || ''} onChange={e => setStudio({ ...studio, cardSubtitleEn: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                        <div className="col-span-2 space-y-2"><Label>Card Description (En)</Label><Textarea value={studio.cardDescriptionEn || ''} onChange={e => setStudio({ ...studio, cardDescriptionEn: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                            <FileUpload
                                label="Background Image"
                                onUploadComplete={urls => setStudio({ ...studio, backgroundImageUrl: urls[0] })}
                                folder="studio"
                                initialImages={studio.backgroundImageUrl ? [studio.backgroundImageUrl] : []}
                            />
                            <div className="flex justify-end"><Button onClick={() => saveData('/api/admin/studio', studio, 'Studio', setStudio)} disabled={saving}>Save Studio</Button></div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* PROCESS TAB */}
                <TabsContent value="process" className="mt-6">
                    <Card className="bg-zinc-900 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-white">Process Section</CardTitle>
                            <AITranslateButton
                                fieldsToTranslate={{ headline: process.headline, description: process.description || '' }}
                                onTranslate={(t) => setProcess(prev => ({ ...prev, ...t }))}
                            />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Tabs defaultValue="el" className="w-full">
                                <TabsList className="bg-white/5 border border-white/10 mb-4">
                                    <TabsTrigger value="el">Greek</TabsTrigger>
                                    <TabsTrigger value="en">English</TabsTrigger>
                                </TabsList>
                                <TabsContent value="el" className="space-y-4">
                                    <div className="space-y-2"><Label>Headline</Label><Input value={process.headline} onChange={e => setProcess({ ...process, headline: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                    <div className="space-y-2"><Label>Description</Label><Textarea value={process.description} onChange={e => setProcess({ ...process, description: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                </TabsContent>
                                <TabsContent value="en" className="space-y-4">
                                    <div className="space-y-2"><Label>Headline (En)</Label><Input value={process.headlineEn || ''} onChange={e => setProcess({ ...process, headlineEn: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                    <div className="space-y-2"><Label>Description (En)</Label><Textarea value={process.descriptionEn || ''} onChange={e => setProcess({ ...process, descriptionEn: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                </TabsContent>
                            </Tabs>
                            <FileUpload
                                label="Background Image"
                                onUploadComplete={urls => setProcess({ ...process, backgroundImageUrl: urls[0] })}
                                folder="process"
                                initialImages={process.backgroundImageUrl ? [process.backgroundImageUrl] : []}
                            />
                            <div className="flex justify-end"><Button onClick={() => saveData('/api/admin/process', process, 'Process', setProcess)} disabled={saving}>Save Process</Button></div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* STORY TAB */}
                <TabsContent value="story" className="mt-6">
                    <Card className="bg-zinc-900 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-white">Story Section</CardTitle>
                            <AITranslateButton
                                fieldsToTranslate={{ label: story.label, title: story.title, description: story.description }}
                                onTranslate={(t) => setStory(prev => ({ ...prev, ...t }))}
                            />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Tabs defaultValue="el" className="w-full">
                                <TabsList className="bg-white/5 border border-white/10 mb-4">
                                    <TabsTrigger value="el">Greek</TabsTrigger>
                                    <TabsTrigger value="en">English</TabsTrigger>
                                </TabsList>
                                <TabsContent value="el" className="space-y-4">
                                    <div className="space-y-2"><Label>Label</Label><Input value={story.label} onChange={e => setStory({ ...story, label: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                    <div className="space-y-2"><Label>Title</Label><Input value={story.title} onChange={e => setStory({ ...story, title: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                    <div className="space-y-2"><Label>Description</Label><Textarea value={story.description} onChange={e => setStory({ ...story, description: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                </TabsContent>
                                <TabsContent value="en" className="space-y-4">
                                    <div className="space-y-2"><Label>Label (En)</Label><Input value={story.labelEn || ''} onChange={e => setStory({ ...story, labelEn: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                    <div className="space-y-2"><Label>Title (En)</Label><Input value={story.titleEn || ''} onChange={e => setStory({ ...story, titleEn: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                    <div className="space-y-2"><Label>Description (En)</Label><Textarea value={story.descriptionEn || ''} onChange={e => setStory({ ...story, descriptionEn: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                </TabsContent>
                            </Tabs>
                            <FileUpload
                                label="Background Image"
                                onUploadComplete={urls => setStory({ ...story, backgroundImageUrl: urls[0] })}
                                folder="story"
                                initialImages={story.backgroundImageUrl ? [story.backgroundImageUrl] : []}
                            />
                            <div className="space-y-2"><Label>Video URL</Label><Input value={story.videoUrl} onChange={e => setStory({ ...story, videoUrl: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                            <div className="flex justify-end"><Button onClick={() => saveData('/api/admin/story', story, 'Story', setStory)} disabled={saving}>Save Story</Button></div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* BTS TAB */}
                <TabsContent value="bts" className="mt-6">
                    <Card className="bg-zinc-900 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-white">BTS Section</CardTitle>
                            <AITranslateButton
                                fieldsToTranslate={{ title: bts.title, description: bts.description || '' }}
                                onTranslate={(t) => setBts(prev => ({ ...prev, ...t }))}
                            />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Tabs defaultValue="el" className="w-full">
                                <TabsList className="bg-white/5 border border-white/10 mb-4">
                                    <TabsTrigger value="el">Greek</TabsTrigger>
                                    <TabsTrigger value="en">English</TabsTrigger>
                                </TabsList>
                                <TabsContent value="el" className="space-y-4">
                                    <div className="space-y-2"><Label>Title</Label><Input value={bts.title} onChange={e => setBts({ ...bts, title: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                    <div className="space-y-2"><Label>Description</Label><Textarea value={bts.description} onChange={e => setBts({ ...bts, description: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                </TabsContent>
                                <TabsContent value="en" className="space-y-4">
                                    <div className="space-y-2"><Label>Title (En)</Label><Input value={bts.titleEn || ''} onChange={e => setBts({ ...bts, titleEn: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                    <div className="space-y-2"><Label>Description (En)</Label><Textarea value={bts.descriptionEn || ''} onChange={e => setBts({ ...bts, descriptionEn: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
                                </TabsContent>
                            </Tabs>
                            <div className="space-y-4">
                                <Label>Cards</Label>
                                {bts.cards?.map((card, idx) => (
                                    <div key={idx} className="p-4 border border-white/10 rounded-lg space-y-2">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-1"><Label className="text-xs">Label (Greek)</Label><Input value={card.label} onChange={e => {
                                                const newCards = [...bts.cards]; newCards[idx].label = e.target.value; setBts({ ...bts, cards: newCards });
                                            }} className="bg-white/5 border-white/10 text-white" /></div>
                                            <div className="space-y-1"><Label className="text-xs">Label (English)</Label><Input value={card.labelEn || ''} onChange={e => {
                                                const newCards = [...bts.cards]; newCards[idx].labelEn = e.target.value; setBts({ ...bts, cards: newCards });
                                            }} className="bg-white/5 border-white/10 text-white" /></div>
                                        </div>
                                        <FileUpload
                                            label="Card Image"
                                            onUploadComplete={urls => {
                                                const newCards = [...bts.cards]; newCards[idx].imageUrl = urls[0]; setBts({ ...bts, cards: newCards });
                                            }}
                                            folder="bts"
                                            initialImages={card.imageUrl ? [card.imageUrl] : []}
                                        />
                                    </div>
                                ))}
                                <Button variant="outline" onClick={() => setBts({ ...bts, cards: [...bts.cards, { label: 'New', imageUrl: '', order: bts.cards.length }] })}>Add Card</Button>
                            </div>
                            <div className="flex justify-end"><Button onClick={() => saveData('/api/admin/bts', bts, 'BTS', setBts)} disabled={saving}>Save BTS</Button></div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SERVICES TAB - Just simplified logic for now */}
                <TabsContent value="services" className="mt-6">
                    <Card className="bg-zinc-900 border-white/10">
                        <CardHeader><CardTitle className="text-white">Services</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <Tabs defaultValue="el">
                                <TabsList className="bg-white/5 border border-white/10 mb-4"><TabsTrigger value="el">Greek</TabsTrigger><TabsTrigger value="en">English</TabsTrigger></TabsList>
                                <TabsContent value="el" className="space-y-2">
                                    <Label>Headline</Label><Input value={services.headline} onChange={e => setServices({ ...services, headline: e.target.value })} className="bg-white/5 text-white border-white/10" />
                                    <Label>Description</Label><Textarea value={services.description || ''} onChange={e => setServices({ ...services, description: e.target.value })} className="bg-white/5 text-white border-white/10" />
                                </TabsContent>
                                <TabsContent value="en" className="space-y-2">
                                    <Label>Headline (En)</Label><Input value={services.headlineEn || ''} onChange={e => setServices({ ...services, headlineEn: e.target.value })} className="bg-white/5 text-white border-white/10" />
                                    <Label>Description (En)</Label><Textarea value={services.descriptionEn || ''} onChange={e => setServices({ ...services, descriptionEn: e.target.value })} className="bg-white/5 text-white border-white/10" />
                                </TabsContent>
                            </Tabs>
                            <FileUpload
                                label="Background Image"
                                onUploadComplete={urls => setServices({ ...services, backgroundImageUrl: urls[0] })}
                                folder="services"
                                initialImages={services.backgroundImageUrl ? [services.backgroundImageUrl] : []}
                            />
                            <div className="space-y-4">
                                {services.services?.map((s, idx) => (
                                    <div key={idx} className="p-4 border border-white/10 rounded bg-white/5">
                                        <div className="grid md:grid-cols-2 gap-4 mb-2">
                                            <div><Label className="text-xs">Title (EL)</Label><Input value={s.title} onChange={e => { const ns = [...services.services]; ns[idx].title = e.target.value; setServices({ ...services, services: ns }) }} className="bg-black/20 text-white border-white/10" /></div>
                                            <div><Label className="text-xs">Title (EN)</Label><Input value={s.titleEn || ''} onChange={e => { const ns = [...services.services]; ns[idx].titleEn = e.target.value; setServices({ ...services, services: ns }) }} className="bg-black/20 text-white border-white/10" /></div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4 mb-2">
                                            <div><Label className="text-xs">Desc (EL)</Label><Textarea value={s.description} onChange={e => { const ns = [...services.services]; ns[idx].description = e.target.value; setServices({ ...services, services: ns }) }} className="bg-black/20 text-white border-white/10" /></div>
                                            <div><Label className="text-xs">Desc (EN)</Label><Textarea value={s.descriptionEn || ''} onChange={e => { const ns = [...services.services]; ns[idx].descriptionEn = e.target.value; setServices({ ...services, services: ns }) }} className="bg-black/20 text-white border-white/10" /></div>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" onClick={() => setServices({ ...services, services: [...services.services, { iconName: 'Film', title: 'New', description: '', bullets: [], order: services.services.length }] })}>Add Service</Button>
                            </div>
                            <div className="flex justify-end"><Button onClick={() => saveData('/api/admin/services', services, 'Services', setServices)} disabled={saving}>Save Services</Button></div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* IMPACT TAB */}
                <TabsContent value="impact" className="mt-6">
                    <Card className="bg-zinc-900 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-white">Impact Section</CardTitle>
                            <AITranslateButton
                                fieldsToTranslate={{ heading: impact.heading, description: impact.description || '' }}
                                onTranslate={(t) => setImpact(prev => ({ ...prev, ...t }))}
                            />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Tabs defaultValue="el">
                                <TabsList className="bg-white/5 border border-white/10 mb-4"><TabsTrigger value="el">Greek</TabsTrigger><TabsTrigger value="en">English</TabsTrigger></TabsList>
                                <TabsContent value="el" className="space-y-2">
                                    <Label>Heading</Label><Input value={impact.heading} onChange={e => setImpact({ ...impact, heading: e.target.value })} className="bg-white/5 text-white border-white/10" />
                                    <Label>Description</Label><Textarea value={impact.description || ''} onChange={e => setImpact({ ...impact, description: e.target.value })} className="bg-white/5 text-white border-white/10" />
                                </TabsContent>
                                <TabsContent value="en" className="space-y-2">
                                    <Label>Heading (En)</Label><Input value={impact.headingEn || ''} onChange={e => setImpact({ ...impact, headingEn: e.target.value })} className="bg-white/5 text-white border-white/10" />
                                    <Label>Description (En)</Label><Textarea value={impact.descriptionEn || ''} onChange={e => setImpact({ ...impact, descriptionEn: e.target.value })} className="bg-white/5 text-white border-white/10" />
                                </TabsContent>
                            </Tabs>
                            <div className="space-y-4">
                                <Label>Stats</Label>
                                {impact.stats?.map((stat, idx) => (
                                    <div key={idx} className="p-4 border border-white/10 rounded bg-white/5 grid md:grid-cols-3 gap-4">
                                        <div><Label className="text-xs">Value</Label><Input type="number" value={stat.value} onChange={e => { const ns = [...impact.stats]; ns[idx].value = parseInt(e.target.value); setImpact({ ...impact, stats: ns }) }} className="bg-black/20 text-white border-white/10" /></div>
                                        <div><Label className="text-xs">Label (EL)</Label><Input value={stat.label} onChange={e => { const ns = [...impact.stats]; ns[idx].label = e.target.value; setImpact({ ...impact, stats: ns }) }} className="bg-black/20 text-white border-white/10" /></div>
                                        <div><Label className="text-xs">Label (EN)</Label><Input value={stat.labelEn || ''} onChange={e => { const ns = [...impact.stats]; ns[idx].labelEn = e.target.value; setImpact({ ...impact, stats: ns }) }} className="bg-black/20 text-white border-white/10" /></div>
                                        <div><Label className="text-xs">Suffix (EL)</Label><Input value={stat.suffix} onChange={e => { const ns = [...impact.stats]; ns[idx].suffix = e.target.value; setImpact({ ...impact, stats: ns }) }} className="bg-black/20 text-white border-white/10" /></div>
                                        <div><Label className="text-xs">Suffix (EN)</Label><Input value={stat.suffixEn || ''} onChange={e => { const ns = [...impact.stats]; ns[idx].suffixEn = e.target.value; setImpact({ ...impact, stats: ns }) }} className="bg-black/20 text-white border-white/10" /></div>
                                        <div className="flex items-end justify-end"><Button variant="destructive" size="sm" onClick={() => { const ns = impact.stats.filter((_, i) => i !== idx); setImpact({ ...impact, stats: ns }) }}><Trash2 className="w-4 h-4" /></Button></div>
                                    </div>
                                ))}
                                <Button variant="outline" onClick={() => setImpact({ ...impact, stats: [...impact.stats, { value: 0, suffix: '+', label: 'New Stat', order: impact.stats.length }] })}>Add Stat</Button>
                            </div>
                            <div className="flex justify-end"><Button onClick={() => saveData('/api/admin/impact', impact, 'Impact', setImpact)} disabled={saving}>Save Impact</Button></div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}
