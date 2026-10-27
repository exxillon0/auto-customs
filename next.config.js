/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Next.js 14: отключаем бандлинг для нативных модулей
    serverComponentsExternalPackages: [
      "@prisma/client",
      "better-sqlite3",
      "@prisma/adapter-better-sqlite3",
      "bindings",
    ],
  },
  // Если вы обновились до Next.js 15, используйте эту опцию вместо experimental:
  // serverExternalPackages: [
  //   "@prisma/client",
  //   "better-sqlite3",
  //   "@prisma/adapter-better-sqlite3",
  //   "bindings",
  // ],
};

module.exports = nextConfig;