'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2, Loader2, X, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/app/_components/admin/FileUpload';
import AITranslateButton from '@/components/admin/AITranslateButton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface JournalPost {
    id: string;
    title: string;
    titleEn?: string;
    slug: string;
    excerpt: string;
    excerptEn?: string;
    content: string;
    contentEn?: string;
    type: string;
    featuredImageUrl?: string;
    authorName: string;
    readTime?: number;
    status: string;
    featured: boolean;
    createdAt: string;
}

export default function JournalManagement() {
    const router = useRouter();
    const [posts, setPosts] = useState<JournalPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<JournalPost | null>(null);
    const [deletingPost, setDeletingPost] = useState<JournalPost | null>(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        titleEn: '',
        slug: '',
        excerpt: '',
        excerptEn: '',
        content: '',
        contentEn: '',
        type: 'ESSAY',
        featuredImageUrl: '',
        authorName: '',
        readTime: 5,
        status: 'DRAFT',
        featured: false,
        gallery: [] as string[],
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/admin/journal');
            const data = await res.json();
            if (Array.isArray(data)) {
                setPosts(data);
            } else {
                console.error('Invalid response:', data);
                setPosts([]);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (post?: JournalPost) => {
        if (post) {
            setEditingPost(post);
            setFormData({
                title: post.title,
                titleEn: post.titleEn || '',
                slug: post.slug,
                excerpt: post.excerpt,
                excerptEn: post.excerptEn || '',
                content: post.content,
                contentEn: post.contentEn || '',
                type: post.type,
                featuredImageUrl: post.featuredImageUrl || '',
                authorName: post.authorName,
                readTime: post.readTime || 5,
                status: post.status,
                featured: post.featured,
                gallery: [] as string[], // We'll need to fetch these or include them in the post object if possible
            });
        } else {
            setEditingPost(null);
            setFormData({
                title: '',
                titleEn: '',
                slug: '',
                excerpt: '',
                excerptEn: '',
                content: '',
                contentEn: '',
                type: 'ESSAY',
                featuredImageUrl: '',
                authorName: '',
                readTime: 5,
                status: 'DRAFT',
                featured: false,
                gallery: [],
            });
        }
        setModalOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const url = editingPost ? `/api/admin/journal/${editingPost.id}` : '/api/admin/journal';
            const method = editingPost ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setModalOpen(false);
                fetchPosts();
                router.refresh();
            }
        } catch (error) {
            console.error('Error saving post:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingPost) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/admin/journal/${deletingPost.id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setDeleteModalOpen(false);
                setDeletingPost(null);
                fetchPosts();
                router.refresh();
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleTranslation = (translatedData: any) => {
        setFormData(prev => ({
            ...prev,
            titleEn: translatedData.title || prev.titleEn,
            excerptEn: translatedData.excerpt || prev.excerptEn,
            contentEn: translatedData.content || prev.contentEn,
        }));
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
                    <h2 className="text-3xl font-bold text-white mb-2">Journal</h2>
                    <p className="text-white/60">Manage journal posts and articles</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Post
                </Button>
            </div>

            <Card className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">All Posts</CardTitle>
                    <CardDescription className="text-white/60">{posts.length} total posts</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10">
                                <TableHead className="w-16">Image</TableHead>
                                <TableHead className="text-white/80">Title</TableHead>
                                <TableHead className="text-white/80">Type</TableHead>
                                <TableHead className="text-white/80">Author</TableHead>
                                <TableHead className="text-white/80">Status</TableHead>
                                <TableHead className="text-white/80">Lang</TableHead>
                                <TableHead className="text-white/80 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.map((post) => (
                                <TableRow key={post.id} className="border-white/10">
                                    <TableCell>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Avatar className="h-10 w-10 rounded-md border border-white/10 cursor-zoom-in">
                                                        <AvatarImage src={post.featuredImageUrl} className="object-cover" />
                                                        <AvatarFallback className="bg-white/5 text-white/40">
                                                            <FileText className="h-4 w-4" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </TooltipTrigger>
                                                <TooltipContent side="right" className="p-0 border-white/10 bg-transparent" sideOffset={10}>
                                                    {post.featuredImageUrl && (
                                                        <img
                                                            src={post.featuredImageUrl}
                                                            alt={post.title}
                                                            className="w-[500px] h-auto rounded-lg shadow-2xl border border-white/20"
                                                        />
                                                    )}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                    <TableCell className="font-medium text-white">{post.title}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-primary/20 text-primary">{post.type}</Badge>
                                    </TableCell>
                                    <TableCell className="text-white/70">{post.authorName}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={post.status === 'PUBLISHED' ? 'default' : 'secondary'}
                                            className={post.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}
                                        >
                                            {post.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Badge variant="outline" className="border-white/20 text-white/60 text-[10px] px-1 py-0 h-5">EL</Badge>
                                            {post.titleEn && <Badge variant="default" className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border-emerald-500/20 text-[10px] px-1 py-0 h-5">EN</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleOpenModal(post)} className="text-white/70 hover:text-white">
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setDeletingPost(post);
                                                    setDeleteModalOpen(true);
                                                }}
                                                className="text-red-400/70 hover:text-red-400"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add/Edit Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-white/10">
                    <DialogHeader>
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <DialogTitle className="text-white">{editingPost ? 'Edit Post' : 'Add New Post'}</DialogTitle>
                                <DialogDescription className="text-white/60">
                                    {editingPost ? 'Update post details' : 'Create a new journal post'}
                                </DialogDescription>
                            </div>
                            <AITranslateButton
                                fieldsToTranslate={{
                                    title: formData.title,
                                    excerpt: formData.excerpt,
                                    content: formData.content
                                }}
                                onTranslate={handleTranslation}
                            />
                        </div>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <Tabs defaultValue="el" className="w-full">
                            <TabsList className="bg-white/5 border border-white/10 mx-auto w-fit mb-4">
                                <TabsTrigger value="el">Greek (Primary)</TabsTrigger>
                                <TabsTrigger value="en">English</TabsTrigger>
                            </TabsList>

                            {/* GREEK FIELDS */}
                            <TabsContent value="el" className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title" className="text-white/80">Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="excerpt" className="text-white/80">Excerpt *</Label>
                                    <Textarea
                                        id="excerpt"
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        className="bg-white/5 border-white/10 text-white min-h-[80px]"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="content" className="text-white/80">Content *</Label>
                                    <Textarea
                                        id="content"
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="bg-white/5 border-white/10 text-white min-h-[200px]"
                                    />
                                </div>
                            </TabsContent>

                            {/* ENGLISH FIELDS */}
                            <TabsContent value="en" className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="titleEn" className="text-white/80">Title (English)</Label>
                                    <Input
                                        id="titleEn"
                                        value={formData.titleEn}
                                        onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                                        className="bg-white/5 border-white/10 text-white"
                                        placeholder="AI Generated or Manual Entry"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="excerptEn" className="text-white/80">Excerpt (English)</Label>
                                    <Textarea
                                        id="excerptEn"
                                        value={formData.excerptEn}
                                        onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
                                        className="bg-white/5 border-white/10 text-white min-h-[80px]"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="contentEn" className="text-white/80">Content (English)</Label>
                                    <Textarea
                                        id="contentEn"
                                        value={formData.contentEn}
                                        onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                                        className="bg-white/5 border-white/10 text-white min-h-[200px]"
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>

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
                                <Label htmlFor="type" className="text-white/80">Type</Label>
                                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-white/10">
                                        <SelectItem value="ESSAY" className="text-white">Essay</SelectItem>
                                        <SelectItem value="INTERVIEW" className="text-white">Interview</SelectItem>
                                        <SelectItem value="NEWS" className="text-white">News</SelectItem>
                                        <SelectItem value="CASE_STUDY" className="text-white">Case Study</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="readTime" className="text-white/80">Read Time (min)</Label>
                                <Input
                                    id="readTime"
                                    type="number"
                                    value={formData.readTime}
                                    onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) })}
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="authorName" className="text-white/80">Author Name *</Label>
                            <Input
                                id="authorName"
                                value={formData.authorName}
                                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>

                        <div className="grid gap-2 border-t border-white/5 pt-4">
                            <Label className="text-white/80">Featured Image</Label>
                            <FileUpload
                                onUploadComplete={(urls) => setFormData({ ...formData, featuredImageUrl: urls[0] })}
                                folder="journal"
                                label="Upload Featured Image"
                            />
                            <div className="mt-2">
                                <Label htmlFor="featuredImageUrl" className="text-sm text-white/40">Or enter manual URL</Label>
                                <Input
                                    id="featuredImageUrl"
                                    value={formData.featuredImageUrl}
                                    onChange={(e) => setFormData({ ...formData, featuredImageUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="bg-white/5 border-white/10 text-white mt-1"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status" className="text-white/80">Status</Label>
                            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
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
                            <Label htmlFor="featured" className="text-white/80">Featured post</Label>
                        </div>

                        <div className="grid gap-2 border-t border-white/5 pt-4">
                            <Label className="text-white/80">Gallery Images</Label>
                            <FileUpload
                                onUploadComplete={(urls) => setFormData({ ...formData, gallery: [...formData.gallery, ...urls] })}
                                folder="journal-gallery"
                                multiple={true}
                                label="Upload Gallery Images"
                            />
                            {formData.gallery.length > 0 && (
                                <div className="grid grid-cols-4 gap-2 mt-2">
                                    {formData.gallery.map((url, i) => (
                                        <div key={i} className="relative aspect-square rounded overflow-hidden group">
                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => {
                                                    const newGallery = [...formData.gallery];
                                                    newGallery.splice(i, 1);
                                                    setFormData({ ...formData, gallery: newGallery });
                                                }}
                                                className="absolute top-0 right-0 bg-red-500 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalOpen(false)} className="border-white/10 text-white">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {editingPost ? 'Update' : 'Create'} Post
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="bg-zinc-900 border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-white">Delete Post</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Are you sure you want to delete "{deletingPost?.title}"? This action cannot be undone.
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
        </div >
    );
}
