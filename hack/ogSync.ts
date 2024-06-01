import sharp from 'sharp'
import fg from 'fast-glob'
import fs from 'fs/promises'
import matter from 'gray-matter'
import path from 'path'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

const { env } = process

const S3 = new S3Client({
	region: 'auto',
	endpoint: `https://${env.ACCOUNT_ID!}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: env.BUCKET_KEY_ID!,
		secretAccessKey: env.BUCKET_SECRET!
	}
})

const imagesPath = path.join(__dirname, '../src/assets/images')
const ogCache = path.join(__dirname, '../.ogimage')

const entries = await fg('src/content/project/**/*.{md,mdx}')
const frontmatter = entries.map(async (file) => {
	const content = await fs.readFile(file, 'utf-8')
	const { data } = matter(content)
	return data
})

const posts = await Promise.all(frontmatter)
const images = posts.filter((post) => !post.ogManual).map((post) => post.ogImage)

// Create the ogimage directory if it doesn't exist
await fs.stat(ogCache).catch(() => fs.mkdir(ogCache))

// Optimise the images with Sharp
for (const image of images) {
	const imagePath = path.join(imagesPath, image)
	const outputPath = path.join(ogCache, image)

	// Skip if the image already exists
	if (await Bun.file(outputPath).exists()) continue

	// Resize the image to 600px
	sharp(imagePath).resize({ width: 600 }).toFile(outputPath)
}

try {
	for (const imagePath of await fg(ogCache + '/*.{png,jpg,jpeg}')) {
		const upload = new Upload({
			client: S3,
			params: {
				Bucket: env.BUCKET_NAME!,
				Key: 'og%2F' + path.basename(imagePath),
				Body: Bun.file(imagePath)
			}
		})
		await upload.done()
	}
	console.log('Successfully synced opengraph images to bucket')
} catch (e) {
	console.error('Error syncing images', e)
}
