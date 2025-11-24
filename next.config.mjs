/** @type {import('next').NextConfig} */
// Enable project page path only when env var NEXT_PUBLIC_GITHUB_PAGES=true
const isProjectPage = process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true'
const repoName = 'portfoliobrandonj'

const nextConfig = {
  // Static export suitable for GitHub Pages
  output: 'export',
  trailingSlash: true,
  // If hosting as project page, set basePath and assetPrefix (only for production/CI builds)
  ...(isProjectPage ? { basePath: `/${repoName}`, assetPrefix: `/${repoName}` } : {}),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
