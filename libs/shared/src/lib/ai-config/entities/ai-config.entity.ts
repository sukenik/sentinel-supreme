import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import type { iAiConfig, iChatAiConfig, iModelConfig } from '../../ai.types'

@Entity('ai_config')
export class AiConfigEntity implements iAiConfig {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column({ type: 'jsonb' })
	analysisAi!: iModelConfig

	@Column({ type: 'jsonb' })
	chatAi!: iChatAiConfig

	@Column({ type: 'bigint' })
	totalTokensUsed!: number

	@UpdateDateColumn()
	updatedAt!: Date
}
