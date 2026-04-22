import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AiConfigModule, Log, LogSchema } from '@sentinel-supreme/shared/server'
import { AiChatAgentController } from './ai-chat-agent.controller'
import { AiChatAgentProvider } from './ai-chat-agent.provider'
import { AiChatAgentService } from './ai-chat-agent.service'

@Module({
	imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]), AiConfigModule],
	controllers: [AiChatAgentController],
	providers: [AiChatAgentService, AiChatAgentProvider],
	exports: [AiChatAgentService]
})
export class AiChatAgentModule {}
