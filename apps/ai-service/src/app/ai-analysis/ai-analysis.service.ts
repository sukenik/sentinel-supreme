import { ContentBlock, HumanMessage, SystemMessage } from '@langchain/core/messages'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ENV_VARS, iAiInsight, iLog, iSimilarPattern } from '@sentinel-supreme/shared'
import { AiConfigService } from '@sentinel-supreme/shared/server'
import { v4 as uuidv4 } from 'uuid'
import { GeminiEmbeddingService } from '../gemini-embedding/gemini-embedding.service'
import { VectorDbService } from '../vector-db/vector-db.service'

@Injectable()
export class AiAnalysisService {
	private readonly logger = new Logger(AiAnalysisService.name)

	constructor(
		private readonly config: ConfigService,
		private readonly aiConfigService: AiConfigService,
		private readonly geminiEmbeddingService: GeminiEmbeddingService,
		private readonly vectorDbService: VectorDbService
	) {}

	async analyzeLogs(logs: iLog[]): Promise<iAiInsight> {
		const { id: configId, analysisAi } = await this.aiConfigService.get()

		const apiKey = this.config.getOrThrow<string>(ENV_VARS.GEMINI_API_KEY)
		const dynamicModel = new ChatGoogleGenerativeAI({
			apiKey,
			temperature: analysisAi.temperature,
			model: analysisAi.modelName
		})

		const logContext = logs.map((l) => ({
			id: l.fingerprint,
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

		this.aiConfigService.incrementTokens(configId, tokensUsed)

		const similarPatterns = await this.getSimilarPatterns(summary, isBatch, logs)

		return {
			tokensUsed,
			generatedAt: new Date().toISOString(),
			content: summary,
			model: analysisAi.modelName,
			similarPatterns: similarPatterns.length > 0 ? similarPatterns : undefined
		}
	}

	private extractContent(content: string | (ContentBlock | ContentBlock.Text)[]): string {
		if (typeof content === 'string') return content

		if (Array.isArray(content)) {
			return content.map((part) => ('text' in part ? part.text : '')).join('')
		}

		return String(content)
	}

	private async getSimilarPatterns(
		summary: string,
		isBatch: boolean,
		logs: iLog[]
	): Promise<iSimilarPattern[]> {
		let similarPatterns = [] as iSimilarPattern[]

		try {
			const vector = await this.geminiEmbeddingService.embedText(summary)

			const searchResults = await this.vectorDbService.searchSimilarThreats(vector, 3)

			similarPatterns = searchResults
				.filter((res) => res.score > 0.85)
				.map(({ payload, score }) => ({
					logId: payload!.logId as string,
					summary: payload!.summary as string,
					score
				}))

			await this.vectorDbService.upsertThreat(uuidv4(), vector, {
				logId: isBatch ? 'batch' : logs[0].fingerprint,
				summary,
				timestamp: new Date().toISOString(),
				service: isBatch ? 'multiple' : logs[0].service
			})
		} catch (error) {
			this.logger.error('Failed to process vector embeddings', error)
		}

		return similarPatterns
	}
}
