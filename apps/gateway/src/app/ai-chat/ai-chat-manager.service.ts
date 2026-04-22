import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { AI_CHAT_PATTERNS } from '@sentinel-supreme/shared'
import { AI_CHAT_REQUEST_CLIENT } from '../consts'

@Injectable()
export class AiManagerService {
	private readonly logger = new Logger(AiManagerService.name)

	constructor(@Inject(AI_CHAT_REQUEST_CLIENT) private readonly aiClient: ClientProxy) {}

	async requestAiStreamingResponse(userId: string, message: string) {
		try {
			this.logger.log(`Requesting streaming response for user: ${userId}`)

			this.aiClient.emit(AI_CHAT_PATTERNS.REQUEST, {
				prompt: message,
				userId
			})
		} catch (error) {
			const { message } = error as { message: string }
			this.logger.error(`Failed to emit streaming request: ${message}`)
			throw error
		}
	}
}
