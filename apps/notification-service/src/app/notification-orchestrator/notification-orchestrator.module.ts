import { Module } from '@nestjs/common'
import { DiscordProvider } from '../providers/discord.provider'
import { EmailProvider } from '../providers/email.provider'
import { SlackProvider } from '../providers/slack.provider'
import { NotificationOrchestrator } from './notification-orchestrator.service'

@Module({
	providers: [NotificationOrchestrator, EmailProvider, SlackProvider, DiscordProvider],
	exports: [NotificationOrchestrator]
})
export class NotificationOrchestratorModule {}
