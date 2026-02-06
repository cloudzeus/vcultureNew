import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// Helper to serialize BigInt
const serializeProject = (project: any) => {
    return {
        ...project,
        totalViews: project.totalViews?.toString() || '0',
        instagramViews: project.instagramViews?.toString() || '0',
        youtubeViews: project.youtubeViews?.toString() || '0',
    };
};

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
        const serializedProjects = projects.map(serializeProject);

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

        // Generate base slug
        let baseSlug = data.slug;
        if (!baseSlug) {
            baseSlug = data.title
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '') // Remove special chars
                .replace(/\s+/g, '-')     // Replace spaces with -
                .replace(/-+/g, '-');     // Replace multiple - with single -
        }

        // Ensure unique slug
        let slug = baseSlug;
        let counter = 1;
        while (await prisma.project.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        const project = await prisma.project.create({
            data: {
                title: data.title,
                titleEn: data.titleEn,
                slug: slug,
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

        return NextResponse.json(serializeProject(project));
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
