import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ENV_VARS, validateRmqTopology } from '@sentinel-supreme/shared'

@Injectable()
export class AppService implements OnModuleInit {
	private readonly logger = new Logger(AppService.name)

	constructor(private readonly config: ConfigService) {}

	async onModuleInit() {
		await this.setupRabbitMQ()
	}

	private async setupRabbitMQ() {
		try {
			const { RABBITMQ_USER, RABBITMQ_PASSWORD, RABBITMQ_PORT, RABBITMQ_VHOST } = ENV_VARS

			const rmqUser = this.config.getOrThrow<string>(RABBITMQ_USER)
			const rmqPassword = this.config.getOrThrow<string>(RABBITMQ_PASSWORD)
			const rmqPort = this.config.getOrThrow<string>(RABBITMQ_PORT)
			const rmqVhost = this.config.getOrThrow<string>(RABBITMQ_VHOST)

			const rmqUrl = `amqp://${rmqUser}:${rmqPassword}@localhost:${rmqPort}/${rmqVhost}`

			await validateRmqTopology(rmqUrl)

			this.logger.log('✅ RabbitMQ Topology (Exchanges/Queues) verified and created.')
		} catch (error) {
			this.logger.error('❌ Failed to setup RabbitMQ topology', error)
		}
	}
}
