/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "image.bosa.mn",
      "img.mvideo.ru",
      "www.denim600.com",
      "m.media-amazon.com",
    ],
  },
};

module.exports = nextConfig;
