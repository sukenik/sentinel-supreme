import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { AiChatAgentService } from './ai-chat-agent.service'

@Controller()
export class AiChatAgentController {
	constructor(private readonly aiChatService: AiChatAgentService) {}

	@MessagePattern({ cmd: 'chat_command' })
	async handleChat(@Payload() data: { prompt: string }) {
		return this.aiChatService.chat(data.prompt)
	}
}
