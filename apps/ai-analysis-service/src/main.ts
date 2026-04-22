import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AI_ANALYSIS_DLX, DL_CONFIG, QUEUES } from '@sentinel-supreme/shared'
import { SharedRmqModule } from '@sentinel-supreme/shared/server'
import { AppModule } from './app/app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.connectMicroservice(
		SharedRmqModule.getOptionsRaw(QUEUES.AI_ANALYSIS, false, {
			arguments: {
				[DL_CONFIG.DLX_HEADER]: AI_ANALYSIS_DLX.DLX_NAME,
				[DL_CONFIG.DL_ROUTING_KEY_HEADER]: AI_ANALYSIS_DLX.DL_ROUTING_KEY
			}
		})
	)

	app.connectMicroservice(SharedRmqModule.getOptionsRaw(QUEUES.AI_CHAT_REQUEST))

	await app.startAllMicroservices()

	await app.listen(0)
	Logger.log('🚀 AI-Analysis-Service is listening...')
}

bootstrap()
