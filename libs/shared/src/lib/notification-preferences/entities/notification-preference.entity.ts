import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
import { eSeverity } from '../../rules.types'
import { eNotificationChannel, iNotificationPreference } from '../../types'

@Entity('notification_preferences')
@Index(['userEmail', 'severity', 'channel'], { unique: true })
export class NotificationPreferenceEntity implements iNotificationPreference {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column()
	userEmail!: string

	@Column({ type: 'enum', enum: eSeverity })
	severity!: eSeverity

	@Column({ type: 'enum', enum: eNotificationChannel })
	channel!: eNotificationChannel

	@Column({ default: true })
	isEnabled!: boolean
}
