import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { GATEWAY_ROUTES } from '@sentinel-supreme/shared'
import { JwtAuthGuard } from '@sentinel-supreme/shared/server'
import { GetUser } from '../auth/decorators/get-user.decorator'
import { AiManagerService } from './ai-chat-manager.service'

@Controller(GATEWAY_ROUTES.AI_CHAT)
@UseGuards(JwtAuthGuard)
export class AiChatManagerController {
	constructor(private readonly aiManagerService: AiManagerService) {}

	@Post()
	async chatWithAi(@Body() body: { message: string }, @GetUser('userId') userId: string) {
		if (!body.message) {
			throw new HttpException('Message is required', HttpStatus.BAD_REQUEST)
		}

		try {
			await this.aiManagerService.requestAiStreamingResponse(userId, body.message)

			return {
				success: true,
				message: 'Processing started'
			}
		} catch (error) {
			const { message } = error as { message: string }
			throw new HttpException(
				`Failed to initiate AI stream: ${message}`,
				HttpStatus.INTERNAL_SERVER_ERROR
			)
		}
	}
}
