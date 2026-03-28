import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions } from '@nestjs/microservices'
import { DL_CONFIG, QUEUES } from '@sentinel-supreme/shared'
import { SharedRmqModule } from '@sentinel-supreme/shared/server'
import { AppModule } from './app/app.module'

async function bootstrap() {
	const appContext = await NestFactory.createApplicationContext(AppModule)
	const config = appContext.get(ConfigService)

	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AppModule,
		SharedRmqModule.getOptions(config, QUEUES.LOGS, false, {
			arguments: {
				[DL_CONFIG.DLX_HEADER]: DL_CONFIG.DLX_EXCHANGE,
				[DL_CONFIG.DL_ROUTING_KEY_HEADER]: DL_CONFIG.DL_ROUTING_KEY
			}
		})
	)

	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

	await app.listen()
	Logger.log('🚀 Log Processor is running')

	await appContext.close()
}

bootstrap()
