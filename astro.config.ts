import cloudflare from '@astrojs/cloudflare'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import Icons from 'unplugin-icons/vite'
import pagefind from 'astro-pagefind'
import { defineConfig, envField } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'
import remarkUnwrapImages from 'remark-unwrap-images'
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
    plugins: [
      Icons({
        compiler: 'astro'
      })
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
    contentIntellisense: true,
    serverIslands: true,
    env: {
      schema: {
        AUTHOR_BIRTHDAY: envField.string({
          context: 'server',
          access: 'secret'
        }),
        AUTHOR_EMAIL: envField.string({ context: 'server', access: 'public' }),
        MAPTILER_API_KEY: envField.string({
          context: 'client',
          access: 'public'
        }),
        TURNSTILE_SITE_KEY: envField.string({
          context: 'client',
          access: 'public'
        }),
        TURNSTILE_SECRET: envField.string({
          context: 'server',
          access: 'secret'
        }),
        RESEND_API_KEY: envField.string({
          context: 'server',
          access: 'secret'
        }),
        WEBMENTION_API_KEY: envField.string({
          context: 'server',
          access: 'secret'
        })
      }
    }
  },
  adapter: cloudflare({
    imageService: 'compile',
    platformProxy: {
      enabled: true
    }
  })
})
