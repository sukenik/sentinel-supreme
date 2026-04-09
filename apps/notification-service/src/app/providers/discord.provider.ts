import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ENV_VARS, eSeverity } from '@sentinel-supreme/shared'
import { SendNotificationDto } from '@sentinel-supreme/shared/server'
import axios from 'axios'
import { iNotificationProvider } from './notification-provider.interface'

@Injectable()
export class DiscordProvider implements iNotificationProvider {
	private readonly logger = new Logger(DiscordProvider.name)
	private readonly webhookUrl: string

	constructor(private configService: ConfigService) {
		this.webhookUrl = this.configService.getOrThrow<string>(ENV_VARS.DISCORD_WEBHOOK_URL)
	}

	async send(data: SendNotificationDto): Promise<void> {
		const { title, message, severity } = data

		const color = severity === eSeverity.CRITICAL ? 14753096 : 16105227

		try {
			await axios.post(this.webhookUrl, {
				embeds: [
					{
						title: `🛡️ ${title}`,
						description: message,
						color: color,
						fields: [
							{ name: 'Severity', value: severity.toUpperCase(), inline: true },
							{ name: 'Source', value: 'Sentinel Supreme Engine', inline: true }
						],
						timestamp: new Date().toISOString(),
						footer: { text: 'Log Processor System' }
					}
				]
			})
			this.logger.log('✅ Notification sent to Discord')
		} catch (error) {
			const { message } = error as { message: string }

			this.logger.error('❌ Failed to send Discord notification', message)
			throw error
		}
	}
}
