import { ContentBlock, HumanMessage, SystemMessage } from '@langchain/core/messages'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ENV_VARS, iAiInsight, iLog } from '@sentinel-supreme/shared'
import { AiConfigService } from '@sentinel-supreme/shared/server'

@Injectable()
export class AiAnalysisService {
	constructor(
		private readonly config: ConfigService,
		private readonly aiConfigService: AiConfigService
	) {}

	async analyzeLogs(logs: iLog[]): Promise<iAiInsight> {
		const { id, analysisAi } = await this.aiConfigService.get()

		const apiKey = this.config.getOrThrow<string>(ENV_VARS.GEMINI_API_KEY)
		const dynamicModel = new ChatGoogleGenerativeAI({
			apiKey,
			temperature: analysisAi.temperature,
			model: analysisAi.modelName
		})

		const logContext = logs.map((l) => ({
			timestamp: l.createdAt,
			level: l.level,
			service: l.service,
			message: l.message,
			sourceIp: l.sourceIp,
			metadata: l.metadata
		}))

		const isBatch = logs.length > 1

		const response = await dynamicModel.invoke([
			new SystemMessage(analysisAi.systemPrompt),
			new HumanMessage(`
                Analyze the following ${isBatch ? 'batch of ' + logs.length : 'single'} logs:
                ${JSON.stringify(logContext)}
            `)
		])

		const tokensUsed = response.usage_metadata?.total_tokens || 0
		const summary = this.extractContent(response.content)

		this.aiConfigService.incrementTokens(id, tokensUsed)

		return {
			tokensUsed,
			generatedAt: new Date().toISOString(),
			content: summary,
			model: analysisAi.modelName
		}
	}

	private extractContent(content: string | (ContentBlock | ContentBlock.Text)[]): string {
		if (typeof content === 'string') return content

		if (Array.isArray(content)) {
			return content.map((part) => ('text' in part ? part.text : '')).join('')
		}

		return String(content)
	}
}
