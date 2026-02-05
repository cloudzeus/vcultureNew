import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    try {
        const story = await prisma.storySection.findFirst({
            where: { active: true },
        });
        return NextResponse.json(story);
    } catch (error) {
        console.error('Error fetching story section:', error);
        return NextResponse.json({ error: 'Failed to fetch story section' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await request.json();

        await prisma.storySection.updateMany({
            where: { active: true },
            data: { active: false },
        });

        const story = await prisma.storySection.upsert({
            where: { id: data.id || 'new' },
            create: {
                id: data.id || undefined,
                label: data.label,
                labelEn: data.labelEn,
                title: data.title,
                titleEn: data.titleEn,
                description: data.description,
                descriptionEn: data.descriptionEn,
                backgroundImageUrl: data.backgroundImageUrl,
                videoUrl: data.videoUrl,
                active: true,
            },
            update: {
                label: data.label,
                labelEn: data.labelEn,
                title: data.title,
                titleEn: data.titleEn,
                description: data.description,
                descriptionEn: data.descriptionEn,
                backgroundImageUrl: data.backgroundImageUrl,
                videoUrl: data.videoUrl,
                active: true,
            },
        });

        return NextResponse.json(story);
    } catch (error) {
        console.error('Error updating story section:', error);
        return NextResponse.json({ error: 'Failed to update story section' }, { status: 500 });
    }
}
