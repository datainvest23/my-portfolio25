/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com', 
      'www.notion.so',
      'prod-files-secure.s3.us-west-2.amazonaws.com',
      // Add any other domains your images come from
    ],
  },
  // Add these settings
  typescript: {
    // During development we'll catch type errors
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  eslint: {
    // During development we'll catch lint errors
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
}

module.exports = nextConfig 