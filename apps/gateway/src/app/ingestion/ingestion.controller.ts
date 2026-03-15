import { Body, Controller, Inject, Logger, OnModuleInit, Post, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import { ENV_VARS, eUserRole, LOG_PATTERNS, LOG_SERVICE } from '@sentinel-supreme/shared'
import { CreateLogDto, validateRmqTopology } from '@sentinel-supreme/shared/server'
import { Roles } from '../auth/decorators/roles.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'

@Controller('logs')
export class IngestionController implements OnModuleInit {
	private readonly logger = new Logger(IngestionController.name)

	constructor(
		@Inject(LOG_SERVICE) private readonly rmqClient: ClientProxy,
		private readonly config: ConfigService
	) {}

	async onModuleInit() {
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
			this.logger.error('❌ Failed to connect to RabbitMQ from Gateway', error)
		}
	}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(eUserRole.USER, eUserRole.ADMIN)
	async createLog(@Body() logData: CreateLogDto) {
		this.logger.log('Receiving new log event via HTTP')

		const logWithTime = {
			...logData,
			createdAt: logData.createdAt || new Date().toISOString()
		}

		this.rmqClient.emit(LOG_PATTERNS.NEW_LOG, logWithTime)
		return { message: 'Log accepted' }
	}
}
