import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions } from '@nestjs/microservices'
import { DL_CONFIG, NOTIFICATIONS_DLX, QUEUES } from '@sentinel-supreme/shared'
import { SharedRmqModule } from '@sentinel-supreme/shared/server'
import { AppModule } from './app/app.module'

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AppModule,
		SharedRmqModule.getOptionsRaw(QUEUES.NOTIFICATIONS, false, {
			arguments: {
				[DL_CONFIG.DLX_HEADER]: NOTIFICATIONS_DLX.DLX_NAME,
				[DL_CONFIG.DL_ROUTING_KEY_HEADER]: NOTIFICATIONS_DLX.DL_ROUTING_KEY
			}
		})
	)

	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

	await app.listen()
	Logger.log('🚀 Notification-Service is listening...')
}

bootstrap()
