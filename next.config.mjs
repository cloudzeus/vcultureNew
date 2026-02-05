/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'vculture.b-cdn.net' },
            { protocol: 'https', hostname: 'cdn.bunny.net' },
            { protocol: 'https', hostname: 'storage.bunnycdn.com' },
        ],
    },
};

export default nextConfig;

