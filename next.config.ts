import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Pastikan fallback berada di dalam resolve
      config.resolve.fallback = {
        ...config.resolve.fallback,
        aws4: false,
        "mongodb-client-encryption": false,
        kerberos: false,
        "@mongodb-js/zstd": false,
        snappy: false,
        "@aws-sdk/credential-providers": false,
      };
    }
    return config;
  },
};

export default nextConfig;
