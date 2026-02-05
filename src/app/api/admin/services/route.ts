import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    try {
        const section = await prisma.servicesSection.findFirst({
            include: { services: { orderBy: { order: 'asc' } } }
        });
        return NextResponse.json(section);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch services section' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await req.json();
        const { headline, headlineEn, description, descriptionEn, backgroundImageUrl, services, active } = data;

        const section = await prisma.servicesSection.upsert({
            where: { id: data.id || 'default-services' },
            update: {
                headline,
                headlineEn,
                description,
                descriptionEn,
                backgroundImageUrl,
                active,
                services: {
                    deleteMany: {},
                    create: services.map((s: any, index: number) => ({
                        iconName: s.iconName,
                        title: s.title,
                        titleEn: s.titleEn,
                        description: s.description,
                        descriptionEn: s.descriptionEn,
                        bullets: s.bullets,
                        bulletsEn: s.bulletsEn,
                        order: index
                    }))
                }
            },
            create: {
                id: 'default-services',
                headline,
                headlineEn,
                description,
                descriptionEn,
                backgroundImageUrl,
                active,
                services: {
                    create: services.map((s: any, index: number) => ({
                        iconName: s.iconName,
                        title: s.title,
                        titleEn: s.titleEn,
                        description: s.description,
                        descriptionEn: s.descriptionEn,
                        bullets: s.bullets,
                        bulletsEn: s.bulletsEn,
                        order: index
                    }))
                }
            },
            include: {
                services: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        return NextResponse.json(section);
    } catch (error) {
        console.error('Error saving services section:', error);
        return NextResponse.json({ error: 'Failed to save services section' }, { status: 500 });
    }
}
