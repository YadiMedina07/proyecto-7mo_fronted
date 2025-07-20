/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },

  poweredByHeader: false,
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, private' },
          {
            key: 'Content-Security-Policy',
            value:
              process.env.NODE_ENV === 'development'
                ? [
                    "default-src 'self' data:;",
                    // añadimos sandbox.paypal.com
                    "connect-src 'self' http://localhost:3000 https://proyecto-7mo-backend.onrender.com http://localhost:4000 https://api.pwnedpasswords.com https://www.google.com https://www.paypal.com https://api.paypal.com https://www.sandbox.paypal.com;",
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.google.com/recaptcha/api2/clr https://www.paypal.com https://www.sandbox.paypal.com;",
                    "style-src 'self' 'unsafe-inline';",
                    "img-src 'self' data: https://res.cloudinary.com https://www.paypal.com https://www.sandbox.paypal.com;",
                    "frame-src 'self' https://www.google.com https://www.gstatic.com https://www.paypal.com https://www.sandbox.paypal.com;",
                  ].join(' ')
                : [
                    "default-src 'self' data:;",
                    "connect-src 'self' https://proyecto-7mo-backend.onrender.com http://localhost:4000 https://api.pwnedpasswords.com https://www.google.com https://www.paypal.com https://api.paypal.com https://www.sandbox.paypal.com;",
                    "script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://www.google.com/recaptcha/api2/clr https://www.paypal.com https://www.sandbox.paypal.com;",
                    "style-src 'self' 'unsafe-inline';",
                    "img-src 'self' data: https://res.cloudinary.com https://www.paypal.com https://www.sandbox.paypal.com;",
                    "frame-src 'self' https://www.google.com https://www.gstatic.com https://www.paypal.com https://www.sandbox.paypal.com;",
                  ].join(' '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
