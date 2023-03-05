/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.imgur.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "d17fnq9dkz9hgj.cloudfront.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.akc.org",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
