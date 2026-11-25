import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Every page people can share gets its own title, description and share thumbnail.
// Thumbnails live in public/og/ (1200×630). Social apps need absolute image URLs,
// so set VITE_SITE_URL (e.g. https://castkey.com) before a production build.
const PAGES: Record<string, { path: string; title: string; description: string; image: string; alt: string; noindex?: boolean }> = {
  'index.html': {
    path: '/',
    title: 'Castkey: Get paid for your face',
    description: 'Brands pay creators every month to use their face and voice in AI content. You set the rules and approve every brand. Free to apply.',
    image: 'og-home.jpg',
    alt: 'Castkey. Get paid for your face. Brands request your likeness, you approve every brand, brands pay you every month.',
  },
  'invite/index.html': {
    path: '/invite/',
    title: 'Apply to list your likeness on Castkey',
    description: 'Three quick questions, about two minutes. Free to apply, verified profiles only, and you approve every brand.',
    image: 'og-invite.jpg',
    alt: 'Apply to list your likeness. Free to apply, verified profiles only, you approve every brand, brands pay you monthly.',
  },
  'investors/index.html': {
    path: '/investors/',
    title: 'Castkey · Investor update',
    description: 'Live demand from creators and brands.',
    image: 'og-home.jpg',
    alt: 'Castkey investor update.',
    noindex: true,
  },
  'privacy/index.html': {
    path: '/privacy/',
    title: 'Privacy notice · Castkey',
    description: 'What Castkey collects through its website, why, and your choices.',
    image: 'og-home.jpg',
    alt: 'Castkey privacy notice.',
  },
  'invited/index.html': {
    path: '/invited/',
    title: 'You’re invited to Castkey',
    description: 'A creator invited you to Castkey. Brands pay creators every month to use their face and voice in AI content. You set the rules.',
    image: 'og-invited.jpg',
    alt: 'You’re invited to Castkey. Brands request your likeness, you approve every brand, brands pay you every month.',
  },
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const site = (env.VITE_SITE_URL || env.VITE_CANONICAL_URL || '').replace(/\/+$/, '')
  // Absolute base for share thumbnails only, when the final address is known but links should follow the live host.
  const metaBase = (env.VITE_META_URL || site).replace(/\/+$/, '')
  const single = !!process.env.SINGLE_FILE
  return {
    plugins: [
      react(),
      ...(single ? [viteSingleFile()] : []),
      {
        name: 'share-meta',
        transformIndexHtml(html: string, ctx: { path: string }) {
          const key = ctx.path.replace(/^\//, '') || 'index.html'
          const p = PAGES[key] ?? PAGES['index.html']
          const url = site ? `${site}${p.path}` : ''
          const img = `${metaBase}/og/${p.image}`
          const tags = [
            `<title>${esc(p.title)}</title>`,
            `<meta name="description" content="${esc(p.description)}" />`,
            `<meta property="og:type" content="website" />`,
            `<meta property="og:site_name" content="Castkey" />`,
            `<meta property="og:title" content="${esc(p.title)}" />`,
            `<meta property="og:description" content="${esc(p.description)}" />`,
            `<meta property="og:image" content="${img}" />`,
            `<meta property="og:image:width" content="1200" />`,
            `<meta property="og:image:height" content="630" />`,
            `<meta property="og:image:alt" content="${esc(p.alt)}" />`,
            `<meta name="twitter:card" content="summary_large_image" />`,
            `<meta name="twitter:title" content="${esc(p.title)}" />`,
            `<meta name="twitter:description" content="${esc(p.description)}" />`,
            `<meta name="twitter:image" content="${img}" />`,
            ...(url ? [`<link rel="canonical" href="${url}" />`, `<meta property="og:url" content="${url}" />`] : []),
            ...(p.noindex ? [`<meta name="robots" content="noindex, nofollow" />`] : []),
          ]
          return html.replace('</head>', `    ${tags.join('\n    ')}\n  </head>`)
        },
      },
    ],
    build: single
      ? {}
      : {
          rollupOptions: {
            input: {
              main: resolve(__dirname, 'index.html'),
              invite: resolve(__dirname, 'invite/index.html'),
              invited: resolve(__dirname, 'invited/index.html'),
              investors: resolve(__dirname, 'investors/index.html'),
              privacy: resolve(__dirname, 'privacy/index.html'),
            },
          },
        },
  }
})
