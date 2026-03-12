import { Controller, Logger } from '@nestjs/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { CreateLogDto, LOG_PATTERNS } from '@sentinel-supreme/shared'
import { LogsService } from './logs.service'

@Controller('logs')
export class LogsController {
	private readonly logger = new Logger(LogsController.name)

	constructor(private readonly logsService: LogsService) {}

	@MessagePattern(LOG_PATTERNS.NEW_LOG)
	async handleLogMessage(@Payload() data: CreateLogDto, @Ctx() context: RmqContext) {
		const channel = context.getChannelRef()
		const originalMsg = context.getMessage()

		try {
			await this.logsService.saveLog(data)

			channel.ack(originalMsg)
		} catch (error) {
			this.logger.error('❌ Processing failed, sending to DLX...', error)

			channel.nack(originalMsg, false, false)
		}
	}
}
