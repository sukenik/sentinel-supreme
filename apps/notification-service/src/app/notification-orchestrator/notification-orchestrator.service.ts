import { Injectable, Logger } from '@nestjs/common'
import { eNotificationChannel } from '@sentinel-supreme/shared'
import { SendNotificationDto } from '@sentinel-supreme/shared/server'
import { DiscordProvider } from '../providers/discord.provider'
import { EmailProvider } from '../providers/email.provider'
import { SlackProvider } from '../providers/slack.provider'

@Injectable()
export class NotificationOrchestrator {
	private readonly logger = new Logger(NotificationOrchestrator.name)

	constructor(
		private readonly emailProvider: EmailProvider,
		private readonly slackProvider: SlackProvider,
		private readonly discordProvider: DiscordProvider
	) {}

	async process(data: SendNotificationDto) {
		const channels = data.channels || [eNotificationChannel.EMAIL]

		const promises = channels.map((channel) => {
			switch (channel) {
				case eNotificationChannel.EMAIL:
					return this.emailProvider.send(data)
				case eNotificationChannel.SLACK:
					return this.slackProvider.send(data)
				case eNotificationChannel.DISCORD:
					return this.discordProvider.send(data)
				default:
					this.logger.warn(`Unknown channel: ${channel}`)
					return Promise.resolve()
			}
		})

		await Promise.all(promises)
	}
}
