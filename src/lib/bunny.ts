import sharp from 'sharp';

const BUNNY_STORAGE_API_HOST = 'storage.bunnycdn.com';
const STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE || 'vculture';
const ACCESS_KEY = process.env.BUNNY_ACCESS_KEY;
const CDN_URL = process.env.BUNNY_STORAGE_URL || 'https://vculture.b-cdn.net';

export async function uploadToBunny(
    file: Buffer,
    fileName: string,
    folder: string = 'uploads'
): Promise<string> {
    if (!ACCESS_KEY) {
        throw new Error('BUNNY_ACCESS_KEY is not defined');
    }

    const url = `https://${BUNNY_STORAGE_API_HOST}/${STORAGE_ZONE_NAME}/${folder}/${fileName}`;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            AccessKey: ACCESS_KEY,
            'Content-Type': 'application/octet-stream',
        },
        body: file as any,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Bunny CDN upload failed: ${errorText}`);
    }

    return `${CDN_URL}/${folder}/${fileName}`;
}

export async function processAndUploadImage(
    file: Buffer,
    originalName: string,
    folder: string = 'images'
): Promise<string> {
    // Convert to WebP and optimize
    const optimizedBuffer = await sharp(file)
        .webp({ quality: 80 })
        .toBuffer();

    const fileName = `${Date.now()}-${originalName.split('.')[0]}.webp`;

    return uploadToBunny(optimizedBuffer, fileName, folder);
}

export async function uploadVideo(
    file: Buffer,
    originalName: string,
    folder: string = 'videos'
): Promise<string> {
    const fileName = `${Date.now()}-${originalName}`;
    return uploadToBunny(file, fileName, folder);
}
