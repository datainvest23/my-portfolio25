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
    dirs: ['src', 'components', 'lib']
  },
  typescript: {
    ignoreBuildErrors: false
  }
};

export default nextConfig; 