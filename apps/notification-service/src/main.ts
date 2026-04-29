import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DL_CONFIG, ENV_VARS, NOTIFICATIONS_DLX, QUEUES } from '@sentinel-supreme/shared'
import { SharedRmqModule } from '@sentinel-supreme/shared/server'
import { AppModule } from './app/app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = app.get(ConfigService)
	const port = config.getOrThrow<number>(ENV_VARS.NOTIFICATION_SERVICE_PORT)

	app.connectMicroservice(
		SharedRmqModule.getOptions(config, QUEUES.NOTIFICATIONS, false, {
			arguments: {
				[DL_CONFIG.DLX_HEADER]: NOTIFICATIONS_DLX.DLX_NAME,
				[DL_CONFIG.DL_ROUTING_KEY_HEADER]: NOTIFICATIONS_DLX.DL_ROUTING_KEY
			}
		})
	)

	await app.startAllMicroservices()

	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

	await app.listen(port)
	Logger.log(`🚀 Notification-Service is listening, metrics available on port: ${port}`)
}

bootstrap()
