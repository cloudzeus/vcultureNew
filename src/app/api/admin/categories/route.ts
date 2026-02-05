import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET all categories
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { order: 'asc' },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

// POST create new category
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        const category = await prisma.category.create({
            data: {
                name: data.name,
                nameEn: data.nameEn,
                slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
                description: data.description,
                descriptionEn: data.descriptionEn,
                color: data.color,
                icon: data.icon,
                order: data.order || 0,
                featured: data.featured || false,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
