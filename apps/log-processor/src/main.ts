import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions } from '@nestjs/microservices'
import { DL_CONFIG, LOG_DLX, QUEUES } from '@sentinel-supreme/shared'
import { SharedRmqModule } from '@sentinel-supreme/shared/server'
import * as dotenv from 'dotenv'
import { AppModule } from './app/app.module'

dotenv.config()

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AppModule,
		SharedRmqModule.getOptionsRaw(QUEUES.LOGS, false, {
			arguments: {
				[DL_CONFIG.DLX_HEADER]: LOG_DLX.DLX_NAME,
				[DL_CONFIG.DL_ROUTING_KEY_HEADER]: LOG_DLX.DL_ROUTING_KEY
			}
		})
	)

	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

	await app.listen()
	Logger.log('🚀 Log-Processor is listening...')
}

bootstrap()
