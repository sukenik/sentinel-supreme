import { Controller, Logger } from '@nestjs/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { iLog, LOG_PATTERNS } from '@sentinel-supreme/shared'
import { CreateLogDto } from '@sentinel-supreme/shared/server'
import { RulesService } from '../rules/rules.service'
import { LogsService } from './logs.service'

@Controller('logs')
export class LogsController {
	private readonly logger = new Logger(LogsController.name)

	constructor(
		private readonly logsService: LogsService,
		private readonly rulesService: RulesService
	) {}

	@MessagePattern(LOG_PATTERNS.NEW_LOG)
	async handleLogMessage(@Payload() data: CreateLogDto, @Ctx() context: RmqContext) {
		const channel = context.getChannelRef()
		const originalMsg = context.getMessage()

		try {
			const fingerprint = this.logsService.getFingerprint(data)
			const log = { ...data, fingerprint } as iLog

			await this.logsService.saveLog(log)

			channel.ack(originalMsg)

			this.rulesService.evaluateLog(log).catch((err) => {
				this.logger.error(`❌ Rules evaluation failed for log ${log.fingerprint}`, err)
			})
		} catch (error) {
			this.logger.error('❌ Processing failed, sending to DLX...', error)
			channel.nack(originalMsg, false, false)
		}
	}
}
