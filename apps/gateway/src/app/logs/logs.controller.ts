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
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(eUserRole.USER, eUserRole.ADMIN)
	async createLog(@Body() logData: CreateLogDto) {
		this.logger.log('Receiving new log event via HTTP')

		this.rmqClient.emit(LOG_PATTERNS.NEW_LOG, logData)
		return { message: 'Log accepted' }
	}
}
