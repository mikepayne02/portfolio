import cloudflare from '@astrojs/cloudflare'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import expressiveCode from 'astro-expressive-code'
import pagefind from 'astro-pagefind'
import { defineConfig } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'
import remarkUnwrapImages from 'remark-unwrap-images'
import { expressiveCodeOptions } from './src/site.config'
import { remarkReadingTime } from './src/lib/remark-reading-time'
import arraybuffer from 'vite-plugin-arraybuffer'
import icon from 'astro-icon'

// https://astro.build/config
export default defineConfig({
	site: 'https://mikepayne.me',
	integrations: [
		expressiveCode(expressiveCodeOptions),
		tailwind({
			applyBaseStyles: false
		}),
		sitemap(),
		pagefind(),
		mdx(),
		icon()
	],
	vite: {
		plugins: [arraybuffer()],
		build: {
			minify: false
		}
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
		platformProxy: { enabled: true }
	})
})
