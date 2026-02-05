import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    try {
        const studio = await prisma.studioSection.findFirst({
            where: { active: true },
        });
        return NextResponse.json(studio);
    } catch (error) {
        console.error('Error fetching studio section:', error);
        return NextResponse.json({ error: 'Failed to fetch studio section' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await request.json();

        // Deactivate all other studio sections
        await prisma.studioSection.updateMany({
            where: { active: true },
            data: { active: false },
        });

        const studio = await prisma.studioSection.upsert({
            where: { id: data.id || 'new' },
            create: {
                id: data.id || undefined,
                eyebrow: data.eyebrow,
                eyebrowEn: data.eyebrowEn,
                headline: data.headline,
                headlineEn: data.headlineEn,
                description: data.description,
                descriptionEn: data.descriptionEn,
                backgroundImageUrl: data.backgroundImageUrl,
                cardTitle: data.cardTitle,
                cardTitleEn: data.cardTitleEn,
                cardSubtitle: data.cardSubtitle,
                cardSubtitleEn: data.cardSubtitleEn,
                cardDescription: data.cardDescription,
                cardDescriptionEn: data.cardDescriptionEn,
                cardImageUrl: data.cardImageUrl,
                cardVideoUrl: data.cardVideoUrl,
                active: true,
            },
            update: {
                eyebrow: data.eyebrow,
                eyebrowEn: data.eyebrowEn,
                headline: data.headline,
                headlineEn: data.headlineEn,
                description: data.description,
                descriptionEn: data.descriptionEn,
                backgroundImageUrl: data.backgroundImageUrl,
                cardTitle: data.cardTitle,
                cardTitleEn: data.cardTitleEn,
                cardSubtitle: data.cardSubtitle,
                cardSubtitleEn: data.cardSubtitleEn,
                cardDescription: data.cardDescription,
                cardDescriptionEn: data.cardDescriptionEn,
                cardImageUrl: data.cardImageUrl,
                cardVideoUrl: data.cardVideoUrl,
                active: true,
            },
        });

        return NextResponse.json(studio);
    } catch (error) {
        console.error('Error updating studio section:', error);
        return NextResponse.json({ error: 'Failed to update studio section' }, { status: 500 });
    }
}
