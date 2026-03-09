import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { DL_CONFIG, ENV_VARS, QUEUES } from '@sentinel-supreme/shared'
import { AppModule } from './app/app.module'

async function bootstrap() {
	const appContext = await NestFactory.createApplicationContext(AppModule)
	const config = appContext.get(ConfigService)
	const port = config.get<number>('PORT')

	const { RABBITMQ_USER, RABBITMQ_PASSWORD, RABBITMQ_PORT, RABBITMQ_VHOST } = ENV_VARS

	const rmqUser = config.getOrThrow<string>(RABBITMQ_USER)
	const rmqPassword = config.getOrThrow<string>(RABBITMQ_PASSWORD)
	const rmqPort = config.getOrThrow<string>(RABBITMQ_PORT)
	const rmqVhost = config.getOrThrow<string>(RABBITMQ_VHOST)

	const rmqUrl = `amqp://${rmqUser}:${rmqPassword}@localhost:${rmqPort}/${rmqVhost}`

	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		transport: Transport.RMQ,
		options: {
			urls: [rmqUrl],
			queue: QUEUES.LOG_QUEUE,
			noAck: false,
			queueOptions: {
				durable: true,
				arguments: {
					[DL_CONFIG.DLX_HEADER]: DL_CONFIG.DLX_EXCHANGE,
					[DL_CONFIG.DL_ROUTING_KEY_HEADER]: DL_CONFIG.DL_ROUTING_KEY
				}
			}
		}
	})

	await app.listen()
	Logger.log(`🚀 Log Processor is running on: http://localhost:${port}`)

	await appContext.close()
}

bootstrap()
