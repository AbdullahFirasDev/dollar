// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-09-01',
  devtools: { enabled: false },

  modules: ['@nuxtjs/tailwindcss', '@vite-pwa/nuxt'],

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  nitro: {
    preset: 'vercel'
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ar', dir: 'rtl' },
      title: 'الدولار العراقي | USD → IQD مباشر',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'الدولار العراقي — أسعار صرف الدولار الأمريكي مقابل الدينار العراقي في بغداد وأربيل والبصرة — تحديث لحظي مباشر.',
        },
        { name: 'theme-color', content: '#0C6FFF' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
    // Service worker claims clients immediately so new caches activate on first reload
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  runtimeConfig: {
    public: {
      supabaseUrl: '',
      supabaseAnonKey: '',
    },
    // Server-only (set via NUXT_IQWEALTH_API_KEY / NUXT_SUPABASE_SERVICE_KEY in .env)
    iqwealthApiKey: '',                          // IQWealth / IraqSM key (iqw_...)
    iqwealthBaseUrl: 'https://iraqsm.com/api/sheet',
    supabaseServiceKey: '',                      // service-role key: server sync upserts bypass RLS
  },

  pwa: {
    // Aggressive cache-busting: every deploy gets a brand-new SW that
    // immediately claims clients and purges old caches.
    strategies: 'generateSW',
    registerType: 'autoUpdate',
    injectRegister: 'auto',
    manifest: {
      name: 'الدولار العراقي',
      short_name: 'الدولار العراقي',
      description: 'الدولار العراقي — أسعار صرف الدولار مقابل الدينار العراقي — تحديث لحظي',
      lang: 'ar',
      dir: 'rtl',
      theme_color: '#0C6FFF',
      background_color: '#0f172a',
      display: 'standalone',
      start_url: '/',
      icons: [
        { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
    },
    workbox: {
      cleanupOutdatedCaches: true, // deletes old versioned caches on activate
      clientsClaim: true,          // SW takes control of open tabs immediately
      skipWaiting: true,           // new SW activates without waiting for old one
      navigateFallback: '/',
      navigateFallbackDenylist: [/^\/admin/],
      runtimeCaching: [
        {
          urlPattern: ({ url }) =>
            url.hostname.endsWith('.supabase.co') && url.pathname.startsWith('/rest/v1'),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'supabase-rest',
            networkTimeoutSeconds: 5,
            expiration: { maxEntries: 32, maxAgeSeconds: 300 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          // Supabase Realtime uses WebSocket -> never cache
          urlPattern: /\/realtime\/v1\//,
          handler: 'NetworkOnly',
        },
        {
          // Supabase Auth endpoints -> never cache
          urlPattern: /\/auth\/v1\//,
          handler: 'NetworkOnly',
        },
      ],
    },
  },
})
