import { Column, Entity, PrimaryColumn } from 'typeorm'
import { eSeverity } from '../../rules.types'
import { iAlert } from '../../types'

@Entity('alerts')
export class AlertEntity implements iAlert {
	@PrimaryColumn('uuid')
	id!: string

	@Column()
	ruleId!: string

	@Column()
	ruleName!: string

	@Column({
		type: 'enum',
		enum: eSeverity
	})
	severity!: eSeverity

	@Column('text')
	message!: string

	@Column()
	triggerLogFingerprint!: string

	@Column()
	createdAt!: string

	@Column({ default: false })
	isRead!: boolean

	@Column({ type: 'jsonb', nullable: true })
	reputationData?: any
}
