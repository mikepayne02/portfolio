import db from '@astrojs/db'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel/serverless'
import expressiveCode from 'astro-expressive-code'
import icon from 'astro-icon'
import lottie from 'astro-integration-lottie'
import pagefind from 'astro-pagefind'
import { defineConfig } from 'astro/config'
import fs from 'fs'
import rehypeExternalLinks from 'rehype-external-links'
import remarkUnwrapImages from 'remark-unwrap-images'
import { expressiveCodeOptions } from './src/site.config'
import { remarkReadingTime } from './src/utils/remark-reading-time'

// https://astro.build/config
export default defineConfig({
	site: 'https://mikepayne.me',
	integrations: [
		expressiveCode(expressiveCodeOptions),
		tailwind({
			applyBaseStyles: false
		}),
		sitemap(),
		lottie(),
		pagefind(),
		mdx(),
		db(),
		icon({
			iconDir: 'src/icons'
		})
	],
	image: {
		domains: ['webmention.io']
	},
	vite: {
		plugins: [rawFonts(['.ttf', '.woff'])],
		optimizeDeps: {
			exclude: ['@resvg/resvg-js']
		}
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
				className: ['']
			}
		}
	},
	prefetch: true,
	output: 'hybrid',
	adapter: vercel({
		webAnalytics: {
			enabled: true
		}
	})
})

function rawFonts(ext: Array<string>) {
	return {
		name: 'vite-plugin-raw-fonts',
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore:next-line
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
