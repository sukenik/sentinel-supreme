import { SystemMessage } from '@langchain/core/messages'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { END, MessagesAnnotation, START, StateGraph } from '@langchain/langgraph'
import { ToolNode } from '@langchain/langgraph/prebuilt'
import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { getModelToken } from '@nestjs/mongoose'
import { ENV_VARS } from '@sentinel-supreme/shared'
import { AiConfigService, Log } from '@sentinel-supreme/shared/server'
import { Model } from 'mongoose'
import { CHAT_AGENT } from '../consts'
import { createSystemHealthTool } from '../tools/system-logs.tool'

export const AiChatAgentProvider: Provider = {
	provide: CHAT_AGENT,
	inject: [ConfigService, AiConfigService, getModelToken(Log.name)],
	useFactory: async (
		configService: ConfigService,
		aiConfigService: AiConfigService,
		logModel: Model<Log>
	) => {
		const apiKey = configService.getOrThrow<string>(ENV_VARS.GEMINI_API_KEY)
		const tools = [createSystemHealthTool(logModel)]

		const getModel = async () => {
			const { chatAi } = await aiConfigService.get()

			const model = new ChatGoogleGenerativeAI({
				apiKey,
				temperature: chatAi.temperature,
				model: chatAi.modelName,
				streaming: true,
				streamUsage: true
			})

			return { model: model.bindTools(tools), systemPrompt: chatAi.systemPrompt }
		}

		const callModel = async (state: typeof MessagesAnnotation.State) => {
			const { messages } = state

			const { model, systemPrompt } = await getModel()

			const response = await model.invoke([new SystemMessage(systemPrompt), ...messages])

			return { messages: [response] }
		}

		const shouldContinue = (state: typeof MessagesAnnotation.State) => {
			const lastMessage = state.messages[state.messages.length - 1] as any
			return lastMessage.tool_calls?.length ? 'tools' : END
		}

		const workflow = new StateGraph(MessagesAnnotation)
			.addNode('agent', callModel)
			.addNode('tools', new ToolNode(tools))
			.addEdge(START, 'agent')
			.addConditionalEdges('agent', shouldContinue)
			.addEdge('tools', 'agent')

		return workflow.compile()
	}
}
