import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET all journal posts
export async function GET() {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const posts = await prisma.journalPost.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching journal posts:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

// POST create new journal post
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        const post = await prisma.journalPost.create({
            data: {
                title: data.title,
                titleEn: data.titleEn,
                slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
                excerpt: data.excerpt,
                excerptEn: data.excerptEn,
                content: data.content,
                contentEn: data.contentEn,
                type: data.type || 'ESSAY',
                featuredImageUrl: data.featuredImageUrl,
                authorName: data.authorName,
                readTime: data.readTime ? parseInt(data.readTime) : null,
                status: data.status || 'DRAFT',
                featured: data.featured || false,
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error creating journal post:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
