import { HumanMessage } from '@langchain/core/messages'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { CHAT_AGENT } from '../consts'

@Injectable()
export class AiChatAgentService {
	private readonly logger = new Logger(AiChatAgentService.name)

	constructor(@Inject(CHAT_AGENT) private readonly agent: any) {}

	async chat(userMessage: string) {
		this.logger.log('AI Analysis starting')

		try {
			const finalState = await this.agent.invoke({
				messages: [new HumanMessage(userMessage)]
			})

			this.logger.log('AI Analysis finished')

			const messages = finalState.messages
			return messages[messages.length - 1].content
		} catch (error) {
			const { stack } = error as { stack: string }
			this.logger.error('Error during AI Analysis', stack)
			throw error
		}
	}
}
