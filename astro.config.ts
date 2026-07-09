import { defineConfig, fontProviders } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'

export default defineConfig({
  site: 'https://cry.is-a.dev',
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  server: { port: 3000 },
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      weights: ['400', '500', '700'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-sans',
      weights: ['300', '400', '500', '600', '700', '800', '900'],
    },
  ],
})
