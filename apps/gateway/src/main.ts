import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import { ENV_VARS, QUEUES } from '@sentinel-supreme/shared'
import { AppModule } from './app/app.module'
import { TransformInterceptor } from './app/interceptors/transform.interceptor'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = app.get(ConfigService)

	const port = config.get(ENV_VARS.GATEWAY_PORT)
	const globalPrefix = 'api'

	const rmqUser = config.getOrThrow<string>(ENV_VARS.RMQ_USER)
	const rmqPassword = config.getOrThrow<string>(ENV_VARS.RMQ_PASSWORD)
	const rmqPort = config.getOrThrow<string>(ENV_VARS.RMQ_PORT)
	const rmqVhost = config.getOrThrow<string>(ENV_VARS.RMQ_VHOST)

	const rmqUrl = `amqp://${rmqUser}:${rmqPassword}@localhost:${rmqPort}/${rmqVhost}`

	app.connectMicroservice({
		transport: Transport.RMQ,
		options: {
			urls: [rmqUrl],
			queue: QUEUES.UI_UPDATE_QUEUE,
			noAck: true,
			queueOptions: {
				durable: true
			}
		}
	})

	app.useGlobalPipes(
		new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })
	)
	app.useGlobalInterceptors(new TransformInterceptor())
	app.setGlobalPrefix(globalPrefix)

	await app.startAllMicroservices()

	await app.listen(port)
	Logger.log(`🚀 Gateway is running on: http://localhost:${port}/${globalPrefix}`)
}

bootstrap()
