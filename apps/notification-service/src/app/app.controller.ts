import { Controller, Logger } from '@nestjs/common'
import { RmqContext } from '@nestjs/microservices/ctx-host'
import { Ctx, MessagePattern, Payload } from '@nestjs/microservices/decorators'
import { NOTIFICATION_PATTERNS } from '@sentinel-supreme/shared'
import { SendNotificationDto } from '@sentinel-supreme/shared/server'
import { EmailService } from './email/email.service'

@Controller()
export class AppController {
	private readonly logger: Logger = new Logger(AppController.name)

	constructor(private readonly emailService: EmailService) {}

	@MessagePattern(NOTIFICATION_PATTERNS.SEND)
	async handleNotification(@Payload() data: SendNotificationDto, @Ctx() context: RmqContext) {
		const channel = context.getChannelRef()
		const originalMsg = context.getMessage()

		try {
			this.logger.log(`Processing: ${data.title}`)

			await this.emailService.sendCriticalAlert(data)

			channel.ack(originalMsg)
		} catch (error) {
			this.logger.error('Failed to process notification', error)
			channel.nack(originalMsg, false, false)
		}
	}
}
