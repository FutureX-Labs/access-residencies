/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'access-residencies.futrxlabs.com',
                port: '',
                pathname: '**',
            },
        ],
        minimumCacheTTL: 1,
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store',
                    },
                ],
            },
        ]
    },
};

export default nextConfig;
