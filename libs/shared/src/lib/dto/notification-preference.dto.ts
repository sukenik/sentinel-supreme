import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { eSeverity } from '../rules.types'
import { eNotificationChannel, iNotificationPreference } from '../types'

export class NotificationPreferenceDto implements iNotificationPreference {
	@IsString()
	@IsNotEmpty()
	userEmail!: string

	@IsEnum(eSeverity)
	@IsNotEmpty()
	severity!: eSeverity

	@IsEnum(eNotificationChannel)
	@IsNotEmpty()
	channel!: eNotificationChannel

	@IsBoolean()
	isEnabled!: boolean
}
