import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET all projects
export async function GET() {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const projects = await prisma.project.findMany({
            include: {
                category: true,
            },
            orderBy: { projectOrder: 'asc' },
        });

        // Convert BigInt to string for JSON serialization
        const serializedProjects = projects.map(project => ({
            ...project,
            totalViews: project.totalViews?.toString() || '0',
            instagramViews: project.instagramViews?.toString() || '0',
            youtubeViews: project.youtubeViews?.toString() || '0',
        }));

        return NextResponse.json(serializedProjects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

// POST create new project
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        const project = await prisma.project.create({
            data: {
                title: data.title,
                titleEn: data.titleEn,
                slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
                categoryId: data.categoryId,
                subcategory: data.subcategory,
                subcategoryEn: data.subcategoryEn,
                type: data.type || 'SHORT_FILM',
                year: parseInt(data.year),
                duration: data.duration,
                durationEn: data.durationEn,
                director: data.director,
                producer: data.producer,
                writer: data.writer,
                shortDescription: data.shortDescription,
                shortDescriptionEn: data.shortDescriptionEn,
                fullDescription: data.fullDescription,
                fullDescriptionEn: data.fullDescriptionEn,
                logline: data.logline,
                loglineEn: data.loglineEn,
                heroImageUrl: data.heroImageUrl,
                trailerUrl: data.trailerUrl,
                status: data.status || 'DRAFT',
                featured: data.featured || false,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
