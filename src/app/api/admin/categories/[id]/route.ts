import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET single category
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const category = await prisma.category.findUnique({
            where: { id },
        });

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
    }
}

// PATCH update category
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

        const category = await prisma.category.update({
            where: { id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.nameEn !== undefined && { nameEn: data.nameEn }),
                ...(data.slug && { slug: data.slug }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.descriptionEn !== undefined && { descriptionEn: data.descriptionEn }),
                ...(data.color && { color: data.color }),
                ...(data.icon !== undefined && { icon: data.icon }),
                ...(data.order !== undefined && { order: data.order }),
                ...(data.featured !== undefined && { featured: data.featured }),
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}

// DELETE category
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
        await prisma.category.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
