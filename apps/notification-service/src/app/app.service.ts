import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SharedRmqModule, validateRmqTopology } from '@sentinel-supreme/shared/server'

@Injectable()
export class AppService implements OnModuleInit {
	private readonly logger = new Logger(AppService.name)

	constructor(private readonly config: ConfigService) {}

	async onModuleInit() {
		await this.setupRabbitMQ()
	}

	private async setupRabbitMQ() {
		try {
			const rmqUrl = SharedRmqModule.getUrl(this.config)

			await validateRmqTopology(rmqUrl)

			this.logger.log('✅ RabbitMQ Topology (Exchanges/Queues) verified and created.')
		} catch (error) {
			this.logger.error('❌ Failed to setup RabbitMQ topology', error)
		}
	}
}
