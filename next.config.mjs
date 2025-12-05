/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'devagroupon.onrender.com',
        // port: '5000',
        pathname: '/uploads/**',
      },
      // If you want to be more specific, you can add multiple patterns:
      {
        protocol: 'https',
        hostname: 'devagroupon.onrender.com',
        // port: '5000',
        pathname: '/uploads/brands/**',
      },
      {
        protocol: 'https',
        hostname: 'devagroupon.onrender.com',
        // port: '5000',
        pathname: '/uploads/maincategory/**',
      },
      {
        protocol: 'https',
        hostname: 'devagroupon.onrender.com',
        // port: '5000',
        pathname: '/uploads/categories/**',
      },
      {
        protocol: 'https',
        hostname: 'devagroupon.onrender.com',
        // port: '5000',
        pathname: '/uploads/subcategories/**',
      },
      {
        protocol: 'https',
        hostname: 'devagroupon.onrender.com',
        // port: '5000',
        pathname: '/uploads/products/**',
      },
      {
        protocol: 'https',
        hostname: 'devagroupon.onrender.com',
        port: '5000',
        pathname: '/uploads/aboutbrand/**',
      },
      {
        protocol: 'https',
        hostname: 'devagroupon.onrender.com',
        // port: '5000',
        pathname: '/uploads/blogs/**',
      },
    ],
  },
};



export default nextConfig;
