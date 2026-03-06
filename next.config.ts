import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json', '.otf'],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src")],
  },
};

export default nextConfig;
