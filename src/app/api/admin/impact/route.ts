import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    try {
        const impact = await prisma.impactSection.findFirst({
            where: { active: true },
            include: { stats: true },
        });
        return NextResponse.json(impact);
    } catch (error) {
        console.error('Error fetching impact section:', error);
        return NextResponse.json({ error: 'Failed to fetch impact section' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await request.json();

        // Deactivate all other impact sections
        await prisma.impactSection.updateMany({
            where: { active: true },
            data: { active: false },
        });

        const impact = await prisma.impactSection.upsert({
            where: { id: data.id || 'new' },
            create: {
                id: data.id || undefined,
                heading: data.heading,
                headingEn: data.headingEn,
                description: data.description,
                descriptionEn: data.descriptionEn,
                backgroundImageUrl: data.backgroundImageUrl,
                active: true,
                stats: {
                    create: data.stats?.map((s: any) => ({
                        value: parseInt(s.value) || 0,
                        suffix: s.suffix,
                        suffixEn: s.suffixEn,
                        label: s.label,
                        labelEn: s.labelEn,
                        order: s.order || 0
                    }))
                }
            },
            update: {
                heading: data.heading,
                headingEn: data.headingEn,
                description: data.description,
                descriptionEn: data.descriptionEn,
                backgroundImageUrl: data.backgroundImageUrl,
                active: true,
                stats: {
                    deleteMany: {},
                    create: data.stats?.map((s: any) => ({
                        value: parseInt(s.value) || 0,
                        suffix: s.suffix,
                        suffixEn: s.suffixEn,
                        label: s.label,
                        labelEn: s.labelEn,
                        order: s.order || 0
                    }))
                }
            },
            include: {
                stats: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        return NextResponse.json(impact);
    } catch (error) {
        console.error('Error updating impact section:', error);
        return NextResponse.json({ error: 'Failed to update impact section' }, { status: 500 });
    }
}
