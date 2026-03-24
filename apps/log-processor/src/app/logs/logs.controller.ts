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

			const logWithId = { ...data, fingerprint } as iLog

			const alerts = await this.rulesService.evaluateLog(logWithId)

			if (alerts.length > 0) {
				// TODO: Save in PG & and send in ws
				// ביינתים רק נדפיס, ביום 4 נשמור ב-Postgres וביום 5 נשלח ב-Socket
				this.logger.debug(
					`🚨 Generated ${alerts.length} alerts for fingerprint: ${fingerprint}`
				)

				// TODO: כאן נשלח את ה-Alerts ל-Postgres בהמשך השבוע
			}

			await this.logsService.saveLog(logWithId)

			channel.ack(originalMsg)
		} catch (error) {
			this.logger.error('❌ Processing failed, sending to DLX...', error)

			channel.nack(originalMsg, false, false)
		}
	}
}
