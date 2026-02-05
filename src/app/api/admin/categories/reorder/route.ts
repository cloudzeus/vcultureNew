import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PATCH(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { orders } = await request.json(); // Array of { id: string, order: number }

        if (!Array.isArray(orders)) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        // Use a transaction for bulk update
        await prisma.$transaction(
            orders.map((item) =>
                prisma.category.update({
                    where: { id: item.id },
                    data: { order: item.order },
                })
            )
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error reordering categories:', error);
        return NextResponse.json({ error: 'Failed to reorder categories' }, { status: 500 });
    }
}
