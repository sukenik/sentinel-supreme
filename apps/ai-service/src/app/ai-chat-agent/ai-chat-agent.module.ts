import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PROMETHEUS_METRICS, QUEUES } from '@sentinel-supreme/shared'
import { AiConfigModule, Log, LogSchema, SharedRmqModule } from '@sentinel-supreme/shared/server'
import { makeCounterProvider } from '@willsoto/nestjs-prometheus'
import { AI_CHAT_CLIENT } from '../consts'
import { GeminiEmbeddingModule } from '../gemini-embedding/gemini-embedding.module'
import { VectorDbModule } from '../vector-db/vector-db.module'
import { AiChatAgentController } from './ai-chat-agent.controller'
import { AiChatAgentProvider } from './ai-chat-agent.provider'
import { AiChatAgentService } from './ai-chat-agent.service'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
		SharedRmqModule.register(AI_CHAT_CLIENT, QUEUES.AI_CHAT_RESPONSE),
		AiConfigModule,
		GeminiEmbeddingModule,
		VectorDbModule
	],
	controllers: [AiChatAgentController],
	providers: [
		makeCounterProvider({
			name: PROMETHEUS_METRICS.AI_CHAT_REQUESTS_TOTAL,
			help: 'Total number of AI chat requests'
		}),
		makeCounterProvider({
			name: PROMETHEUS_METRICS.AI_SEMANTIC_CACHE_HITS_TOTAL,
			help: 'Total number of semantic cache hits'
		}),
		makeCounterProvider({
			name: PROMETHEUS_METRICS.AI_TOKENS_CONSUMED_TOTAL,
			help: 'Total tokens consumed by AI model'
		}),
		AiChatAgentService,
		AiChatAgentProvider
	],
	exports: [AiChatAgentService]
})
export class AiChatAgentModule {}
