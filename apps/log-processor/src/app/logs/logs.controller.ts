import { Controller } from '@nestjs/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { CreateLogDto, LOG_PATTERNS } from '@sentinel-supreme/shared'
import { LogsService } from './logs.service'

@Controller('logs')
export class LogsController {
	constructor(private readonly logsService: LogsService) {}

	@MessagePattern(LOG_PATTERNS.NEW_LOG)
	async handleLogMessage(@Payload() data: CreateLogDto, @Ctx() context: RmqContext) {
		const channel = context.getChannelRef()
		const originalMsg = context.getMessage()

		try {
			console.log('--- Processing Log and Saving to Mongo ---')

			await this.logsService.saveLog(data)

			if (data.message.includes('fail')) {
				throw new Error('Simulated failure')
			}

			channel.ack(originalMsg)
		} catch (error) {
			console.error('Processing failed, sending to DLX...')
			console.error('Error:', error)

			channel.nack(originalMsg, false, false)
		}
	}
}
