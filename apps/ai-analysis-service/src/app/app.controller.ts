import { Controller, Inject, Logger } from '@nestjs/common'
import { ClientProxy, Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { AI_ANALYSIS_PATTERNS, iLog } from '@sentinel-supreme/shared'
import { AiAnalysisService } from './ai-analysis/ai-analysis.service'
import { AI_ANALYSIS_CLIENT } from './consts'

@Controller()
export class AppController {
	private readonly logger = new Logger(AppController.name)

	constructor(
		@Inject(AI_ANALYSIS_CLIENT) private readonly client: ClientProxy,
		private readonly aiService: AiAnalysisService
	) {}

	@MessagePattern(AI_ANALYSIS_PATTERNS.ANALYZE_LOGS)
	async handleLogAnalysis(
		@Payload() data: { logs: iLog[]; alertId: string },
		@Ctx() context: RmqContext
	) {
		const channel = context.getChannelRef()
		const originalMsg = context.getMessage()

		try {
			this.logger.log(`AI Analysis starting for alert: ${data.alertId}`)

			const summary = await this.aiService.analyzeLogs(data.logs)

			channel.ack(originalMsg)

			this.logger.log(`AI Analysis finished for alert: ${data.alertId}`)

			this.client.emit(AI_ANALYSIS_PATTERNS.ANALYSIS_COMPLETED, {
				alertId: data.alertId,
				summary
			})
		} catch (error) {
			this.logger.error('AI Analysis failed', error)
			channel.nack(originalMsg, false, false)
		}
	}
}
