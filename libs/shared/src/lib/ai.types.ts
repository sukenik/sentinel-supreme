export interface iAiInsight {
	tokensUsed: number
	generatedAt: string
	content: string
	model: string
	similarPatterns?: iSimilarPattern[]
}

export interface iAiConfig {
	id: string
	analysisAi: iModelConfig
	chatAi: iModelConfig
	totalTokensUsed: number
	updatedAt: Date
}

export enum eAvailableModles {
	GEMINI_2_5_FLASH = 'gemini-2.5-flash',
	GEMINI_3_FLASH_PREVIEW = 'gemini-3-flash-preview',
	GEMINI_3_1_FLASH_LITE_PREVIEW = 'gemini-3.1-flash-lite-preview',
	GEMINI_2_5_FLASH_LITE = 'gemini-2.5-flash-lite'
}

export interface iModelConfig {
	modelName: eAvailableModles
	systemPrompt: string
	temperature: number
}

export interface iAvailableModel {
	name: eAvailableModles
	displayName: string
}

export interface iAiChatChunk {
	userId: string
	isFinal: boolean
	hasUsedTools?: boolean
	content?: string
	tokensUsed?: number
}

export interface iSimilarPattern {
	logId: string
	summary: string
	score: number
}
