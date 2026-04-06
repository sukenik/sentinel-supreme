import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
import { eRuleOperator, eRuleType, eSeverity } from '../../rules.types'

@Entity('rules')
@Index(['isActive'], { where: '"isActive" = true' })
export class RuleEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column()
	name!: string

	@Column()
	description!: string

	@Column({ type: 'enum', enum: eRuleType })
	type!: eRuleType

	@Column({ type: 'enum', enum: eRuleOperator })
	operator!: eRuleOperator

	@Column()
	field!: string

	@Column()
	value!: string

	@Column({ type: 'enum', enum: eSeverity })
	severity!: eSeverity

	@Column({ default: true })
	isActive!: boolean

	@Column({ nullable: true })
	limit?: number

	@Column({ nullable: true })
	windowSeconds?: number

	@Column({ nullable: true })
	groupBy?: string
}
