import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Performance Optimizations (Next.js 16) ────────────────────
  poweredByHeader: false,

  // Cache fetch responses trong Server Components qua HMR refreshes
  // → giảm cả RAM lẫn API calls khi hot-reload
  experimental: {
    serverComponentsHmrCache: true,
    // optimizePackageImports được Turbopack tự phân tích,
    // cần cho webpack fallback
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'react-icons',
    ],
  },

  // Webpack fallback (chỉ dùng khi chạy `npm run dev:safe` với --webpack)
  webpack(config, { dev }) {
    if (dev) {
      config.watchOptions = {
        poll: false,           // KHÔNG dùng polling, dùng native FS events
        aggregateTimeout: 300, // Debounce 300ms trước khi rebuild
        ignored: [
          '**/node_modules/**',
          '**/.next/**',
          '**/.git/**',
        ],
      };
    }
    return config;
  },
};

export default nextConfig;
