import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ENV_VARS, eSeverity } from '@sentinel-supreme/shared'
import { SendNotificationDto } from '@sentinel-supreme/shared/server'
import axios from 'axios'
import { iNotificationProvider } from './notification-provider.interface'

@Injectable()
export class SlackProvider implements iNotificationProvider {
	private readonly logger = new Logger(SlackProvider.name)
	private readonly webhookUrl: string

	constructor(private configService: ConfigService) {
		this.webhookUrl = this.configService.getOrThrow<string>(ENV_VARS.SLACK_WEBHOOK_URL)
	}

	async send(data: SendNotificationDto): Promise<void> {
		const { title, message, severity } = data

		const icon = severity === eSeverity.CRITICAL ? '🔥' : '⚠️'

		try {
			await axios.post(this.webhookUrl, {
				blocks: [
					{
						type: 'header',
						text: { type: 'plain_text', text: `${icon} ${title}` }
					},
					{
						type: 'section',
						fields: [
							{ type: 'mrkdwn', text: `*Severity:*\n${severity.toUpperCase()}` },
							{ type: 'mrkdwn', text: `*Time:*\n${new Date().toLocaleString()}` }
						]
					},
					{
						type: 'section',
						text: { type: 'mrkdwn', text: `*Message:*\n${message}` }
					},
					{
						type: 'divider'
					},
					{
						type: 'context',
						elements: [
							{ type: 'mrkdwn', text: '🛡️ *Sentinel Supreme Monitoring System*' }
						]
					}
				]
			})
			this.logger.log('✅ Notification sent to Slack')
		} catch (error) {
			const { response, message } = error as { response: { data: object }; message: string }

			this.logger.error('❌ Failed to send Slack notification', response?.data || message)
			throw error
		}
	}
}
