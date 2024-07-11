import * as dotenv from 'dotenv'
import sharp from 'sharp'
import fg from 'fast-glob'
import fs from 'fs/promises'
import matter from 'gray-matter'
import path from 'path'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

dotenv.config({ path: ".dev.vars"})
const { env } = process

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.BUCKET_KEY_ID!,
    secretAccessKey: env.BUCKET_SECRET!
  }
})

const pwd = dirname(fileURLToPath(import.meta.url))

const imagesPath = path.join(pwd, '../src/assets/images')
const ogCache = path.join(pwd, '../.ogimage')

const entries = await fg('src/content/project/**/*.{md,mdx}')
const frontmatter = entries.map(async (file) => {
  const content = await fs.readFile(file, 'utf-8')
  const { data } = matter(content)
  return data
})

const posts = await Promise.all(frontmatter)
const images = posts
  .filter((post) => !post.ogManual)
  .map((post) => post.ogImage)

// Create the ogimage directory if it doesn't exist
await fs.stat(ogCache).catch(() => fs.mkdir(ogCache))

// Optimise the images with Sharp
for (const image of images) {
  const imagePath = path.join(imagesPath, image)
  const outputPath = path.join(ogCache, image)

  // Skip if the image already exists
  try {
    await fs.access(outputPath)
    continue
  } catch {
    console.log(`optimizing ${image}`)
  }

  // Resize the image to 600px
  sharp(imagePath).resize({ width: 600 }).toFile(outputPath)
}

try {
  for (const imagePath of await fg(ogCache + '/*.{png,jpg,jpeg}')) {
    const image = path.basename(imagePath)
    console.log(`syncing ${image}`)
    const upload = new Upload({
      client: S3,
      params: {
        Bucket: env.BUCKET_NAME!,
        Key: 'og/' + image,
        Body: await fs.readFile(imagePath)
      }
    })
    await upload.done()
  }
  console.log('Successfully synced opengraph images to bucket')
} catch (e) {
  console.error('Error syncing images', e)
}
