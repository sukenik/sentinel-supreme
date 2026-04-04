import { NestFactory } from '@nestjs/core'
import { getModelToken } from '@nestjs/mongoose'
import { eLogLevel } from '@sentinel-supreme/shared'
import { Log } from '@sentinel-supreme/shared/server'
import * as crypto from 'crypto'
import { Model } from 'mongoose'
import { AppModule } from '../app/app.module'

async function runSeed() {
	console.log('🌱 Starting Seed process...')

	const app = await NestFactory.createApplicationContext(AppModule)
	const logModel = app.get<Model<Log>>(getModelToken(Log.name))

	const services = ['gateway', 'auth-service', 'payment-service', 'inventory']
	const levels = Object.values(eLogLevel)
	const logs = []

	for (let i = 0; i < 100; i++) {
		const data = {
			level: levels[Math.floor(Math.random() * levels.length)],
			message: `System message number ${i} - Auto generated seed`,
			service: services[Math.floor(Math.random() * services.length)],
			metadata: { env: 'development', batch: 'seed-v1' },
			createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000))
		}

		const timeBucket = Math.floor(data.createdAt.getTime() / 5000)
		const str = `${data.service}-${data.level}-${data.message}-${JSON.stringify(data.metadata)}-${timeBucket}`
		const fingerprint = crypto.createHash('md5').update(str).digest('hex')

		logs.push({ ...data, fingerprint })
	}

	try {
		await logModel.insertMany(logs)
		console.log('✅ Successfully seeded 100 logs to MongoDB')
	} catch (error) {
		console.error('❌ Seed failed:', error)
	} finally {
		await app.close()
		process.exit(0)
	}
}

runSeed()
