import { Module } from '@nestjs/common'
import { QUEUES } from '@sentinel-supreme/shared'
import { SharedRmqModule } from '@sentinel-supreme/shared/server'
import { AI_CLIENT } from '../consts'
import { AiChatManagerController } from './ai-chat-manager.controller'
import { AiManagerService } from './ai-chat-manager.service'

@Module({
	imports: [SharedRmqModule.register(AI_CLIENT, QUEUES.AI_CHAT)],
	providers: [AiManagerService],
	controllers: [AiChatManagerController]
})
export class AiChatManagerModule {}
