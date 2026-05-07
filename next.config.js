/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: ["lh3.googleusercontent.com", "avatars.githubusercontent.com"] },
  experimental: { optimizePackageImports: ["lucide-react"] },
};
module.exports = nextConfig;
