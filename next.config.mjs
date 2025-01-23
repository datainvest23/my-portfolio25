/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com', 
      'www.notion.so',
      'prod-files-secure.s3.us-west-2.amazonaws.com'
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['pages', 'components', 'lib', 'src']
  },
  typescript: {
    ignoreBuildErrors: false
  }
};

export default nextConfig; 