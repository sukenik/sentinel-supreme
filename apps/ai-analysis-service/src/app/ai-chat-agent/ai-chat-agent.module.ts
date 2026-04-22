import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { QUEUES } from '@sentinel-supreme/shared'
import { AiConfigModule, Log, LogSchema, SharedRmqModule } from '@sentinel-supreme/shared/server'
import { AI_CHAT_CLIENT } from '../consts'
import { AiChatAgentController } from './ai-chat-agent.controller'
import { AiChatAgentProvider } from './ai-chat-agent.provider'
import { AiChatAgentService } from './ai-chat-agent.service'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
		SharedRmqModule.register(AI_CHAT_CLIENT, QUEUES.AI_CHAT_RESPONSE),
		AiConfigModule
	],
	controllers: [AiChatAgentController],
	providers: [AiChatAgentService, AiChatAgentProvider],
	exports: [AiChatAgentService]
})
export class AiChatAgentModule {}
