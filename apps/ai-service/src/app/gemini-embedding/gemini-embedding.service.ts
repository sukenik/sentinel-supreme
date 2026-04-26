import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ENV_VARS } from '@sentinel-supreme/shared'

@Injectable()
export class GeminiEmbeddingService {
	private embeddingsModel: GoogleGenerativeAIEmbeddings

	constructor(private configService: ConfigService) {
		this.embeddingsModel = new GoogleGenerativeAIEmbeddings({
			apiKey: this.configService.getOrThrow(ENV_VARS.GEMINI_API_KEY),
			modelName: 'gemini-embedding-001'
		})
	}

	async embedText(text: string): Promise<number[]> {
		try {
			return await this.embeddingsModel.embedQuery(text)
		} catch (error) {
			console.error('Error generating embedding:', error)
			throw error
		}
	}
}
