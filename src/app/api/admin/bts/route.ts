import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    try {
        const bts = await prisma.bTSSection.findFirst({
            where: { active: true },
            include: { cards: { orderBy: { order: 'asc' } } },
        });
        return NextResponse.json(bts);
    } catch (error) {
        console.error('Error fetching BTS section:', error);
        return NextResponse.json({ error: 'Failed to fetch BTS section' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await request.json();

        await prisma.bTSSection.updateMany({
            where: { active: true },
            data: { active: false },
        });

        const bts = await prisma.bTSSection.upsert({
            where: { id: data.id || 'new' },
            create: {
                id: data.id || undefined,
                title: data.title,
                titleEn: data.titleEn,
                description: data.description,
                descriptionEn: data.descriptionEn,
                active: true,
                cards: {
                    create: data.cards?.map((c: any) => ({
                        label: c.label,
                        labelEn: c.labelEn,
                        imageUrl: c.imageUrl,
                        order: c.order || 0
                    }))
                }
            },
            update: {
                title: data.title,
                titleEn: data.titleEn,
                description: data.description,
                descriptionEn: data.descriptionEn,
                active: true,
                cards: {
                    deleteMany: {},
                    create: data.cards?.map((c: any) => ({
                        label: c.label,
                        labelEn: c.labelEn,
                        imageUrl: c.imageUrl,
                        order: c.order || 0
                    }))
                }
            },
            include: {
                cards: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        return NextResponse.json(bts);
    } catch (error) {
        console.error('Error updating BTS section:', error);
        return NextResponse.json({ error: 'Failed to update BTS section' }, { status: 500 });
    }
}
