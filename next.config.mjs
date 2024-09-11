/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
        return [
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'conciergerielocationcourte.fr',
                    },
                ],
                destination: '/fr/:path*',
            },
            {
                source: '/fr/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'conciergerielocationcourte.fr',
                    },
                ],
                destination: '/fr/:path*',
            },
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'https://find-concierge.vercel.app/',
                    },
                ],
                destination: '/en/:path*',
            },
        ];
    },
};

export default nextConfig;