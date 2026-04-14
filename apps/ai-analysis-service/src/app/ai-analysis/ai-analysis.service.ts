import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ENV_VARS, iLog } from '@sentinel-supreme/shared'

@Injectable()
export class AiAnalysisService {
	private model: ChatGoogleGenerativeAI

	constructor(private readonly config: ConfigService) {
		const geminiApiKey = this.config.getOrThrow<string>(ENV_VARS.GEMINI_API_KEY)
		this.model = new ChatGoogleGenerativeAI({
			apiKey: geminiApiKey,
			model: 'gemini-2.5-flash'
		})
	}

	async analyzeLogs(logs: iLog[]) {
		const logContext = JSON.stringify(logs)

		const response = await this.model.invoke([
			new SystemMessage(`
				You are a senior SOC analyst.
				Analyze the following logs and provide a brief, human-readable summary of the security situation.
				If you see a threat, explain it simply.
			`),
			new HumanMessage(`Here are the logs: ${logContext}`)
		])

		const content = response.content

		if (typeof content === 'string') {
			return content
		}

		if (Array.isArray(content)) {
			return content.map((part) => ('text' in part ? part.text : '')).join('')
		}

		return String(content)
	}
}
