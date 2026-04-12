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
		const { recipients } = data

		if (!recipients || recipients.length === 0) {
			this.logger.warn('No recipients found for notification')
			return
		}

		const providersMap = {
			[eNotificationChannel.EMAIL]: this.emailProvider,
			[eNotificationChannel.SLACK]: this.slackProvider,
			[eNotificationChannel.DISCORD]: this.discordProvider
		}

		const promises = Object.entries(providersMap).map(([channel, provider]) => {
			const channelRecipients = recipients.filter((r) => r.channel === channel)

			if (channelRecipients.length > 0) {
				return provider.send({ ...data, recipients: channelRecipients })
			}

			return Promise.resolve()
		})

		await Promise.all(promises)
	}
}
