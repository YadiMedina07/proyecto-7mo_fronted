/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },

  poweredByHeader: false,
  
  async headers() {
    return [
      {
        source: '/(.*)', // Aplica a todas las rutas
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, private',
          },
          // Comentamos la cabecera CSP para desactivarla temporalmente:
          // {
          //   key: 'Content-Security-Policy',
          //   value:
          //     process.env.NODE_ENV === 'development'
          //       ? "default-src 'self'; connect-src 'self' http://localhost:4000; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://res.cloudinary.com; frame-src https://www.google.com https://www.gstatic.com;"
          //       : "default-src 'self'; connect-src 'self'; script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://res.cloudinary.com; frame-src https://www.google.com https://www.gstatic.com;",
          // },
        ],
      },
    ];
  },
};

export default nextConfig;
