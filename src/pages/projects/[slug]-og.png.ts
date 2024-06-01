import { getAllPosts } from '@/data/project'
import { getFormattedDate, ogImageHeaders } from '@/lib'
import { siteConfig } from '@/site-config'
import { Resvg, initWasm } from '@resvg/resvg-wasm'
import type { APIRoute, GetStaticPaths } from 'astro'
import type { ReactNode } from 'react'
import satori, { type SatoriOptions } from 'satori'
import { html } from 'satori-html'
import firaCodeBold from '/src/assets/fonts/FiraCode-Bold.ttf?arraybuffer'
import firaCodeRegular from '/src/assets/fonts/FiraCode-Regular.ttf?arraybuffer'

await initWasm(fetch('https://unpkg.com/@resvg/resvg-wasm/index_bg.wasm'))

const svgOptions: SatoriOptions = {
	width: 1200,
	height: 630,
	fonts: [
		{
			name: 'Fira Code',
			data: firaCodeRegular,
			weight: 400
		},
		{
			name: 'Fira Code',
			data: firaCodeBold,
			weight: 600
		}
	]
}

const Opengraph = (
	title: string,
	postDate: string,
	tags: string[],
	profileUrl: string,
	coverUrl: string
) => html`
	<div tw="flex flex-col w-full h-full bg-[#18181b] text-[#fcfcfd]">
		<img tw="rounded-full m-12" width="220" height="220" src="${profileUrl}" />
		<img tw="absolute rounded-xl right-5 m-5" height="350" src="${coverUrl}" />
		<div tw="flex flex-col flex-1 w-full px-10 justify-center">
			<p tw="text-2xl mb-4">${postDate}</p>
			<h1 tw="text-6xl font-bold leading-snug text-white">${title}</h1>
		</div>
		<div tw="flex items-center justify-between w-full px-10 py-5 border-t border-[#60a5fa] text-xl">
			<div tw="flex items-center">
				<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 648 648">
					<path
						d="M466.85,205.14c-13.08-13.08-30.46-20.28-48.96-20.28s-35.88,7.2-48.96,20.28l-90.84,90.84-44.24-44.24c-13.08-13.08-30.46-20.28-48.96-20.28s-35.88,7.2-49,20.32l-48.15,48.15c-.26.19-.5.39-.74.63l-67.31,67.31c-2.6,2.6-2.6,6.83,0,9.43,1.3,1.3,3.01,1.95,4.71,1.95s3.41-.65,4.71-1.95l26.05-26.05c25.55-23.09,58.13-24.01,80.55-1.79l39.83,39.83-65.96,65.96c-2.6,2.6-2.6,6.83,0,9.43,1.3,1.3,3.01,1.95,4.71,1.95s3.41-.65,4.71-1.95l65.96-65.96,44.16,44.16c13.08,13.07,30.46,20.28,48.95,20.28s35.88-7.2,48.95-20.28l90.85-90.85,90.84,90.84c13.08,13.08,30.46,20.28,48.96,20.28s35.88-7.2,48.96-20.28c13.08-13.08,20.28-30.47,20.28-48.96s-7.2-35.88-20.28-48.96l-139.8-139.8ZM282.87,300.76c11.5-10.36,26.22-16.03,41.82-16.03,16.71,0,32.43,6.51,44.24,18.32l44.18,44.18c-11.5,10.36-26.23,16.03-41.82,16.03-16.71,0-32.43-6.51-44.24-18.33l-44.18-44.18Z"
						fill="#fcfcfd"
						stroke-width="0"
					/>
				</svg>
			</div>
			<p># ${tags.join(', ')}</p>
			<div tw="flex items-center">
				<p tw="mr-4">by</p>
				<p tw="text-2xl font-bold">${siteConfig.author}</p>
			</div>
		</div>
	</div>
`

export const GET: APIRoute = async ({ props }) => {
	const { title, pubDate, tags, ogImage } = props

	const baseUrl = siteConfig.bucketEndpoint

	const coverUrl = `${baseUrl}/og/${ogImage}`
	const profileUrl = `${baseUrl}/profile.jpg`

	const postDate = getFormattedDate(pubDate, {
		weekday: 'long',
		month: 'long'
	})

	const component = Opengraph(title, postDate, tags, profileUrl, coverUrl)
	const svg = await satori(component as ReactNode, svgOptions)
	return new Response(new Resvg(svg).render().asPng(), ogImageHeaders)
}

export const getStaticPaths = (async () => {
	const posts = await getAllPosts()
	return posts
		.filter(({ data }) => !data.ogManual)
		.map((post) => ({
			params: { slug: post.slug },
			props: {
				title: post.data.title,
				tags: post.data.tags,
				pubDate: post.data.updatedDate ?? post.data.publishDate,
				ogImage: post.data.ogImage
			}
		}))
}) satisfies GetStaticPaths
