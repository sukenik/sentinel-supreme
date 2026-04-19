import { ContentBlock, HumanMessage, SystemMessage } from '@langchain/core/messages'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ENV_VARS, iAiInsight, iLog } from '@sentinel-supreme/shared'

@Injectable()
export class AiAnalysisService {
	private MODEL_NAME = 'gemini-2.5-flash'
	private model: ChatGoogleGenerativeAI

	constructor(private readonly config: ConfigService) {
		const geminiApiKey = this.config.getOrThrow<string>(ENV_VARS.GEMINI_API_KEY)
		this.model = new ChatGoogleGenerativeAI({
			apiKey: geminiApiKey,
			model: this.MODEL_NAME,
			temperature: 0.1
		})
	}

	async analyzeLogs(logs: iLog[]): Promise<iAiInsight> {
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
				You are a Senior SOC (Security Operations Center) Analyst at Sentinel Supreme.
				Your task is to analyze security logs and provide actionable insights.

				### OUTPUT GUIDELINES:
				1. **Format**: Use strict Markdown formatting.
				2. **Tone**: Professional, concise, and technical yet accessible.
				3. **Sections**: You must include the following three sections:

				---
				### 📝 SUMMARY
				[1-2 sentences explaining the detected pattern or event. Use **bold** for key entities like IPs, Usernames, or File Paths.]

				### ⚠️ RISK LEVEL
				[Specify: **Low**, **Medium**, **High**, or **Critical**]
				[Briefly explain *why* this risk level was chosen.]

				### 💡 RECOMMENDATION
				- [Immediate Action 1]
				- [Immediate Action 2 (if applicable)]
				
				---
				### VISUAL CUES:
				- Use 🛡️ for system protection notes.
				- Use 🚩 for red flags.
				- Use ⚡ for immediate actions.

				**Important**: Output ONLY the Markdown content. Do not include introductory or concluding remarks.
			`),
			new HumanMessage(`
                Analyze the following ${isBatch ? 'batch of ' + logs.length : 'single'} logs:
                ${JSON.stringify(logContext)}
            `)
		])

		const tokensUsed = response.usage_metadata?.total_tokens || 0
		const summary = this.extractContent(response.content)

		return {
			tokensUsed,
			generatedAt: new Date().toISOString(),
			content: summary,
			model: this.MODEL_NAME
		}
	}

	private extractContent(content: string | (ContentBlock | ContentBlock.Text)[]): string {
		if (typeof content === 'string') return content

		if (Array.isArray(content)) {
			return content.map((part) => ('text' in part ? part.text : '')).join('')
		}

		return String(content)
	}
}
