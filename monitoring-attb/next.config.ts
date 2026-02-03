import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Ini adalah domain project Supabase Anda (ambil dari error log tadi)
        hostname: "gxprnbsrrxkwfrgihenv.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
