import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { iAiConfig } from '../../types'

@Entity('ai_config')
export class AiConfigEntity implements iAiConfig {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column()
	modelName!: string

	@Column({ type: 'text' })
	systemMessage!: string

	@Column({ type: 'float' })
	temperature!: number

	@Column({ type: 'bigint' })
	totalTokensUsed!: number

	@UpdateDateColumn()
	updatedAt!: Date
}
