'use client';

import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Loader2, GripVertical, Eye, Film } from 'lucide-react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/app/_components/admin/FileUpload';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import AITranslateButton from '@/components/admin/AITranslateButton';

interface Project {
    id: string;
    title: string;
    titleEn?: string;
    slug: string;
    categoryId: string;
    category: {
        id: string;
        name: string;
    };
    subcategory?: string;
    subcategoryEn?: string;
    type: string;
    year: number;
    duration: string;
    durationEn?: string;
    director: string;
    shortDescription: string;
    shortDescriptionEn?: string;
    fullDescription: string;
    fullDescriptionEn?: string;
    heroImageUrl?: string;
    trailerUrl?: string;
    status: string;
    featured: boolean;
    projectOrder: number;
    createdAt: string;
}

interface Category {
    id: string;
    name: string;
}

export default function ProjectsManagement() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [deletingProject, setDeletingProject] = useState<Project | null>(null);
    const [saving, setSaving] = useState(false);
    const [reordering, setReordering] = useState(false);

    // Form Language Toggle
    const [formLang, setFormLang] = useState<'el' | 'en'>('el');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [formData, setFormData] = useState({
        title: '',
        titleEn: '',
        slug: '',
        categoryId: '',
        subcategory: '',
        subcategoryEn: '',
        type: 'SHORT_FILM',
        year: new Date().getFullYear(),
        duration: '',
        durationEn: '',
        director: '',
        shortDescription: '',
        shortDescriptionEn: '',
        fullDescription: '',
        fullDescriptionEn: '',
        heroImageUrl: '',
        trailerUrl: '',
        status: 'DRAFT',
        featured: false,
    });

    useEffect(() => {
        fetchProjects();
        fetchCategories();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/admin/projects');
            const data = await res.json();
            if (Array.isArray(data)) {
                // Sort by projectOrder if available, otherwise by createdAt
                const sorted = data.sort((a, b) => (a.projectOrder || 0) - (b.projectOrder || 0));
                setProjects(sorted);
            } else {
                console.error('Invalid response:', data);
                setProjects([]);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleOpenModal = (project?: Project) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title,
                titleEn: project.titleEn || '',
                slug: project.slug,
                categoryId: project.categoryId,
                subcategory: project.subcategory || '',
                subcategoryEn: project.subcategoryEn || '',
                type: project.type,
                year: project.year,
                duration: project.duration,
                durationEn: project.durationEn || '',
                director: project.director,
                shortDescription: project.shortDescription,
                shortDescriptionEn: project.shortDescriptionEn || '',
                fullDescription: project.fullDescription,
                fullDescriptionEn: project.fullDescriptionEn || '',
                heroImageUrl: project.heroImageUrl || '',
                trailerUrl: project.trailerUrl || '',
                status: project.status,
                featured: project.featured,
            });
        } else {
            setEditingProject(null);
            setFormData({
                title: '',
                titleEn: '',
                slug: '',
                categoryId: categories[0]?.id || '',
                subcategory: '',
                subcategoryEn: '',
                type: 'SHORT_FILM',
                year: new Date().getFullYear(),
                duration: '',
                durationEn: '',
                director: '',
                shortDescription: '',
                shortDescriptionEn: '',
                fullDescription: '',
                fullDescriptionEn: '',
                heroImageUrl: '',
                trailerUrl: '',
                status: 'DRAFT',
                featured: false,
            });
        }
        setFormLang('el'); // Reset to Greek by default
        setModalOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const url = editingProject
                ? `/api/admin/projects/${editingProject.id}`
                : '/api/admin/projects';

            const method = editingProject ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setModalOpen(false);
                fetchProjects();
                router.refresh();
                toast.success('Project saved successfully');
            } else {
                toast.error('Failed to save project');
            }
        } catch (error) {
            console.error('Error saving project:', error);
            toast.error('Error saving project');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingProject) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/admin/projects/${deletingProject.id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setDeleteModalOpen(false);
                setDeletingProject(null);
                fetchProjects();
                router.refresh();
                toast.success('Project deleted');
            } else {
                toast.error('Failed to delete project');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Error deleting project');
        } finally {
            setSaving(false);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setProjects((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                // Update order in database
                updateProjectOrder(newItems);

                return newItems;
            });
        }
    };

    const updateProjectOrder = async (newProjects: Project[]) => {
        setReordering(true);
        try {
            const orders = newProjects.map((p, index) => ({
                id: p.id,
                projectOrder: index,
            }));

            const res = await fetch('/api/admin/projects/reorder', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orders }),
            });

            if (!res.ok) {
                console.error('Failed to update project order');
                fetchProjects(); // Revert to server side order
            }
        } catch (error) {
            console.error('Error updating project order:', error);
            fetchProjects();
        } finally {
            setReordering(false);
        }
    };

    const handleTranslation = (translations: any) => {
        setFormData(prev => ({
            ...prev,
            titleEn: translations.title || prev.titleEn,
            subcategoryEn: translations.subcategory || prev.subcategoryEn,
            durationEn: translations.duration || prev.durationEn,
            shortDescriptionEn: translations.shortDescription || prev.shortDescriptionEn,
            fullDescriptionEn: translations.fullDescription || prev.fullDescriptionEn,
        }));
        toast.success("Applied translations! Review and save.");
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
                    <h2 className="text-3xl font-bold text-white mb-2">Projects</h2>
                    <p className="text-white/60">Manage your video projects and films</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Project
                </Button>
            </div>

            <Card className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">All Projects</CardTitle>
                    <CardDescription className="text-white/60">
                        {projects.length} total projects
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                    >
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/10">
                                    <TableHead className="w-10"></TableHead>
                                    <TableHead className="w-16">Image</TableHead>
                                    <TableHead className="text-white/80">Title</TableHead>
                                    <TableHead className="text-white/80">Category</TableHead>
                                    <TableHead className="text-white/80">Year</TableHead>
                                    <TableHead className="text-white/80">Status</TableHead>
                                    <TableHead className="text-white/80">Featured</TableHead>
                                    <TableHead className="text-white/80">Lang</TableHead>
                                    <TableHead className="text-white/80 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <SortableContext
                                    items={projects.map((p) => p.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {projects.map((project) => (
                                        <SortableProjectRow
                                            key={project.id}
                                            project={project}
                                            onEdit={() => handleOpenModal(project)}
                                            onDelete={() => {
                                                setDeletingProject(project);
                                                setDeleteModalOpen(true);
                                            }}
                                        />
                                    ))}
                                </SortableContext>
                                {projects.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-white/40">
                                            No projects found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DndContext>
                </CardContent>
            </Card>

            {/* Add/Edit Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-white">
                            {editingProject ? 'Edit Project' : 'Add New Project'}
                        </DialogTitle>
                        <DialogDescription className="text-white/60">
                            {editingProject ? 'Update project details' : 'Create a new video project'}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Language Toggler & AI */}
                    <div className="flex items-center justify-between my-2 border-b border-white/10 pb-4">
                        <div className="flex space-x-2">
                            <Button
                                variant={formLang === 'el' ? 'default' : 'secondary'}
                                onClick={() => setFormLang('el')}
                                size="sm"
                                className={formLang === 'el' ? "bg-primary text-primary-foreground" : "bg-white/10 text-white hover:bg-white/20"}
                            >
                                Ελληνικά (EL)
                            </Button>
                            <Button
                                variant={formLang === 'en' ? 'default' : 'secondary'}
                                onClick={() => setFormLang('en')}
                                size="sm"
                                className={formLang === 'en' ? "bg-primary text-primary-foreground" : "bg-white/10 text-white hover:bg-white/20"}
                            >
                                English (EN)
                            </Button>
                        </div>

                        {formLang === 'en' && (
                            <AITranslateButton
                                onTranslate={handleTranslation}
                                fieldsToTranslate={{
                                    title: formData.title,
                                    subcategory: formData.subcategory,
                                    duration: formData.duration,
                                    shortDescription: formData.shortDescription,
                                    fullDescription: formData.fullDescription,
                                }}
                            />
                        )}
                    </div>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title" className="text-white/80">Title ({formLang.toUpperCase()}) *</Label>
                            {formLang === 'el' ? (
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            ) : (
                                <Input
                                    id="titleEn"
                                    value={formData.titleEn}
                                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white"
                                    placeholder="English Title"
                                />
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="slug" className="text-white/80">Slug *</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="category" className="text-white/80">Category *</Label>
                                <Select
                                    value={formData.categoryId}
                                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                                >
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-white/10">
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id} className="text-white">
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="subcategory" className="text-white/80">Subcategory ({formLang.toUpperCase()})</Label>
                                {formLang === 'el' ? (
                                    <Input
                                        id="subcategory"
                                        value={formData.subcategory}
                                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                                        className="bg-white/5 border-white/10 text-white"
                                        placeholder="e.g. Σχολικός εκφοβισμός"
                                    />
                                ) : (
                                    <Input
                                        id="subcategoryEn"
                                        value={formData.subcategoryEn}
                                        onChange={(e) => setFormData({ ...formData, subcategoryEn: e.target.value })}
                                        className="bg-white/5 border-white/10 text-white"
                                        placeholder="e.g. School bullying"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="type" className="text-white/80">Type *</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                                >
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-white/10">
                                        <SelectItem value="SHORT_FILM" className="text-white">Short Film</SelectItem>
                                        <SelectItem value="DOCUMENTARY" className="text-white">Documentary</SelectItem>
                                        <SelectItem value="CAMPAIGN" className="text-white">Campaign</SelectItem>
                                        <SelectItem value="COMMERCIAL" className="text-white">Commercial</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="year" className="text-white/80">Year *</Label>
                                <Input
                                    id="year"
                                    type="number"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="duration" className="text-white/80">Duration ({formLang.toUpperCase()}) *</Label>
                            {formLang === 'el' ? (
                                <Input
                                    id="duration"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    placeholder="e.g., 15 λεπτά"
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            ) : (
                                <Input
                                    id="durationEn"
                                    value={formData.durationEn}
                                    onChange={(e) => setFormData({ ...formData, durationEn: e.target.value })}
                                    placeholder="e.g., 15 minutes"
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="director" className="text-white/80">Director *</Label>
                            <Input
                                id="director"
                                value={formData.director}
                                onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="shortDescription" className="text-white/80">Short Description ({formLang.toUpperCase()}) *</Label>
                            {formLang === 'el' ? (
                                <Textarea
                                    id="shortDescription"
                                    value={formData.shortDescription}
                                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white min-h-[80px]"
                                />
                            ) : (
                                <Textarea
                                    id="shortDescriptionEn"
                                    value={formData.shortDescriptionEn}
                                    onChange={(e) => setFormData({ ...formData, shortDescriptionEn: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white min-h-[80px]"
                                    placeholder="English Short Description"
                                />
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="fullDescription" className="text-white/80">Full Description ({formLang.toUpperCase()}) *</Label>
                            {formLang === 'el' ? (
                                <Textarea
                                    id="fullDescription"
                                    value={formData.fullDescription}
                                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white min-h-[120px]"
                                />
                            ) : (
                                <Textarea
                                    id="fullDescriptionEn"
                                    value={formData.fullDescriptionEn}
                                    onChange={(e) => setFormData({ ...formData, fullDescriptionEn: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white min-h-[120px]"
                                    placeholder="English Full Description"
                                />
                            )}
                        </div>

                        <div className="grid gap-2 border-t border-white/5 pt-4">
                            <Label className="text-white/80">Hero Image</Label>
                            <FileUpload
                                onUploadComplete={(urls) => setFormData({ ...formData, heroImageUrl: urls[0] })}
                                folder="projects"
                                label="Upload Hero Image"
                            />
                            <div className="mt-2">
                                <Label htmlFor="heroImageUrl" className="text-sm text-white/40">Or enter manual URL</Label>
                                <Input
                                    id="heroImageUrl"
                                    value={formData.heroImageUrl}
                                    onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="bg-white/5 border-white/10 text-white mt-1"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2 border-t border-white/5 pt-4">
                            <Label className="text-white/80">Trailer Video</Label>
                            <FileUpload
                                onUploadComplete={(urls) => setFormData({ ...formData, trailerUrl: urls[0] })}
                                folder="videos"
                                type="video"
                                label="Upload Trailer Video"
                            />
                            <div className="mt-2">
                                <Label htmlFor="trailerUrl" className="text-sm text-white/40">Or enter manual URL</Label>
                                <Input
                                    id="trailerUrl"
                                    value={formData.trailerUrl}
                                    onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="bg-white/5 border-white/10 text-white mt-1"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status" className="text-white/80">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-white/10">
                                    <SelectItem value="DRAFT" className="text-white">Draft</SelectItem>
                                    <SelectItem value="PUBLISHED" className="text-white">Published</SelectItem>
                                    <SelectItem value="ARCHIVED" className="text-white">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="featured"
                                checked={formData.featured}
                                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                            />
                            <Label htmlFor="featured" className="text-white/80">Featured on homepage</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalOpen(false)} className="border-white/10 text-white">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {editingProject ? 'Update' : 'Create'} Project
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="bg-zinc-900 border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-white">Delete Project</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Are you sure you want to delete "{deletingProject?.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteModalOpen(false)} className="border-white/10 text-white">
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={saving}>
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function SortableProjectRow({
    project,
    onEdit,
    onDelete,
}: {
    project: Project;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: project.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <TableRow ref={setNodeRef} style={style} className="border-white/10 group">
            <TableCell>
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1">
                    <GripVertical className="h-4 w-4 text-white/20 group-hover:text-white/60 transition-colors" />
                </div>
            </TableCell>
            <TableCell>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Avatar className="h-10 w-10 rounded-md border border-white/10 cursor-zoom-in">
                                <AvatarImage src={project.heroImageUrl} className="object-cover" />
                                <AvatarFallback className="bg-white/5 text-white/40">
                                    <Film className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="p-0 border-white/10 bg-transparent" sideOffset={10}>
                            <img
                                src={project.heroImageUrl}
                                alt={project.title}
                                className="w-[500px] h-auto rounded-lg shadow-2xl border border-white/20"
                            />
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </TableCell>
            <TableCell className="font-medium text-white">
                {project.title}
            </TableCell>
            <TableCell>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                    {project.category.name}
                </Badge>
            </TableCell>
            <TableCell className="text-white/70">{project.year}</TableCell>
            <TableCell>
                <Badge
                    variant={project.status === 'PUBLISHED' ? 'default' : 'secondary'}
                    className={
                        project.status === 'PUBLISHED'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                    }
                >
                    {project.status}
                </Badge>
            </TableCell>
            <TableCell>
                {project.featured && (
                    <Badge className="bg-blue-500/20 text-blue-400">Featured</Badge>
                )}
            </TableCell>
            <TableCell>
                <div className="flex gap-1">
                    <Badge variant="outline" className="border-white/20 text-white/60 text-[10px] px-1 py-0 h-5">EL</Badge>
                    {project.titleEn && <Badge variant="default" className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border-emerald-500/20 text-[10px] px-1 py-0 h-5">EN</Badge>}
                </div>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        className="text-white/70 hover:text-white"
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                        className="text-red-400/70 hover:text-red-400"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}
