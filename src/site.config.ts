import type { SiteConfig, SocialItem } from '@/types'
import type { AstroExpressiveCodeOptions } from 'astro-expressive-code'

export const siteConfig: SiteConfig = {
	// Used as both a meta property (src/components/BaseHead.astro L:31 + L:49) & the generated satori png (src/pages/og-image/[slug].png.ts)
	author: 'Michael Payne',
	// Meta property used to construct the meta title property, found in src/components/BaseHead.astro L:11
	title: 'Michael Payne',
	contactEmail: 'michael@mail.mikepayne.me',
	// Meta property used as the default description meta property
	description: "Michael Payne's Portfolio",
	// HTML lang property, found in src/layouts/Base.astro L:18
	lang: 'en-US',
	// Meta property, found in src/components/BaseHead.astro L:42
	ogLocale: 'en_US',
	// Date.prototype.toLocaleDateString() parameters, found in src/utils/date.ts.
	date: {
		locale: 'en-US',
		options: {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		}
	},
	bucketName: 'payne-portfolio',
	bucketEndpoint: 'https://f004.backblazeb2.com',
	webmentions: {
		// Webmention.io API endpoint. Get your own here: https://webmention.io/, and follow this blog post: https://astro-cactus.chriswilliams.dev/posts/webmentions/
		link: 'https://webmention.io/mikepayne.me/webmention'
	}
}

export const menuLinks: Array<{ title: string; path: string }> = [
	{
		title: 'Projects',
		path: '/projects/'
	},
	{
		title: 'Tools',
		path: '/tools/'
	}
]

export const socialLinks: Array<SocialItem> = [
	{
		label: 'Snapchat',
		href: 'https://snapchat.com/t/uMm9JFth',
		icon: 'fa6-brands:snapchat'
	},
	{
		label: 'Instagram',
		href: 'https://www.instagram.com/michaelpayne02/',
		icon: 'fa6-brands:instagram'
	},
	{
		label: 'Github',
		href: 'https://github.com/michaelpayne02',
		icon: 'fa6-brands:github'
	},
	{
		label: 'LinkedIn',
		href: 'https://www.linkedin.com/in/michaelpayne02/',
		icon: 'fa6-brands:linkedin'
	},
	{
		label: 'Ethereum',
		href: 'https://etherscan.io/address/0x964D98dfa07549cB7571a4D6A161D825d76f9070',
		icon: 'ri:eth-fill'
	},
	{
		label: 'Email',
		href: 'mailto:michael@payne.cx',
		icon: 'heroicons:envelope'
	}
]

// https://expressive-code.com/reference/configuration/
export const expressiveCodeOptions: AstroExpressiveCodeOptions = {
	// One dark, one light theme => https://expressive-code.com/guides/themes/#available-themes
	themes: ['github-dark', 'github-light'],
	themeCssSelector(theme, { styleVariants }) {
		// If one dark and one light theme are available
		// generate theme CSS selectors compatible with cactus-theme dark mode switch
		if (styleVariants.length >= 2) {
			const baseTheme = styleVariants[0]?.theme
			const altTheme = styleVariants.find((v) => v.theme.type !== baseTheme?.type)?.theme
			if (theme === baseTheme || theme === altTheme) return `[data-theme='${theme.type}']`
		}
		// return default selector
		return `[data-theme="${theme.name}"]`
	},
	useThemedScrollbars: false,
	styleOverrides: {
		frames: {
			frameBoxShadowCssValue: 'none'
		},
		uiLineHeight: 'inherit',
		codeFontSize: '0.875rem',
		codeLineHeight: '1.7142857rem',
		borderRadius: '4px',
		codePaddingInline: '1rem',
		codeFontFamily:
			'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;'
	}
}
