import { Controller, Inject, Logger } from '@nestjs/common'
import { ClientProxy, Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'
import { AI_ANALYSIS_PATTERNS, LOG_PATTERNS } from '@sentinel-supreme/shared'
import { AlertsService } from '@sentinel-supreme/shared/server'
import { ALERTS_CLIENT } from '../consts'

@Controller()
export class AiAnalysisController {
	private readonly logger = new Logger(AiAnalysisController.name)

	constructor(
		private readonly alertsService: AlertsService,
		@Inject(ALERTS_CLIENT) private readonly alertsClient: ClientProxy
	) {}

	@EventPattern(AI_ANALYSIS_PATTERNS.ANALYSIS_COMPLETED)
	async handleAnalysisCompleted(
		@Payload() data: { alertId: string; summary: string },
		@Ctx() context: RmqContext
	) {
		const channel = context.getChannelRef()
		const originalMsg = context.getMessage()

		const { alertId, summary } = data

		try {
			await this.alertsService.updateAiInsight(alertId, summary)
			channel.ack(originalMsg)
		} catch (error) {
			this.logger.error('AI Analysis failed', error)
			channel.nack(originalMsg, false, false)
		} finally {
			this.alertsClient.emit(LOG_PATTERNS.ALERT_UPDATED, {
				id: alertId,
				aiInsight: summary
			})
		}
	}
}
