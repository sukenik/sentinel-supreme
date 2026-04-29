import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AI_ANALYSIS_DLX, DL_CONFIG, ENV_VARS, QUEUES } from '@sentinel-supreme/shared'
import { SharedRmqModule } from '@sentinel-supreme/shared/server'
import { AppModule } from './app/app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = app.get(ConfigService)
	const port = config.getOrThrow<number>(ENV_VARS.AI_SERVICE_PORT)

	app.connectMicroservice(
		SharedRmqModule.getOptions(config, QUEUES.AI_ANALYSIS, false, {
			arguments: {
				[DL_CONFIG.DLX_HEADER]: AI_ANALYSIS_DLX.DLX_NAME,
				[DL_CONFIG.DL_ROUTING_KEY_HEADER]: AI_ANALYSIS_DLX.DL_ROUTING_KEY
			}
		})
	)

	app.connectMicroservice(SharedRmqModule.getOptions(config, QUEUES.AI_CHAT_REQUEST))

	await app.startAllMicroservices()

	await app.listen(port)
	Logger.log(`🚀 AI-Service is listening, metrics available on port: ${port}`)
}

bootstrap()
