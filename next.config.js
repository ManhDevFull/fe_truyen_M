const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /\/api\/chapter\/\d+$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "chapter-api",
        expiration: {
          maxEntries: 5,
          maxAgeSeconds: 24 * 60 * 60
        }
      }
    },
    {
      urlPattern: /\/comics\/.*\.(?:webp|avif|jpg|jpeg|png)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "chapter-images",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 7 * 24 * 60 * 60
        }
      }
    }
  ]
});

module.exports = withPWA({
  reactStrictMode: true
});
