import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { AI_CHAT_PATTERNS } from '@sentinel-supreme/shared'
import { AiChatAgentService } from './ai-chat-agent.service'

@Controller()
export class AiChatAgentController {
	constructor(private readonly aiChatService: AiChatAgentService) {}

	@EventPattern(AI_CHAT_PATTERNS.REQUEST)
	async handleChat(@Payload() data: { prompt: string; userId: string }) {
		return this.aiChatService.chatStream(data.prompt, data.userId)
	}
}
