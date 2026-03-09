import { Body, Controller, Inject, Logger, OnModuleInit, Post, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import {
	CreateLogDto,
	ENV_VARS,
	eUserRole,
	LOG_PATTERNS,
	LOG_SERVICE,
	validateRmqTopology
} from '@sentinel-supreme/shared'
import { Roles } from '../auth/decorators/roles.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'

@Controller('logs')
export class LogsController implements OnModuleInit {
	private readonly logger = new Logger(LogsController.name)

	constructor(
		@Inject(LOG_SERVICE) private readonly rmqClient: ClientProxy,
		private readonly config: ConfigService
	) {}

	async onModuleInit() {
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
			this.logger.error('❌ Failed to connect to RabbitMQ from Gateway', error)
		}
	}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(eUserRole.USER, eUserRole.ADMIN)
	async createLog(@Body() logData: CreateLogDto) {
		this.logger.log('Receiving new log event via HTTP')

		this.rmqClient.emit(LOG_PATTERNS.NEW_LOG, logData)
		return { message: 'Log accepted' }
	}
}
