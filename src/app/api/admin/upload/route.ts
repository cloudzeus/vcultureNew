import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { processAndUploadImage, uploadToBunny } from '@/lib/bunny';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const files = formData.getAll('files') as File[];
        const folder = formData.get('folder') as string || 'uploads';
        const type = formData.get('type') as string || 'image';

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 });
        }

        const uploadPromises = files.map(async (file) => {
            const buffer = Buffer.from(await file.arrayBuffer());

            if (type === 'image' && file.type.startsWith('image/')) {
                return processAndUploadImage(buffer, file.name, folder);
            } else {
                // Direct upload for videos or other files (already converted or preserved)
                // For video, we just use uploadToBunny
                return uploadToBunny(buffer, `${Date.now()}-${file.name}`, folder);
            }
        });

        const urls = await Promise.all(uploadPromises);

        return NextResponse.json({ urls });
    } catch (error: any) {
        console.error('Upload API Error:', error);
        return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
    }
}
