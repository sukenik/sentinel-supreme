import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AI_ANALYSIS_RESULTS_DLX, DL_CONFIG, LOG_DLX, QUEUES } from '@sentinel-supreme/shared'
import { SharedRmqModule } from '@sentinel-supreme/shared/server'
import * as dotenv from 'dotenv'
import { AppModule } from './app/app.module'

dotenv.config()

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.connectMicroservice(
		SharedRmqModule.getOptionsRaw(QUEUES.LOGS, false, {
			arguments: {
				[DL_CONFIG.DLX_HEADER]: LOG_DLX.DLX_NAME,
				[DL_CONFIG.DL_ROUTING_KEY_HEADER]: LOG_DLX.DL_ROUTING_KEY
			}
		})
	)
	app.connectMicroservice(
		SharedRmqModule.getOptionsRaw(QUEUES.AI_ANALYSIS_RESULTS, false, {
			arguments: {
				[DL_CONFIG.DLX_HEADER]: AI_ANALYSIS_RESULTS_DLX.DLX_NAME,
				[DL_CONFIG.DL_ROUTING_KEY_HEADER]: AI_ANALYSIS_RESULTS_DLX.DL_ROUTING_KEY
			}
		})
	)

	await app.startAllMicroservices()

	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

	await app.listen(0)
	Logger.log('🚀 Log-Processor is listening...')
}

bootstrap()
