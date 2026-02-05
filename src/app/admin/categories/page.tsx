'use client';

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
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Loader2, GripVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
import { toast } from 'sonner';

interface Category {
    id: string;
    name: string;
    nameEn?: string;
    slug: string;
    description?: string;
    descriptionEn?: string;
    color?: string;
    icon?: string;
    order: number;
    featured: boolean;
}

export default function CategoriesManagement() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
    const [saving, setSaving] = useState(false);
    const [reordering, setReordering] = useState(false);
    const [formLang, setFormLang] = useState<'el' | 'en'>('el');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [formData, setFormData] = useState({
        name: '',
        nameEn: '',
        slug: '',
        description: '',
        descriptionEn: '',
        color: '#FF5722',
        icon: '',
        order: 0,
        featured: false,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            if (Array.isArray(data)) {
                // Sort by order
                const sorted = data.sort((a, b) => (a.order || 0) - (b.order || 0));
                setCategories(sorted);
            } else {
                console.error('Invalid response:', data);
                setCategories([]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                nameEn: category.nameEn || '',
                slug: category.slug,
                description: category.description || '',
                descriptionEn: category.descriptionEn || '',
                color: category.color || '#FF5722',
                icon: category.icon || '',
                order: category.order,
                featured: category.featured,
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                nameEn: '',
                slug: '',
                description: '',
                descriptionEn: '',
                color: '#FF5722',
                icon: '',
                order: categories.length,
                featured: false,
            });
        }
        setFormLang('el');
        setModalOpen(true);
    };

    const handleTranslation = (translations: any) => {
        setFormData(prev => ({
            ...prev,
            nameEn: translations.name || prev.nameEn,
            descriptionEn: translations.description || prev.descriptionEn,
        }));
        toast.success("Translations applied!");
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const url = editingCategory
                ? `/api/admin/categories/${editingCategory.id}`
                : '/api/admin/categories';

            const method = editingCategory ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setModalOpen(false);
                fetchCategories();
                router.refresh();
                toast.success('Category saved successfully');
            } else {
                toast.error('Failed to save category');
            }
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error('Error saving category');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingCategory) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/admin/categories/${deletingCategory.id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setDeleteModalOpen(false);
                setDeletingCategory(null);
                fetchCategories();
                router.refresh();
                toast.success('Category deleted');
            } else {
                toast.error('Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Error deleting category');
        } finally {
            setSaving(false);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setCategories((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                // Update order in database
                updateCategoryOrder(newItems);

                return newItems;
            });
        }
    };

    const updateCategoryOrder = async (newCategories: Category[]) => {
        setReordering(true);
        try {
            const orders = newCategories.map((c, index) => ({
                id: c.id,
                order: index,
            }));

            const res = await fetch('/api/admin/categories/reorder', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orders }),
            });

            if (!res.ok) {
                console.error('Failed to update category order');
                fetchCategories(); // Revert to server side order
            }
        } catch (error) {
            console.error('Error updating category order:', error);
            fetchCategories();
        } finally {
            setReordering(false);
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
                    <h2 className="text-3xl font-bold text-white mb-2">Categories</h2>
                    <p className="text-white/60">Manage content categories and organization</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Category
                </Button>
            </div>

            <Card className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">All Categories</CardTitle>
                    <CardDescription className="text-white/60">
                        {categories.length} total categories
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
                                    <TableHead className="text-white/80">Name</TableHead>
                                    <TableHead className="text-white/80">Slug</TableHead>
                                    <TableHead className="text-white/80">Color</TableHead>
                                    <TableHead className="text-white/80">Order</TableHead>
                                    <TableHead className="text-white/80">Lang</TableHead>
                                    <TableHead className="text-white/80">Featured</TableHead>
                                    <TableHead className="text-white/80 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <SortableContext
                                    items={categories.map((c) => c.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {categories.map((category) => (
                                        <SortableCategoryRow
                                            key={category.id}
                                            category={category}
                                            onEdit={() => handleOpenModal(category)}
                                            onDelete={() => {
                                                setDeletingCategory(category);
                                                setDeleteModalOpen(true);
                                            }}
                                        />
                                    ))}
                                </SortableContext>
                                {categories.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-white/40">
                                            No categories found
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
                <DialogContent className="max-w-xl bg-zinc-900 border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-white">
                            {editingCategory ? 'Edit Category' : 'Add New Category'}
                        </DialogTitle>
                        <DialogDescription className="text-white/60">
                            {editingCategory ? 'Update category details' : 'Create a new content category'}
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
                                    name: formData.name,
                                    description: formData.description,
                                }}
                            />
                        )}
                    </div>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-white/80">Name ({formLang.toUpperCase()}) *</Label>
                            {formLang === 'el' ? (
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            ) : (
                                <Input
                                    id="nameEn"
                                    value={formData.nameEn}
                                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white"
                                    placeholder="English Name"
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

                        <div className="grid gap-2">
                            <Label htmlFor="description" className="text-white/80">Description ({formLang.toUpperCase()})</Label>
                            {formLang === 'el' ? (
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white min-h-[80px]"
                                />
                            ) : (
                                <Textarea
                                    id="descriptionEn"
                                    value={formData.descriptionEn}
                                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white min-h-[80px]"
                                    placeholder="English Description"
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="color" className="text-white/80">Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="color"
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-16 h-10 bg-white/5 border-white/10"
                                    />
                                    <Input
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="flex-1 bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="order" className="text-white/80">Order</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="icon" className="text-white/80">Icon (emoji or icon name)</Label>
                            <Input
                                id="icon"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                placeholder="🎬 or icon-name"
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="featured"
                                checked={formData.featured}
                                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                            />
                            <Label htmlFor="featured" className="text-white/80">Featured category</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalOpen(false)} className="border-white/10 text-white">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {editingCategory ? 'Update' : 'Create'} Category
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="bg-zinc-900 border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-white">Delete Category</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Are you sure you want to delete "{deletingCategory?.name}"? This action cannot be undone.
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

function SortableCategoryRow({
    category,
    onEdit,
    onDelete,
}: {
    category: Category;
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
    } = useSortable({ id: category.id });

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
            <TableCell className="font-medium text-white">
                {category.name}
            </TableCell>
            <TableCell className="text-white/70">{category.slug}</TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: category.color || '#FF5722' }}
                    />
                    <span className="text-white/70 text-sm">{category.color}</span>
                </div>
            </TableCell>
            <TableCell className="text-white/70">{category.order}</TableCell>
            <TableCell>
                <div className="flex gap-1">
                    <Badge variant="outline" className="border-white/20 text-white/60 text-[10px] px-1 py-0 h-5">EL</Badge>
                    {category.nameEn && <Badge variant="default" className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border-emerald-500/20 text-[10px] px-1 py-0 h-5">EN</Badge>}
                </div>
            </TableCell>
            <TableCell>
                {category.featured && (
                    <Badge className="bg-blue-500/20 text-blue-400">Featured</Badge>
                )}
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
