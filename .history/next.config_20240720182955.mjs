const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: true,
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/dashboard",
  //       permanent: true, // 如果是永久重定向，可以设置为 true
  //     },
  //   ];
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
      },
      {
        protocol: "http",
        hostname: "**",
        port: "",
      },
    ],
  },
  // async headers() {
  //   return [
  //     {
  //       source: "/:path*",
  //       headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
  //     },
  //   ];
  // },
};

export default nextConfig;
