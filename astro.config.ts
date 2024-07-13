import cloudflare from '@astrojs/cloudflare'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import Icons from 'unplugin-icons/vite'
import pagefind from 'astro-pagefind'
import { defineConfig, envField } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'
import remarkUnwrapImages from 'remark-unwrap-images'
import arraybuffer from 'vite-plugin-arraybuffer'
import { remarkReadingTime } from './src/utils/remark-reading-time'
import { og } from './src/utils/opengraph'

// https://astro.build/config
export default defineConfig({
  site: 'https://www.mikepayne.me',
  integrations: [
    sitemap(),
    pagefind(),
    mdx(),
    tailwind({
      applyBaseStyles: false
    }),
    og()
  ],
  vite: {
    ssr: {
      external: ['node:async_hooks']
    },
    plugins: [
      Icons({
        compiler: 'astro'
      }),
      arraybuffer()
    ]
  },
  image: {
    domains: ['webmention.io']
  },
  markdown: {
    remarkPlugins: [remarkUnwrapImages, remarkReadingTime],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['nofollow, noopener, noreferrer']
        }
      ]
    ],
    remarkRehype: {
      footnoteLabelProperties: {
        className: ['underline']
      }
    }
  },
  prefetch: true,
  output: 'hybrid',
  experimental: {
    actions: true,
    contentCollectionCache: true,
    serverIslands: true,
  },
  adapter: cloudflare({
    imageService: 'compile',
    platformProxy: {
      enabled: true
    }
  })
})
