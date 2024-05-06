import type { WebmentionsCache, WebmentionsChildren, WebmentionsFeed } from '@/types'
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
const bucketName = import.meta.env.BUCKET_NAME

const DOMAIN = import.meta.env.SITE
const API_TOKEN = import.meta.env.WEBMENTION_API_KEY
const cachePath = 'webmentions.json'
const validWebmentionTypes = ['like-of', 'mention-of', 'in-reply-to']

const hostName = new URL(DOMAIN).hostname

const s3 = new S3Client({
	endpoint: import.meta.env.BUCKET_ENDPOINT,
	region: import.meta.env.BUCKET_REGION,
	credentials: {
		accessKeyId: import.meta.env.BUCKET_KEY_ID,
		secretAccessKey: import.meta.env.BUCKET_SECRET
	}
})
// Calls webmention.io api.
async function fetchWebmentions(timeFrom: string | null, perPage = 1000) {
	if (!DOMAIN) {
		console.warn('No domain specified. Please set in astro.config.ts')
		return null
	}

	if (!API_TOKEN) {
		console.warn('No webmention api token specified in .env')
		return null
	}

	let url = `https://webmention.io/api/mentions.jf2?domain=${hostName}&token=${API_TOKEN}&sort-dir=up&per-page=${perPage}`

	if (timeFrom) url += `&since${timeFrom}`

	const res = await fetch(url)

	if (res.ok) {
		const data = (await res.json()) as WebmentionsFeed
		return data
	}

	return null
}

// Merge cached entries [a] with fresh webmentions [b], merge by wm-id
function mergeWebmentions(a: WebmentionsCache, b: WebmentionsFeed): WebmentionsChildren[] {
	return Array.from(
		[...a.children, ...b.children]
			.reduce((map, obj) => map.set(obj['wm-id'], obj), new Map())
			.values()
	)
}

// filter out WebmentionChildren
export function filterWebmentions(webmentions: WebmentionsChildren[]) {
	return webmentions.filter((webmention) => {
		// make sure the mention has a property so we can sort them later
		if (!validWebmentionTypes.includes(webmention['wm-property'])) return false

		// make sure 'mention-of' or 'in-reply-to' has text content.
		if (webmention['wm-property'] === 'mention-of' || webmention['wm-property'] === 'in-reply-to') {
			return webmention.content && webmention.content.text !== ''
		}

		return true
	})
}

// save combined webmentions in cache file
async function writeToCache(data: WebmentionsCache) {
	try {
		await s3.send(
			new PutObjectCommand({
				Bucket: bucketName,
				Key: cachePath,
				Body: JSON.stringify(data, null, 2)
			})
		)
		console.log('Successfully saved comments to ' + bucketName + '/' + cachePath)
	} catch (err) {
		console.log('Error: ', err)
	}
}

async function getFromCache(): Promise<WebmentionsCache> {
	const emptyCache: WebmentionsCache = { lastFetched: null, children: [] }
	try {
		const res = await s3.send(
			new GetObjectCommand({
				Bucket: bucketName,
				Key: cachePath
			})
		)
		const data = await res.Body?.transformToString()!
		return JSON.parse(data) as WebmentionsCache
	} catch (err) {
		return emptyCache
	}
}

async function getAndCacheWebmentions() {
	const cache = await getFromCache()
	const mentions = await fetchWebmentions(cache.lastFetched)

	if (mentions) {
		mentions.children = filterWebmentions(mentions.children)
		const webmentions: WebmentionsCache = {
			lastFetched: new Date().toISOString(),
			// Make sure the first arg is the cache
			children: mergeWebmentions(cache, mentions)
		}

		writeToCache(webmentions)
		return webmentions
	}

	return cache
}

let webMentions: WebmentionsCache

export async function getWebmentionsForUrl(url: string) {
	if (!webMentions) webMentions = await getAndCacheWebmentions()

	return webMentions.children.filter((entry) => entry['wm-target'] === url)
}
