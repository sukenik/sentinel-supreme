import {
	Body,
	Controller,
	Inject,
	Logger,
	OnModuleInit,
	Post,
	Req,
	UseGuards
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import {
	ENV_VARS,
	eUserRole,
	GATEWAY_ROUTES,
	LOG_PATTERNS,
	LOG_SERVICE
} from '@sentinel-supreme/shared'
import { CreateLogDto, validateRmqTopology } from '@sentinel-supreme/shared/server'
import type { Request } from 'express'
import { Roles } from '../auth/decorators/roles.decorator'
import { ApiKeyGuard } from '../auth/guards/api-key.guard'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { GetMachine } from '../machines/decorators/get-machine.decorator'

@Controller(GATEWAY_ROUTES.LOGS)
export class IngestionController implements OnModuleInit {
	private readonly logger = new Logger(IngestionController.name)

	constructor(
		@Inject(LOG_SERVICE) private readonly rmqClient: ClientProxy,
		private readonly config: ConfigService
	) {}

	async onModuleInit() {
		try {
			const { RMQ_USER, RMQ_PASSWORD, RMQ_PORT, RMQ_VHOST, RMQ_HOST } = ENV_VARS

			const rmqUser = this.config.getOrThrow<string>(RMQ_USER)
			const rmqPassword = this.config.getOrThrow<string>(RMQ_PASSWORD)
			const rmqPort = this.config.getOrThrow<string>(RMQ_PORT)
			const rmqVhost = this.config.getOrThrow<string>(RMQ_VHOST)
			const rmqHost = this.config.getOrThrow<string>(RMQ_HOST)

			const rmqUrl = `amqp://${rmqUser}:${rmqPassword}@${rmqHost}:${rmqPort}/${rmqVhost}`

			await validateRmqTopology(rmqUrl)

			this.logger.log('✅ RabbitMQ Topology (Exchanges/Queues) verified and created.')
		} catch (error) {
			this.logger.error('❌ Failed to setup RabbitMQ topology', error)
		}
	}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(eUserRole.USER, eUserRole.ADMIN)
	async createLog(@Body() log: CreateLogDto, @Req() req: Request) {
		this.logger.log('Receiving new log event via HTTP')

		const ip = log.sourceIp || req.ip || req.headers['x-forwarded-for']

		const logWithData = {
			...log,
			sourceIp: ip,
			createdAt: log.createdAt || new Date().toISOString()
		} as CreateLogDto

		this.rmqClient.emit(LOG_PATTERNS.NEW_LOG, logWithData)

		return { message: 'Log accepted' }
	}

	@Post(GATEWAY_ROUTES.INGEST)
	@UseGuards(ApiKeyGuard)
	async ingestLog(
		@Body() log: CreateLogDto,
		@GetMachine('name') machineName: string,
		@Req() req: Request
	) {
		this.logger.log(`Receiving new log event from machine: ${machineName}`)

		const sourceIp =
			log.sourceIp ||
			(req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
			req.socket.remoteAddress

		const logWithData = {
			...log,
			sourceIp,
			createdAt: log.createdAt || new Date().toISOString()
		} as CreateLogDto

		this.rmqClient.emit(LOG_PATTERNS.NEW_LOG, logWithData)

		return { message: 'Log accepted' }
	}
}
