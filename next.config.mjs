/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'iili.io',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'i.postimg.cc',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
