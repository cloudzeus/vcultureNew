import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    try {
        const process = await prisma.processSection.findFirst({
            where: { active: true },
        });
        return NextResponse.json(process);
    } catch (error) {
        console.error('Error fetching process section:', error);
        return NextResponse.json({ error: 'Failed to fetch process section' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await request.json();

        await prisma.processSection.updateMany({
            where: { active: true },
            data: { active: false },
        });

        const process = await prisma.processSection.upsert({
            where: { id: data.id || 'new' },
            create: {
                id: data.id || undefined,
                headline: data.headline,
                headlineEn: data.headlineEn,
                description: data.description,
                descriptionEn: data.descriptionEn,
                backgroundImageUrl: data.backgroundImageUrl,
                active: true,
            },
            update: {
                headline: data.headline,
                headlineEn: data.headlineEn,
                description: data.description,
                descriptionEn: data.descriptionEn,
                backgroundImageUrl: data.backgroundImageUrl,
                active: true,
            },
        });

        return NextResponse.json(process);
    } catch (error) {
        console.error('Error updating process section:', error);
        return NextResponse.json({ error: 'Failed to update process section' }, { status: 500 });
    }
}
