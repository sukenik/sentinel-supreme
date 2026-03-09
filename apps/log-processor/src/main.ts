import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { DL_CONFIG, ENV_VARS, QUEUES } from '@sentinel-supreme/shared'
import { AppModule } from './app/app.module'

async function bootstrap() {
	const appContext = await NestFactory.createApplicationContext(AppModule)
	const config = appContext.get(ConfigService)

	const { RMQ_USER, RMQ_PASSWORD, RMQ_PORT, RMQ_VHOST } = ENV_VARS

	const rmqUser = config.getOrThrow<string>(RMQ_USER)
	const rmqPassword = config.getOrThrow<string>(RMQ_PASSWORD)
	const rmqPort = config.getOrThrow<string>(RMQ_PORT)
	const rmqVhost = config.getOrThrow<string>(RMQ_VHOST)

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

	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

	await app.listen()
	Logger.log('🚀 Log Processor is running')

	await appContext.close()
}

bootstrap()
