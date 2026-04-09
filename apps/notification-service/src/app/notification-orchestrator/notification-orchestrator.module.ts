import { Module } from '@nestjs/common'
import { EmailProvider } from '../providers/email.provider'
import { SlackProvider } from '../providers/slack.provider'
import { NotificationOrchestrator } from './notification-orchestrator.service'

@Module({
	providers: [NotificationOrchestrator, SlackProvider, EmailProvider],
	exports: [NotificationOrchestrator]
})
export class NotificationOrchestratorModule {}
