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
import { GATEWAY_ROUTES, LOG_PATTERNS } from '@sentinel-supreme/shared'
import { CreateLogDto, SharedRmqModule, validateRmqTopology } from '@sentinel-supreme/shared/server'
import type { Request } from 'express'
import { ApiKeyGuard } from '../auth/guards/api-key.guard'
import { GATEWAY_CLIENT } from '../consts'
import { GetMachine } from '../machines/decorators/get-machine.decorator'

@Controller(GATEWAY_ROUTES.LOGS)
export class IngestionController implements OnModuleInit {
	private readonly logger = new Logger(IngestionController.name)

	constructor(
		@Inject(GATEWAY_CLIENT) private readonly rmqClient: ClientProxy,
		private readonly config: ConfigService
	) {}

	async onModuleInit() {
		try {
			const rmqUrl = SharedRmqModule.getUrl(this.config)

			await validateRmqTopology(rmqUrl)

			this.logger.log('✅ RabbitMQ Topology (Exchanges/Queues) verified and created.')
		} catch (error) {
			this.logger.error('❌ Failed to setup RabbitMQ topology', error)
		}
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
