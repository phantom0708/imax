/** @type {import('next').NextConfig} */
const nextConfig = {
  //reactStrictMode: false, // React Strict Mode is off
  //output: 'export',
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
      },
      typescript: {
        // Tắt typescript-checking trong quá trình build
        ignoreBuildErrors: true,
      },
      //xuat file tinh
      //useFileSystemPublicRoutes: false,
}

module.exports = nextConfig
