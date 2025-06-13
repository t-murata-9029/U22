import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'iikilfcwickwsjpfmsox.supabase.co',
        port: '',
        // ▼▼▼ 修正: バケット名を含めて、より正確なパスに修正 ▼▼▼
        pathname: '/storage/v1/object/public/image-bucket/**',
      },
    ],
  },
  
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    config.resolve.alias["~"] = path.join(__dirname, "src");
    return config;
  },
};

export default nextConfig;