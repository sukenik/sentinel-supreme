import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { appConfig, ENV_VARS, QUEUES, SERVER_GLOBAL_PREFIX } from '@sentinel-supreme/shared'
import { SharedRmqModule } from '@sentinel-supreme/shared/server'
import cookieParser from 'cookie-parser'
import { AppModule } from './app/app.module'
import { TransformInterceptor } from './app/interceptors/transform.interceptor'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.use(cookieParser())

	const { DASHBOARD_URL, GATEWAY_URL } = appConfig

	app.enableCors({
		origin: DASHBOARD_URL,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true
	})

	const config = app.get(ConfigService)
	const port = config.getOrThrow<number>(ENV_VARS.GATEWAY_PORT)

	app.connectMicroservice(SharedRmqModule.getOptions(config, QUEUES.UI_UPDATES))
	app.connectMicroservice(SharedRmqModule.getOptions(config, QUEUES.AI_CHAT_RESPONSE))

	app.useGlobalPipes(
		new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })
	)
	app.useGlobalInterceptors(new TransformInterceptor())
	app.setGlobalPrefix(SERVER_GLOBAL_PREFIX)

	await app.startAllMicroservices()
	await app.listen(port)
	Logger.log(`🚀 Gateway is running on: ${GATEWAY_URL}${SERVER_GLOBAL_PREFIX}`)
}

bootstrap()
