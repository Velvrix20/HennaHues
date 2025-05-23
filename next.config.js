/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '') || '',
        pathname: '/storage/v1/object/public/hennastore/images/**',
        port: ''
      }
    ],
    // Security headers for images
    dangerouslyAllowSVG: false, // Disable if not using SVG
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Optimization settings
    minimumCacheTTL: 60, // 60 seconds cache
    formats: ['image/webp'], // Force WebP for better performance
  },
  // Security headers (recommended)
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload'
        }
      ],
    },
  ],
}

module.exports = nextConfig
