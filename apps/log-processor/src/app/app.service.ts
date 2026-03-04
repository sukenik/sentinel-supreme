import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ENV_VARS, validateRmqTopology } from '@sentinel-supreme/shared'

@Injectable()
export class AppService implements OnModuleInit {
	private readonly logger = new Logger(AppService.name)

	constructor(private readonly configService: ConfigService) {}

	async onModuleInit() {
		await this.setupRabbitMQ()
	}

	private async setupRabbitMQ() {
		try {
			const rmqUrl = this.configService.getOrThrow<string>(ENV_VARS.RABBITMQ_URL)

			await validateRmqTopology(rmqUrl)

			this.logger.log('✅ RabbitMQ Topology (Exchanges/Queues) verified and created.')
		} catch (error) {
			this.logger.error('❌ Failed to setup RabbitMQ topology', error)
		}
	}
}
