import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ENV_VARS } from '@sentinel-supreme/shared'
import { validateRmqTopology } from '@sentinel-supreme/shared/server'

@Injectable()
export class AppService implements OnModuleInit {
	private readonly logger = new Logger(AppService.name)

	constructor(private readonly config: ConfigService) {}

	async onModuleInit() {
		await this.setupRabbitMQ()
	}

	private async setupRabbitMQ() {
		try {
			const { RMQ_USER, RMQ_PASSWORD, RMQ_PORT, RMQ_VHOST } = ENV_VARS

			const rmqUser = this.config.getOrThrow<string>(RMQ_USER)
			const rmqPassword = this.config.getOrThrow<string>(RMQ_PASSWORD)
			const rmqPort = this.config.getOrThrow<string>(RMQ_PORT)
			const rmqVhost = this.config.getOrThrow<string>(RMQ_VHOST)

			const rmqUrl = `amqp://${rmqUser}:${rmqPassword}@localhost:${rmqPort}/${rmqVhost}`

			await validateRmqTopology(rmqUrl)

			this.logger.log('✅ RabbitMQ Topology (Exchanges/Queues) verified and created.')
		} catch (error) {
			this.logger.error('❌ Failed to setup RabbitMQ topology', error)
		}
	}
}
