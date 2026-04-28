import { HumanMessage } from '@langchain/core/messages'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { AI_CHAT_PATTERNS, iAiChatChunk } from '@sentinel-supreme/shared'
import { AiConfigService } from '@sentinel-supreme/shared/server'
import { v4 as uuidv4 } from 'uuid'
import { AI_CHAT_CLIENT, CHAT_AGENT } from '../consts'
import { GeminiEmbeddingService } from '../gemini-embedding/gemini-embedding.service'
import { eVectorCollection } from '../types'
import { VectorDbService } from '../vector-db/vector-db.service'

@Injectable()
export class AiChatAgentService {
	private readonly logger = new Logger(AiChatAgentService.name)

	constructor(
		@Inject(CHAT_AGENT) private readonly agent: any,
		@Inject(AI_CHAT_CLIENT) private readonly client: ClientProxy,
		private readonly aiConfigService: AiConfigService,
		private readonly embeddingService: GeminiEmbeddingService,
		private readonly vectorDb: VectorDbService
	) {}

	async chatStream(userMessage: string, userId: string) {
		const { CHUNK, ERROR } = AI_CHAT_PATTERNS
		let totalTokens = 0
		let fullResponseContent = ''
		let userMessageVector: number[] | null = null

		this.logger.log(`Streaming starting for user: ${userId}`)

		try {
			const config = await this.aiConfigService.get()

			if (config.chatAi.useSemanticCache) {
				userMessageVector = await this.embeddingService.embedText(userMessage)
				const cachedResponse = await this.vectorDb.searchSimilar(
					eVectorCollection.CHAT_CACHE,
					userMessageVector,
					1
				)

				if (cachedResponse.length > 0 && cachedResponse[0].score > 0.96) {
					this.logger.log(`[Semantic Cache] Hit! Similarity: ${cachedResponse[0].score}`)
					const cachedText = cachedResponse[0].payload!.response as string

					this.client.emit(CHUNK, {
						userId,
						content: cachedText,
						isFinal: true,
						tokensUsed: 0
					} as iAiChatChunk)

					return
				}
			}

			const eventStream = await this.agent.streamEvents(
				{ messages: [new HumanMessage(userMessage)] },
				{
					version: 'v2',
					configurable: { thread_id: userId }
				}
			)

			for await (const event of eventStream) {
				const eventType = event.event

				if (eventType === 'on_chat_model_end') {
					const usage = event.data.output?.usage_metadata
					const toolCalls = event.data.output?.tool_calls

					if (toolCalls && toolCalls.length > 0) {
						this.client.emit(CHUNK, {
							userId,
							content: '',
							hasUsedTools: true,
							isFinal: false
						} as iAiChatChunk)
					}

					if (usage) {
						totalTokens += usage.total_tokens || 0
					}
				}

				if (eventType === 'on_chat_model_stream') {
					const content = event.data.chunk?.content

					if (content) {
						fullResponseContent += content

						this.client.emit(CHUNK, {
							userId,
							content,
							isFinal: false
						} as iAiChatChunk)
					}
				}
			}

			this.client.emit(CHUNK, {
				userId,
				isFinal: true,
				tokensUsed: totalTokens
			} as iAiChatChunk)

			if (config.chatAi.useSemanticCache && fullResponseContent.length > 0) {
				const vectorToSave =
					userMessageVector || (await this.embeddingService.embedText(userMessage))

				await this.vectorDb.upsert(eVectorCollection.CHAT_CACHE, uuidv4(), vectorToSave, {
					question: userMessage,
					response: fullResponseContent,
					createdAt: new Date().toISOString()
				})
			}

			if (totalTokens > 0) {
				await this.aiConfigService.incrementTokens(config.id, totalTokens)
			}
		} catch (error) {
			const { stack } = error as { stack: string }
			this.logger.error('Error during AI Streaming', stack)
			this.client.emit(ERROR, { userId, error: 'Neural link failed' })
		}

		this.logger.log(`Streaming ended for user: ${userId}`)
	}
}
