import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { DL_CONFIG, ENV_VARS, LOG_SERVICE, QUEUES } from '@sentinel-supreme/shared'
import { IngestionController } from './ingestion.controller'

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: LOG_SERVICE,
				inject: [ConfigService],
				useFactory: (config: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [
							`amqp://${config.getOrThrow(ENV_VARS.RMQ_USER)}:${config.getOrThrow(ENV_VARS.RMQ_PASSWORD)}@${config.getOrThrow(ENV_VARS.RMQ_HOST)}:${config.getOrThrow(ENV_VARS.RMQ_PORT)}/${config.getOrThrow(ENV_VARS.RMQ_VHOST)}`
						],
						queue: QUEUES.LOG_QUEUE,
						queueOptions: {
							durable: true,
							arguments: {
								[DL_CONFIG.DLX_HEADER]: DL_CONFIG.DLX_EXCHANGE,
								[DL_CONFIG.DL_ROUTING_KEY_HEADER]: DL_CONFIG.DL_ROUTING_KEY
							}
						}
					}
				})
			}
		])
	],
	controllers: [IngestionController]
})
export class IngestionModule {}
