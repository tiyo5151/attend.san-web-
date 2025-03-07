const config = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**',
      },
    ],
  },
  // Edge Runtimeで使用する環境変数を明示的に宣言
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
  },
  env: {
    IP_WHITELIST: process.env.IP_WHITELIST,
  },
};

export default config;
