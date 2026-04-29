import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import {
	AI_ANALYSIS_RESULTS_DLX,
	DL_CONFIG,
	ENV_VARS,
	LOG_DLX,
	QUEUES
} from '@sentinel-supreme/shared'
import { SharedRmqModule } from '@sentinel-supreme/shared/server'
import { AppModule } from './app/app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = app.get(ConfigService)
	const port = config.getOrThrow<number>(ENV_VARS.LOG_PROCESSOR_PORT)

	app.connectMicroservice(
		SharedRmqModule.getOptions(config, QUEUES.LOGS, false, {
			arguments: {
				[DL_CONFIG.DLX_HEADER]: LOG_DLX.DLX_NAME,
				[DL_CONFIG.DL_ROUTING_KEY_HEADER]: LOG_DLX.DL_ROUTING_KEY
			}
		})
	)
	app.connectMicroservice(
		SharedRmqModule.getOptions(config, QUEUES.AI_ANALYSIS_RESULTS, false, {
			arguments: {
				[DL_CONFIG.DLX_HEADER]: AI_ANALYSIS_RESULTS_DLX.DLX_NAME,
				[DL_CONFIG.DL_ROUTING_KEY_HEADER]: AI_ANALYSIS_RESULTS_DLX.DL_ROUTING_KEY
			}
		})
	)

	await app.startAllMicroservices()

	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

	await app.listen(port)
	Logger.log(`🚀 Log-Processor is listening, metrics available on port: ${port}`)
}

bootstrap()
