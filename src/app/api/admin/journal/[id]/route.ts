import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// PATCH update journal post
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const data = await request.json();

        const post = await prisma.journalPost.update({
            where: { id },
            data: {
                ...(data.title && { title: data.title }),
                ...(data.titleEn && { titleEn: data.titleEn }),
                ...(data.slug && { slug: data.slug }),
                ...(data.excerpt && { excerpt: data.excerpt }),
                ...(data.excerptEn && { excerptEn: data.excerptEn }),
                ...(data.content && { content: data.content }),
                ...(data.contentEn && { contentEn: data.contentEn }),
                ...(data.type && { type: data.type }),
                ...(data.featuredImageUrl !== undefined && { featuredImageUrl: data.featuredImageUrl }),
                ...(data.authorName && { authorName: data.authorName }),
                ...(data.readTime !== undefined && { readTime: data.readTime ? parseInt(data.readTime) : null }),
                ...(data.status && { status: data.status }),
                ...(data.featured !== undefined && { featured: data.featured }),
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error updating journal post:', error);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

// DELETE journal post
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await prisma.journalPost.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting journal post:', error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
