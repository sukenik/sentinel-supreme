import { Controller, Inject, Logger, OnModuleInit, Post } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import { ENV_VARS, LOG_PATTERNS, LOG_SERVICE, validateRmqTopology } from '@sentinel-supreme/shared'

@Controller('logs')
export class LogsController implements OnModuleInit {
	private readonly logger = new Logger(LogsController.name)

	constructor(
		@Inject(LOG_SERVICE) private readonly rmqClient: ClientProxy,
		private readonly configService: ConfigService
	) {}

	async onModuleInit() {
		try {
			const rmqUrl = this.configService.getOrThrow<string>(ENV_VARS.RABBITMQ_URL)

			await validateRmqTopology(rmqUrl)

			this.logger.log('✅ RabbitMQ Topology (Exchanges/Queues) verified and created.')
		} catch (error) {
			this.logger.error('❌ Failed to connect to RabbitMQ from Gateway', error)
		}
	}

	@Post()
	async createLog() {
		this.logger.log('Receiving new log event via HTTP')

		for (let i = 0; i < 1000; i++) {
			this.rmqClient.emit(LOG_PATTERNS.NEW_LOG, {
				message: `Stress test log #${i}`,
				level: 'info',
				timestamp: new Date().toISOString()
			})
		}

		return { message: 'Log accepted and queued for processing' }
	}
}
