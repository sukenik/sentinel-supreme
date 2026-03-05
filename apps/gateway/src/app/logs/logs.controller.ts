import { Body, Controller, Inject, Logger, OnModuleInit, Post } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import {
	ENV_VARS,
	LOG_PATTERNS,
	LOG_SERVICE,
	validateRmqTopology,
	CreateLogDto
} from '@sentinel-supreme/shared'

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
	async createLog(@Body() logData: CreateLogDto) {
		this.logger.log('Receiving new log event via HTTP')

		this.rmqClient.emit(LOG_PATTERNS.NEW_LOG, logData)
		return { message: 'Log accepted' }
	}
}
