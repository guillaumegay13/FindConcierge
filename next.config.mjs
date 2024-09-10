/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
        return [
            {
                source: '/search',
                destination: '/fr/search',
                has: [
                    {
                        type: 'host',
                        value: 'conciergerielocationcourte.fr',
                    },
                ],
            },
            {
                source: '/register',
                destination: '/fr/register',
                has: [
                    {
                        type: 'host',
                        value: 'conciergerielocationcourte.fr',
                    },
                ],
            },
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