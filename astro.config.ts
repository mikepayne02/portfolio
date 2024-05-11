import cloudflare from '@astrojs/cloudflare'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import expressiveCode from 'astro-expressive-code'
import icon from 'astro-icon'
import pagefind from 'astro-pagefind'
import { defineConfig } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'
import remarkUnwrapImages from 'remark-unwrap-images'
import arraybuffer from 'vite-plugin-arraybuffer'
import { remarkReadingTime } from './src/lib/remark-reading-time'
import { expressiveCodeOptions } from './src/site.config'

// https://astro.build/config
export default defineConfig({
	site: 'https://mikepayne.me',
	integrations: [
		expressiveCode(expressiveCodeOptions),
		sitemap(),
		pagefind(),
		mdx(),
		icon(),
		react(),
		tailwind({ applyBaseStyles: false })
	],
	vite: {
		// @ts-ignore
		plugins: [arraybuffer()]
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
	adapter: cloudflare({
		wasmModuleImports: true,
		imageService: 'compile',
		platformProxy: {
			enabled: true
		}
	})
})
