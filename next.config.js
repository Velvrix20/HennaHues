/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'supabase.co', // Allows all Supabase domains
      'bjulguxvkirbdsrcygfy.supabase.co' // Replace with your actual Supabase URL
    ],
  }
}

module.exports = nextConfig
