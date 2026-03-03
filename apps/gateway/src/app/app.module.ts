import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { LOG_SERVICE, QUEUES } from '@sentinel-supreme/shared'
import Joi from 'joi'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				PORT: Joi.number().default(3000),
				RABBITMQ_URL: Joi.string().required()
			})
		}),
		ClientsModule.registerAsync([
			{
				name: LOG_SERVICE,
				inject: [ConfigService],
				useFactory: (configService: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
						queue: QUEUES.LOG_QUEUE,
						queueOptions: {
							durable: true
						}
					}
				})
			}
		])
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
