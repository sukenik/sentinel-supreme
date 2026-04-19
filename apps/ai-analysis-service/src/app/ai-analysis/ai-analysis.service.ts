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
			model: 'gemini-2.5-flash',
			temperature: 0.1
		})
	}

	async analyzeLogs(logs: iLog[]) {
		const logContext = logs.map((l) => ({
			timestamp: l.createdAt,
			level: l.level,
			service: l.service,
			message: l.message,
			sourceIp: l.sourceIp,
			metadata: l.metadata
		}))

		const isBatch = logs.length > 1

		const response = await this.model.invoke([
			new SystemMessage(`
                You are a Senior SOC (Security Operations Center) Analyst.
                Your task is to analyze the provided logs and generate a professional, concise security summary in ENGLISH.
                
                Guidelines:
                1. Situation Analysis: Explain the pattern you see. If it's a single log, focus on the payload/message. If it's a batch, explain the behavior over time (e.g., Brute Force, Scanning).
                2. Simplicity: Translate technical jargon into clear, actionable insights.
                3. Severity Assessment: Clearly state the risk level.

                Output Format:
                - SUMMARY: [1-2 sentences explaining what happened]
                - RISK LEVEL: [Low / Medium / High / Critical]
                - RECOMMENDATION: [Immediate action for the admin]
            `),
			new HumanMessage(`
                Analyze the following ${isBatch ? 'batch of ' + logs.length : 'single'} logs:
                ${JSON.stringify(logContext)}
            `)
		])

		return this.extractContent(response.content)
	}

	private extractContent(content: any): string {
		if (typeof content === 'string') return content
		if (Array.isArray(content)) {
			return content.map((part) => ('text' in part ? part.text : '')).join('')
		}
		return String(content)
	}
}
