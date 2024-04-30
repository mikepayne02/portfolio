import { S3Client } from '@aws-sdk/client-s3'
import { S3SyncClient } from 's3-sync-client'
;(async () => {
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
	await sync('../src/assets/images', `s3://${process.env.BUCKET_NAME}/og`, { del: true })
		.catch((e) => {
			console.error('Error syncing images', e)
		})
		.then(() => console.log('Successfully synced images to bucket'))
})()
