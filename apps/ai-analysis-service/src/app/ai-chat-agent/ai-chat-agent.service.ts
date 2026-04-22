import { HumanMessage } from '@langchain/core/messages'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { AI_CHAT_PATTERNS, iAiChatChunk } from '@sentinel-supreme/shared'
import { AI_CHAT_CLIENT, CHAT_AGENT } from '../consts'

@Injectable()
export class AiChatAgentService {
	private readonly logger = new Logger(AiChatAgentService.name)

	constructor(
		@Inject(CHAT_AGENT) private readonly agent: any,
		@Inject(AI_CHAT_CLIENT) private readonly client: ClientProxy
	) {}

	async chatStream(userMessage: string, userId: string) {
		const { CHUNK, ERROR } = AI_CHAT_PATTERNS
		this.logger.log(`Streaming starting for user: ${userId}`)

		try {
			const stream = await this.agent.stream(
				{ messages: [new HumanMessage(userMessage)] },
				{ streamMode: 'messages' }
			)

			for await (const [chunk] of stream) {
				if (chunk.content) {
					this.client.emit(CHUNK, {
						userId,
						content: chunk.content,
						isFinal: false
					} as iAiChatChunk)
				}
			}

			this.client.emit(CHUNK, { userId, isFinal: true } as iAiChatChunk)

			this.logger.log(`Streaming finished for user: ${userId}`)
		} catch (error) {
			const { stack } = error as { stack: string }
			this.logger.error('Error during AI Streaming', stack)
			this.client.emit(ERROR, { userId, error: 'Neural link failed' })
		}
	}
}
