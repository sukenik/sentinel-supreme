import { ContentBlock, HumanMessage, SystemMessage } from '@langchain/core/messages'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ENV_VARS, iAiInsight, iLog, iSimilarPattern } from '@sentinel-supreme/shared'
import { AiConfigService } from '@sentinel-supreme/shared/server'
import { v4 as uuidv4 } from 'uuid'
import { GeminiEmbeddingService } from '../gemini-embedding/gemini-embedding.service'
import { eVectorCollection } from '../types'
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
		const isBatch = logs.length > 1

		let pastContext = ''
		let similarPatterns: iSimilarPattern[] = []
		let logVector: number[] = []

		try {
			const messageForEmbedding = isBatch
				? `Batch of ${logs.length} logs from ${logs[0].service}`
				: this.cleanLogForEmbedding(logs[0].message)

			logVector = await this.geminiEmbeddingService.embedText(messageForEmbedding)

			const searchResults = await this.vectorDbService.searchSimilar(
				eVectorCollection.THREAT_PATTERNS,
				logVector,
				3
			)

			similarPatterns = searchResults
				.filter((res) => res.score > 0.85)
				.map(({ payload, score }) => ({
					logId: payload!.logId as string,
					summary: payload!.summary as string,
					score
				}))

			if (similarPatterns.length > 0) {
				pastContext = `\n\nCONTEXT FROM PAST SIMILAR INCIDENTS:\n${similarPatterns
					.map((p) => `- ${p.summary}`)
					.join('\n')}`
			}
		} catch (e) {
			this.logger.warn('Enrichment step failed, continuing with standard analysis', e)
		}

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

		const systemPromptWithContext = `${analysisAi.systemPrompt}${pastContext}`

		const response = await dynamicModel.invoke([
			new SystemMessage(systemPromptWithContext),
			new HumanMessage(`
                Analyze the following ${isBatch ? 'batch of ' + logs.length : 'single'} logs:
                ${JSON.stringify(logContext)}
            `)
		])

		const tokensUsed = response.usage_metadata?.total_tokens || 0
		const summary = this.extractContent(response.content)

		this.aiConfigService.incrementTokens(configId, tokensUsed)

		if (logVector.length > 0) {
			await this.vectorDbService
				.upsert(eVectorCollection.THREAT_PATTERNS, uuidv4(), logVector, {
					logId: isBatch ? 'batch' : logs[0].fingerprint,
					summary,
					timestamp: new Date().toISOString(),
					service: isBatch ? 'multiple' : logs[0].service
				})
				.catch((e) => this.logger.error('Failed to save to Vector DB', e))
		}

		return {
			tokensUsed,
			generatedAt: new Date().toISOString(),
			content: summary,
			model: analysisAi.modelName,
			similarPatterns: similarPatterns.length > 0 ? similarPatterns : undefined
		}
	}

	private cleanLogForEmbedding(message: string): string {
		return message
			.replace(/\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(\.\d+)?Z?/g, '')
			.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, 'IP_ADDR')
			.replace(/0x[a-fA-F0-9]+/g, 'HEX_ADDR')
			.trim()
	}

	private extractContent(content: string | (ContentBlock | ContentBlock.Text)[]): string {
		if (typeof content === 'string') return content
		if (Array.isArray(content)) {
			return content.map((part) => ('text' in part ? part.text : '')).join('')
		}
		return String(content)
	}
}
