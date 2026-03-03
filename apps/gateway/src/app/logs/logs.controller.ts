import { Controller, Post, Body, Inject, Logger, OnModuleInit } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { LOG_SERVICE, LOG_PATTERNS } from '@sentinel-supreme/shared'

@Controller('logs')
export class LogsController implements OnModuleInit {
	private readonly logger = new Logger(LogsController.name)

	constructor(@Inject(LOG_SERVICE) private readonly rmqClient: ClientProxy) {}

	async onModuleInit() {
		try {
			await this.rmqClient.connect()
			this.logger.log('✅ Successfully connected to RabbitMQ from Gateway')
		} catch (error) {
			this.logger.error('❌ Failed to connect to RabbitMQ from Gateway', error)
		}
	}

	@Post()
	async createLog(@Body() logData: any) {
		this.logger.log('Receiving new log event via HTTP')

		this.rmqClient.emit(LOG_PATTERNS.NEW_LOG, {
			...logData,
			timestamp: new Date().toISOString()
		})

		return { message: 'Log accepted and queued for processing' }
	}
}
