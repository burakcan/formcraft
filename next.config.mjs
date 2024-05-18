/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ['plus.unsplash.com', 'images.unsplash.com', 'imagedelivery.net'],
  },
  redirects: async () => {
    if (process.env.NODE_ENV === 'development') {
      return [];
    }

    return [
      {
        source: '/',
        destination: '/forms/VeUBRB2twi',
        permanent: false,
      },
    ];
  }
};

export default nextConfig;
