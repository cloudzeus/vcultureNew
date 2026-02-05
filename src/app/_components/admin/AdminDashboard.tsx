"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Film, FileText, Tags, TrendingUp, Languages, Loader2, CheckCircle, AlertTriangle, X } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardProps {
    stats: {
        projects: number;
        journal: number;
        categories: number;
    };
    recentProjects: any[];
}

export default function AdminDashboard({ stats, recentProjects }: DashboardProps) {
    const router = useRouter();

    // Translation State
    const [showTranslateDialog, setShowTranslateDialog] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [translationStep, setTranslationStep] = useState<'idle' | 'translating' | 'completed' | 'error'>('idle');
    const [translationLogs, setTranslationLogs] = useState<string[]>([]);
    const [translationStats, setTranslationStats] = useState({ processed: 0, remaining: 0, errors: 0 });
    const logScrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logs
    useEffect(() => {
        if (logScrollRef.current) {
            logScrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [translationLogs]);

    const addLog = (message: string) => {
        setTranslationLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    const handleOpenTranslateDialog = () => {
        setShowTranslateDialog(true);
        setTranslationStep('idle');
        setTranslationLogs([]);
        setTranslationStats({ processed: 0, remaining: 0, errors: 0 });
    };

    const startTranslationProcess = async () => {
        setIsTranslating(true);
        setTranslationStep('translating');
        addLog('Starting translation process...');
        addLog('Initializing batch processor...');

        try {
            let remaining = 1;
            let cycleCount = 0;
            const maxCycles = 50; // Safety break
            let totalProcessed = 0;
            let totalErrors = 0;

            while (remaining > 0 && cycleCount < maxCycles) {
                cycleCount++;
                addLog(`Processing batch #${cycleCount}...`);

                const res = await fetch('/api/admin/translate-all', { method: 'POST' });

                if (!res.ok) {
                    throw new Error(`Server error: ${res.status}`);
                }

                const data = await res.json();

                if (data.error) {
                    addLog(`Error: ${data.error}`);
                    throw new Error(data.error);
                }

                remaining = data.remaining;
                totalProcessed += data.processed;

                // Update specific counts if available, otherwise aggregate
                setTranslationStats({
                    processed: totalProcessed,
                    remaining: data.remaining,
                    errors: totalErrors + (data.errors || 0)
                });

                if (data.processed > 0) {
                    addLog(`Translated ${data.processed} items. ${data.remaining} remaining.`);
                } else if (data.remaining > 0 && data.errors > 0) {
                    totalErrors += data.errors;
                    addLog(`Encountered ${data.errors} errors. Retrying... (${data.remaining} left)`);
                    await new Promise(r => setTimeout(r, 2000));
                } else if (data.remaining === 0) {
                    addLog('All content processed successfully.');
                }
            }

            if (cycleCount >= maxCycles) {
                addLog('Batch translation paused to prevent timeout.');
                setTranslationStep('error');
            } else {
                addLog('Translation complete!');
                setTranslationStep('completed');
            }

            router.refresh();
        } catch (error: any) {
            console.error('Translation failed:', error);
            addLog(`CRITICAL ERROR: ${error.message}`);
            setTranslationStep('error');
        } finally {
            setIsTranslating(false);
        }
    };

    const statCards = [
        {
            title: 'Total Projects',
            value: stats.projects,
            icon: Film,
            description: 'Active video projects',
            trend: '+12%',
            trendUp: true,
        },
        {
            title: 'Journal Posts',
            value: stats.journal,
            icon: FileText,
            description: 'Published articles',
            trend: '+8%',
            trendUp: true,
        },
        {
            title: 'Categories',
            value: stats.categories,
            icon: Tags,
            description: 'Content categories',
            trend: '+2',
            trendUp: true,
        },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
                <p className="text-white/60">
                    Welcome back! Here's an overview of your content.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {statCards.map((stat) => (
                    <Card key={stat.title} className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-white/80">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{stat.value}</div>
                            <p className="text-xs text-white/60 mt-1">{stat.description}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <TrendingUp className="h-3 w-3 text-green-500" />
                                <span className="text-xs text-green-500 font-medium">
                                    {stat.trend}
                                </span>
                                <span className="text-xs text-white/40">from last month</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Projects Table */}
            <Card className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Recent Projects</CardTitle>
                    <CardDescription className="text-white/60">
                        Your latest video projects and films
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10 hover:bg-white/5">
                                <TableHead className="text-white/80">Title</TableHead>
                                <TableHead className="text-white/80">Type</TableHead>
                                <TableHead className="text-white/80">Categories</TableHead>
                                <TableHead className="text-white/80">Status</TableHead>
                                <TableHead className="text-white/80 text-right">Created</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentProjects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-white/40 py-8">
                                        No projects yet. Create your first project!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                recentProjects.map((project) => (
                                    <TableRow
                                        key={project.id}
                                        className="border-white/10 hover:bg-white/5 cursor-pointer"
                                    >
                                        <TableCell className="font-medium text-white">
                                            {project.title}
                                        </TableCell>
                                        <TableCell className="text-white/70">
                                            {project.type || 'Film'}
                                        </TableCell>
                                        <TableCell>
                                            {project.category && (
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-primary/20 text-primary border-primary/30"
                                                >
                                                    {project.category.name}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={project.status === 'PUBLISHED' ? 'default' : 'secondary'}
                                                className={
                                                    project.status === 'PUBLISHED'
                                                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                                }
                                            >
                                                {project.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-white/60 text-right">
                                            {new Date(project.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 hover:border-primary/40 transition-all cursor-pointer group">
                    <CardHeader>
                        <CardTitle className="text-white group-hover:text-primary transition-colors">
                            Create New Project
                        </CardTitle>
                        <CardDescription className="text-white/60">
                            Add a new video project or film to your portfolio
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border-white/10 hover:border-white/20 transition-all cursor-pointer group">
                    <CardHeader>
                        <CardTitle className="text-white group-hover:text-primary transition-colors">
                            Write Journal Post
                        </CardTitle>
                        <CardDescription className="text-white/60">
                            Share insights and stories from your productions
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card
                    className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 hover:border-indigo-500/40 transition-all cursor-pointer group"
                    onClick={handleOpenTranslateDialog}
                >
                    <CardHeader>
                        <CardTitle className="text-white group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                            <span>Full Site Translation</span>
                            <Languages className="h-5 w-5 text-indigo-500" />
                        </CardTitle>
                        <CardDescription className="text-white/60">
                            Automatically translate all missing content to English using AI
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>

            {/* Translation Modal */}
            <Dialog open={showTranslateDialog} onOpenChange={(open) => !isTranslating && setShowTranslateDialog(open)}>
                <DialogContent className="sm:max-w-md bg-zinc-900 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Full Site Translation</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            This process uses AI to identify and translate missing English content across your entire site.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 my-4">
                        {translationStep === 'idle' && (
                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex gap-3 text-sm text-yellow-500">
                                <AlertTriangle className="h-5 w-5 shrink-0" />
                                <div>
                                    Warning: This operation consumes AI tokens and may take several minutes depending on the volume of content.
                                </div>
                            </div>
                        )}

                        {translationStep !== 'idle' && (
                            <div className="bg-zinc-950 rounded-lg border border-white/10 p-3 h-48 flex flex-col">
                                <div className="flex justify-between text-xs text-zinc-500 mb-2 uppercase font-medium tracking-wider">
                                    <span>Process Log</span>
                                    <span>{translationStats.remaining} remaining</span>
                                </div>
                                <ScrollArea className="flex-1">
                                    <div className="space-y-1">
                                        {translationLogs.map((log, i) => (
                                            <div key={i} className="text-xs font-mono text-zinc-300 border-l-2 border-zinc-800 pl-2 py-0.5">
                                                {log}
                                            </div>
                                        ))}
                                        <div ref={logScrollRef} />
                                    </div>
                                </ScrollArea>
                            </div>
                        )}

                        {translationStep === 'completed' && (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex gap-3 items-center text-green-500">
                                <CheckCircle className="h-5 w-5" />
                                <div>Translation completed successfully!</div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="sm:justify-between gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setShowTranslateDialog(false)}
                            disabled={isTranslating}
                            className="text-zinc-400 hover:text-white hover:bg-white/10"
                        >
                            {translationStep === 'completed' ? 'Close' : 'Cancel'}
                        </Button>

                        {translationStep === 'idle' && (
                            <Button
                                onClick={startTranslationProcess}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Languages className="mr-2 h-4 w-4" />
                                Start Translation
                            </Button>
                        )}

                        {translationStep === 'translating' && (
                            <Button disabled className="bg-zinc-800 text-zinc-400">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Translating...
                            </Button>
                        )}

                        {translationStep === 'completed' && (
                            <Button onClick={() => setShowTranslateDialog(false)} className="bg-green-600 hover:bg-green-700 text-white">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Done
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
