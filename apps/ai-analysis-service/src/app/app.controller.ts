import { Controller } from '@nestjs/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { AI_ANALYSIS_PATTERNS, iLog } from '@sentinel-supreme/shared'
import { AiAnalysisService } from './ai-analysis/ai-analysis.service'

@Controller()
export class AppController {
	constructor(private readonly aiService: AiAnalysisService) {}

	@MessagePattern(AI_ANALYSIS_PATTERNS.ANALYZE_LOGS)
	async handleLogAnalysis(@Payload() data: iLog[], @Ctx() context: RmqContext) {
		const channel = context.getChannelRef()
		const originalMsg = context.getMessage()

		try {
			const summary = (await this.aiService.analyzeLogs(data)) as string

			console.log('AI Summary:', summary.replace(/\n/g, ' '))

			channel.ack(originalMsg)

			return summary
		} catch (error) {
			const { message } = error as { message: string }

			console.error('AI Analysis failed', error)
			channel.nack(originalMsg, false, false)

			return { error: 'Analysis failed', message }
		}
	}
}
