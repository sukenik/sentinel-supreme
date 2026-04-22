import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { GATEWAY_ROUTES } from '@sentinel-supreme/shared'
import { JwtAuthGuard } from '@sentinel-supreme/shared/server'
import { AiManagerService } from './ai-chat-manager.service'

@Controller(GATEWAY_ROUTES.AI_CHAT)
@UseGuards(JwtAuthGuard)
export class AiChatManagerController {
	constructor(private readonly aiAssistantService: AiManagerService) {}

	@Post()
	async chatWithAi(@Body() body: { message: string }) {
		if (!body.message) {
			throw new HttpException('Message is required', HttpStatus.BAD_REQUEST)
		}

		try {
			const response = await this.aiAssistantService.getAiResponse(body.message)

			return {
				success: true,
				answer: response
			}
		} catch (error) {
			throw new HttpException(
				`AI Service is currently unavailable or taking too long, error: ${error}`,
				HttpStatus.GATEWAY_TIMEOUT
			)
		}
	}
}
