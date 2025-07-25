import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@telefonica/mistica"],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.API_URL,
    NEXT_PUBLIC_API_URL_MS_DIRECCIONES: process.env.API_URL_MS_DIRECCIONES,
    NEXT_PUBLIC_API_URL_ESTACIONES: process.env.API_URL_ESTACIONES,
    NEXT_PUBLIC_API_URL_CONTACTO: process.env.API_URL_CONTACTO,
    NEXT_PUBLIC_API_URL_CNR: process.env.API_URL_CNR,
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
