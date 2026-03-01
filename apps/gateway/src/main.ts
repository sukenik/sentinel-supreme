import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { TransformInterceptor } from './app/interceptors/transform.interceptor'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const port = process.env.PORT || 3000
	const globalPrefix = 'api'

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true
		})
	)

	app.useGlobalInterceptors(new TransformInterceptor())
	app.setGlobalPrefix(globalPrefix)
	app.listen(port)
	Logger.log(`🚀 Gateway is running on: http://localhost:${port}/${globalPrefix}`)
}

bootstrap()
