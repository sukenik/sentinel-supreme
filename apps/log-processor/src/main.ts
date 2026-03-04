import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { ENV_VARS, QUEUES } from '@sentinel-supreme/shared'
import { AppModule } from './app/app.module'
import { DL_ROUTING_KEY, DL_ROUTING_KEY_HEADER, DLX_EXCHANGE, DLX_HEADER } from './consts'

async function bootstrap() {
	const appContext = await NestFactory.createApplicationContext(AppModule)
	const configService = appContext.get(ConfigService)
	const rmqUrl = configService.getOrThrow<string>(ENV_VARS.RABBITMQ_URL)
	const port = configService.get<number>('PORT')

	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		transport: Transport.RMQ,
		options: {
			urls: [rmqUrl],
			queue: QUEUES.LOG_QUEUE,
			noAck: false,
			queueOptions: {
				durable: true,
				arguments: {
					[DLX_HEADER]: DLX_EXCHANGE,
					[DL_ROUTING_KEY_HEADER]: DL_ROUTING_KEY
				}
			}
		}
	})

	await app.listen()
	Logger.log(`🚀 Log Processor is running on: http://localhost:${port}`)

	await appContext.close()
}

bootstrap()
