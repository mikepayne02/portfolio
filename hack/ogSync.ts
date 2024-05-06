import { S3Client } from '@aws-sdk/client-s3'
import photon from '@silvia-odwyer/photon-node'
import fg from 'fast-glob'
import fs from 'fs/promises'
import matter from 'gray-matter'
import path from 'path'
import { S3SyncClient } from 's3-sync-client'

const { env } = process

const s3 = new S3Client({
	endpoint: env.BUCKET_ENDPOINT!,
	region: env.BUCKET_REGION!,
	credentials: {
		accessKeyId: env.BUCKET_KEY_ID!,
		secretAccessKey: env.BUCKET_SECRET!
	}
})

const { sync } = new S3SyncClient({ client: s3 })

const imagesPath = path.join(__dirname, '../src/assets/images')
const ogPath = path.join(__dirname, '../.ogimage')

const fileFilter = [
	{
		inclue(key) {
			return key in getImages()
		}
	}
]

const getImages = async () => {
	const entries = await fg('src/content/project/**/*.{md,mdx}')
	const frontmatter = entries.map(async (file) => {
		const content = await fs.readFile(file, 'utf-8')
		const { data } = matter(content)
		return data
	})
	const posts = await Promise.all(frontmatter)
	return posts.filter((post) => !post.ogManual).map((post) => post.ogImage)
}

const optimise = async (imageData: string) => {
	const data = imageData.replace(/^data:image\/(png|jpg);base64,/, '')
	// convert base64 to PhotonImage
	const input_img = photon.PhotonImage.new_from_base64(data)

	const aspectRatio = input_img.get_width() / input_img.get_height()
	const height = Math.trunc(600 / aspectRatio)

	return photon.resize(input_img, 600, height, 5).get_base64()
}

;(async () => {
	const images = await getImages()

	// Create the ogimage directory if it doesn't exist
	await fs.stat(ogPath).catch(() => fs.mkdir(ogPath))

	for (const image of images) {
		const imagePath = path.join(imagesPath, image)
		const imageBuffer = await fs.readFile(imagePath, { encoding: 'base64' })

		const outputImage = await optimise(imageBuffer)
		const outputFile = outputImage.replace(/^data:image\/\w+;base64,/, '')

		fs.writeFile(path.join(ogPath, image), outputFile, {
			encoding: 'base64'
		})
	}

	try {
		await sync(ogPath, `s3://${process.env.BUCKET_NAME}/og`, {
			del: true
		})
		console.log('Successfully synced opengraph images to bucket')
	} catch (e) {
		console.error('Error syncing images', e)
	}
})()
