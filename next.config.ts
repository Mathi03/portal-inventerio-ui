import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@telefonica/mistica"],
  },
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_URL}/api/:path*`,
        basePath: false,
      },
      {
        source: "/ms-direcciones/:path*",
        destination: `${process.env.API_URL_MS_DIRECCIONES}/:path*`,
        basePath: false,
      },
      {
        source: "/estaciones/:path*",
        destination: `${process.env.API_URL_ESTACIONES}/api/:path*`,
        basePath: false,
      },
      {
        source: "/cnr/:path*",
        destination: `${process.env.API_URL_CNR}/api/:path*`,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
