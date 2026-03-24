import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { MongooseModule } from '@nestjs/mongoose'
import { ENV_VARS, GATEWAY_SERVICE, QUEUES } from '@sentinel-supreme/shared'
import { RulesModule } from '../rules/rules.module'
import { LogsController } from './logs.controller'
import { LogsService } from './logs.service'
import { Log, LogSchema } from './schemas/log.schema'

@Module({
	imports: [
		RulesModule,
		MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
		ClientsModule.registerAsync([
			{
				name: GATEWAY_SERVICE,
				inject: [ConfigService],
				useFactory: (config: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [
							`amqp://${config.getOrThrow(ENV_VARS.RMQ_USER)}:${config.getOrThrow(ENV_VARS.RMQ_PASSWORD)}@${config.getOrThrow(ENV_VARS.RMQ_HOST)}:${config.getOrThrow(ENV_VARS.RMQ_PORT)}/${config.getOrThrow(ENV_VARS.RMQ_VHOST)}`
						],
						queue: QUEUES.UI_UPDATES_QUEUE
					}
				})
			}
		])
	],
	providers: [LogsService],
	controllers: [LogsController]
})
export class LogsModule {}
