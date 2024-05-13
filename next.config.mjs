/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['plus.unsplash.com', 'images.unsplash.com', 'imagedelivery.net'],
  },
  redirects: async () => {
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
