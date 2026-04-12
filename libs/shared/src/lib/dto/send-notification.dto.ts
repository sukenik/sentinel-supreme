import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { eSeverity } from '../rules.types'
import { iNotificationPayload, iNotificationRecipient } from '../types'

export class SendNotificationDto implements iNotificationPayload {
	@IsEnum(eSeverity)
	@IsNotEmpty()
	severity!: eSeverity

	@IsString()
	@IsNotEmpty()
	title!: string

	@IsString()
	@IsNotEmpty()
	message!: string

	@IsArray()
	recipients!: iNotificationRecipient[]
}
