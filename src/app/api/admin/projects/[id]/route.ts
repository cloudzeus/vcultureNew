import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET single project
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Convert BigInt to string for JSON serialization
        const serializedProject = {
            ...project,
            totalViews: project.totalViews?.toString() || '0',
            instagramViews: project.instagramViews?.toString() || '0',
            youtubeViews: project.youtubeViews?.toString() || '0',
        };

        return NextResponse.json(serializedProject);
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

// PATCH update project
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

        const project = await prisma.project.update({
            where: { id },
            data: {
                ...(data.title && { title: data.title }),
                ...(data.titleEn !== undefined && { titleEn: data.titleEn }),
                ...(data.slug && { slug: data.slug }),
                ...(data.categoryId && { categoryId: data.categoryId }),
                ...(data.subcategory !== undefined && { subcategory: data.subcategory }),
                ...(data.subcategoryEn !== undefined && { subcategoryEn: data.subcategoryEn }),
                ...(data.type && { type: data.type }),
                ...(data.year && { year: parseInt(data.year) }),
                ...(data.duration && { duration: data.duration }),
                ...(data.durationEn !== undefined && { durationEn: data.durationEn }),
                ...(data.director && { director: data.director }),
                ...(data.producer !== undefined && { producer: data.producer }),
                ...(data.writer !== undefined && { writer: data.writer }),
                ...(data.shortDescription && { shortDescription: data.shortDescription }),
                ...(data.shortDescriptionEn !== undefined && { shortDescriptionEn: data.shortDescriptionEn }),
                ...(data.fullDescription && { fullDescription: data.fullDescription }),
                ...(data.fullDescriptionEn !== undefined && { fullDescriptionEn: data.fullDescriptionEn }),
                ...(data.logline !== undefined && { logline: data.logline }),
                ...(data.loglineEn !== undefined && { loglineEn: data.loglineEn }),
                ...(data.heroImageUrl !== undefined && { heroImageUrl: data.heroImageUrl }),
                ...(data.trailerUrl !== undefined && { trailerUrl: data.trailerUrl }),
                ...(data.status && { status: data.status }),
                ...(data.featured !== undefined && { featured: data.featured }),
            },
            include: {
                category: true,
            },
        });

        // Convert BigInt to string for JSON serialization
        const serializedProject = {
            ...project,
            totalViews: project.totalViews?.toString() || '0',
            instagramViews: project.instagramViews?.toString() || '0',
            youtubeViews: project.youtubeViews?.toString() || '0',
        };

        return NextResponse.json(serializedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

// DELETE project
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
        await prisma.project.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
