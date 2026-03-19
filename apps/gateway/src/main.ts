import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import { appConfig, ENV_VARS, GATEWAY_ROUTES, QUEUES } from '@sentinel-supreme/shared'
import { AppModule } from './app/app.module'
import { TransformInterceptor } from './app/interceptors/transform.interceptor'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const { DASHBOARD_URL, GATEWAY_URL } = appConfig

	app.enableCors({
		origin: DASHBOARD_URL,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true
	})

	const config = app.get(ConfigService)

	const port = config.getOrThrow(ENV_VARS.GATEWAY_PORT)

	const rmqUser = config.getOrThrow<string>(ENV_VARS.RMQ_USER)
	const rmqPassword = config.getOrThrow<string>(ENV_VARS.RMQ_PASSWORD)
	const rmqPort = config.getOrThrow<string>(ENV_VARS.RMQ_PORT)
	const rmqVhost = config.getOrThrow<string>(ENV_VARS.RMQ_VHOST)
	const rmqHost = config.getOrThrow<string>(ENV_VARS.RMQ_HOST)

	const rmqUrl = `amqp://${rmqUser}:${rmqPassword}@${rmqHost}:${rmqPort}/${rmqVhost}`

	app.connectMicroservice({
		transport: Transport.RMQ,
		options: {
			urls: [rmqUrl],
			queue: QUEUES.UI_UPDATES_QUEUE,
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
	app.setGlobalPrefix(GATEWAY_ROUTES.PREFIX)

	await app.startAllMicroservices()
	await app.listen(port)
	Logger.log(`🚀 Gateway is running on: ${GATEWAY_URL}${GATEWAY_ROUTES.PREFIX}`)
}

bootstrap()
