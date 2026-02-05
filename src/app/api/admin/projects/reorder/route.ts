import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PATCH(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { orders } = await request.json(); // Array of { id: string, projectOrder: number }

        if (!Array.isArray(orders)) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        // Use a transaction for bulk update
        await prisma.$transaction(
            orders.map((item) =>
                prisma.project.update({
                    where: { id: item.id },
                    data: { projectOrder: item.projectOrder },
                })
            )
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error reordering projects:', error);
        return NextResponse.json({ error: 'Failed to reorder projects' }, { status: 500 });
    }
}
