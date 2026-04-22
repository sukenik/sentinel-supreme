import { GoogleGenAI } from '@google/genai'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { eAvailableModles, iAvailableModel } from '../ai.types'
import { DEFAULT_AI_CONFIG, ENV_VARS } from '../consts'
import { AiConfigEntity } from './entities/ai-config.entity'

@Injectable()
export class AiConfigService {
	private readonly logger = new Logger(AiConfigService.name)

	constructor(
		@InjectRepository(AiConfigEntity)
		private readonly repo: Repository<AiConfigEntity>,
		private readonly config: ConfigService
	) {}

	async onModuleInit() {
		await this.ensureConfigExists()
	}

	private async ensureConfigExists() {
		const count = await this.repo.count()

		if (count === 0) {
			this.logger.log('🚀 Initializing default AI configuration...')
			await this.repo.save(DEFAULT_AI_CONFIG)
		}
	}

	async get(): Promise<AiConfigEntity> {
		const config = await this.repo.findOne({
			where: {},
			order: { updatedAt: 'DESC' }
		})

		if (!config) throw new Error('AI Config missing even after initialization')

		return config
	}

	async update(id: string, dto: Partial<AiConfigEntity>): Promise<AiConfigEntity> {
		await this.repo.update(id, dto)
		return this.get()
	}

	async incrementTokens(id: string, amount: number) {
		return this.repo.increment({ id }, 'totalTokensUsed', amount)
	}

	async getAvailableModels(): Promise<iAvailableModel[]> {
		const apiKey = this.config.getOrThrow<string>(ENV_VARS.GEMINI_API_KEY)
		const ai = new GoogleGenAI({ apiKey })

		const models = await ai.models.list()
		const relevantModels = []

		for await (const model of models) {
			const modelName = model.name?.split('models/')[1] || ''

			if ((Object.values(eAvailableModles) as string[]).includes(modelName)) {
				relevantModels.push({
					name: modelName as eAvailableModles,
					displayName: model.displayName || ''
				})
			}
		}

		return relevantModels
	}
}
