export const prerender = true

import type { APIContext, InferGetStaticPropsType } from 'astro'
import satori, { type SatoriOptions } from 'satori'
import { html } from 'satori-html'
import { Resvg } from '@resvg/resvg-js'
import { siteConfig } from '@/site-config'
import { getFormattedDate } from '@/utils'
import { getAllPosts } from '@/data/project'

import FiraCode from '@/assets/FiraCode-Regular.ttf'
import FiraCodeBold from '@/assets/FiraCode-Bold.ttf'

const ogOptions: SatoriOptions = {
	width: 1200,
	height: 630,
	// debug: true,
	fonts: [
		{
			name: 'Fira Code',
			data: Buffer.from(FiraCode),
			weight: 400,
			style: 'normal'
		},
		{
			name: 'Fira Code',
			data: Buffer.from(FiraCodeBold),
			weight: 700,
			style: 'normal'
		}
	]
}

const markup = (title: string, pubDate: string) =>
	html`<div tw="flex flex-col w-full h-full bg-[#1d1f21] text-[#c9cacc]">
		<div tw="flex flex-col flex-1 w-full p-10 justify-center">
			<p tw="text-2xl mb-6">${pubDate}</p>
			<h1 tw="text-6xl font-bold leading-snug text-white">${title}</h1>
		</div>
		<div tw="flex items-center justify-between w-full p-10 border-t border-[#60a5fa] text-xl">
			<div tw="flex items-center">
				<svg xmlns="http://www.w3.org/2000/svg" height="60" viewBox="0 0 648 648">
					<path
						d="M604.29,440.43c-25.74,25.74-67.46,25.74-93.2,0h0s-139.8-139.8-139.8-139.8c-12.87-12.87-29.73-19.3-46.6-19.3s-33.73,6.43-46.6,19.3l93.2-93.2c12.87-12.87,29.73-19.3,46.6-19.3s33.73,6.43,46.6,19.3l139.8,139.8h0c25.74,25.74,25.74,67.46,0,93.2h0Z"
						fill="#fff"
						stroke-width="0"
					/>
					<path
						d="M45.08,347.23l17.57-17.57,75.59-75.59.04-.04c25.74-25.74,67.46-25.74,93.2,0h0s46.6,46.6,46.6,46.6l46.6,46.6h0c25.74,25.74,67.46,25.74,93.2,0h.01s-93.22,93.21-93.22,93.21h0c-25.73,25.73-67.45,25.73-93.18,0h0s-46.61-46.61-46.61-46.61l-46.6-46.6h0c-25.74-25.74-62.89-21.17-88.63,4.57l-4.57-4.57Z"
						fill="#fff"
						stroke-width="0"
					/>
					<line
						x1="24.41"
						y1="372.51"
						x2="91.71"
						y2="305.2"
						fill="#000"
						stroke="#fff"
						stroke-miterlimit="10"
						stroke-width="6.67"
					/>
					<line
						x1="114.3"
						y1="459.88"
						x2="226.95"
						y2="347.23"
						fill="#000"
						stroke="#fff"
						stroke-miterlimit="10"
						stroke-width="5.83"
					/>
				</svg>
				<p tw="ml-3 font-semibold">${siteConfig.title}</p>
			</div>
			<p>by ${siteConfig.author}</p>
		</div>
	</div>`

type Props = InferGetStaticPropsType<typeof getStaticPaths>

export async function GET(context: APIContext) {
	const { title, pubDate } = context.props as Props

	const postDate = getFormattedDate(pubDate, {
		weekday: 'long',
		month: 'long'
	})
	const svg = await satori(markup(title, postDate), ogOptions)
	const png = new Resvg(svg).render().asPng()
	return new Response(png, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	})
}

export async function getStaticPaths() {
	const posts = await getAllPosts()
	return posts
		.filter(({ data }) => !data.ogImage)
		.map((post) => ({
			params: { slug: post.slug },
			props: {
				title: post.data.title,
				pubDate: post.data.updatedDate ?? post.data.publishDate
			}
		}))
}
