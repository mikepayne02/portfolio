import fs from 'fs'
import cloudflare from '@astrojs/cloudflare'
import mdx from '@astrojs/mdx'
import million from 'million/compiler'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import expressiveCode from 'astro-expressive-code'
import icon from 'astro-icon'
import pagefind from 'astro-pagefind'
import { defineConfig } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'
import remarkUnwrapImages from 'remark-unwrap-images'
import { expressiveCodeOptions } from './src/site.config'
import { remarkReadingTime } from './src/lib/remark-reading-time'

import react from '@astrojs/react'

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
		icon(),
		react()
	],
	vite: {
		plugins: [
			rawFonts(['.ttf', '.otf', '.woff']),
			million.vite({
				mode: 'react',
				server: true,
				auto: true
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
	adapter: cloudflare({
		wasmModuleImports: true,
		platformProxy: { enabled: true },
		imageService: 'compile'
	})
})

function rawFonts(ext) {
	return {
		name: 'vite-plugin-raw-fonts',
		transform(_, id) {
			if (ext.some((e) => id.endsWith(e))) {
				const buffer = fs.readFileSync(id)
				return {
					code: `export default ${JSON.stringify(buffer)}`,
					map: null
				}
			}
		}
	}
}
