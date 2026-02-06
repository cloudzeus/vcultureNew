import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET active hero section
export async function GET() {
    try {
        let hero = await prisma.heroSection.findFirst({
            where: { active: true },
        });

        if (!hero) {
            // Fallback to the latest record if no active one exists
            hero = await prisma.heroSection.findFirst({
                orderBy: { updatedAt: 'desc' }
            });
        }

        return NextResponse.json(hero);
    } catch (error) {
        console.error('Error fetching hero section:', error);
        return NextResponse.json({ error: 'Failed to fetch hero section' }, { status: 500 });
    }
}

// POST/PATCH update hero section
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        // Determine ID to update
        let idToUpdate = data.id;
        if (!idToUpdate) {
            // Try to find the latest existing record to update
            const existing = await prisma.heroSection.findFirst({
                orderBy: { updatedAt: 'desc' }
            });
            if (existing) {
                idToUpdate = existing.id;
            }
        }

        // Deactivate all other hero sections
        await prisma.heroSection.updateMany({
            where: { active: true },
            data: { active: false },
        });

        // Create or update hero section
        const hero = await prisma.heroSection.upsert({
            where: { id: idToUpdate || 'new' },
            create: {
                titleMain: data.titleMain,
                titleMainEn: data.titleMainEn,
                titleSubtitle1: data.titleSubtitle1,
                titleSubtitle1En: data.titleSubtitle1En,
                titleSubtitle2: data.titleSubtitle2,
                titleSubtitle2En: data.titleSubtitle2En,
                description: data.description,
                descriptionEn: data.descriptionEn,
                primaryCtaText: data.primaryCtaText,
                primaryCtaTextEn: data.primaryCtaTextEn,
                primaryCtaLink: data.primaryCtaLink,
                secondaryCtaText: data.secondaryCtaText,
                secondaryCtaTextEn: data.secondaryCtaTextEn,
                secondaryCtaLink: data.secondaryCtaLink,
                backgroundImageUrl: data.backgroundImageUrl,
                backgroundVideoUrl: data.backgroundVideoUrl,
                showAfisa: data.showAfisa || false,
                afisaUrl: data.afisaUrl,
                afisaImageUrl: data.afisaImageUrl,
                active: true,
            },
            update: {
                titleMain: data.titleMain,
                titleMainEn: data.titleMainEn,
                titleSubtitle1: data.titleSubtitle1,
                titleSubtitle1En: data.titleSubtitle1En,
                titleSubtitle2: data.titleSubtitle2,
                titleSubtitle2En: data.titleSubtitle2En,
                description: data.description,
                descriptionEn: data.descriptionEn,
                primaryCtaText: data.primaryCtaText,
                primaryCtaTextEn: data.primaryCtaTextEn,
                primaryCtaLink: data.primaryCtaLink,
                secondaryCtaText: data.secondaryCtaText,
                secondaryCtaTextEn: data.secondaryCtaTextEn,
                secondaryCtaLink: data.secondaryCtaLink,
                backgroundImageUrl: data.backgroundImageUrl,
                backgroundVideoUrl: data.backgroundVideoUrl,
                showAfisa: data.showAfisa || false,
                afisaUrl: data.afisaUrl,
                afisaImageUrl: data.afisaImageUrl,
                active: true,
            },
        });

        return NextResponse.json(hero);
    } catch (error) {
        console.error('Error updating hero section:', error);
        return NextResponse.json({ error: 'Failed to update hero section' }, { status: 500 });
    }
}
