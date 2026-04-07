import { eNotificationChannel, eSeverity, iNotificationPayload } from '@sentinel-supreme/shared'
import { IsArray, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator'

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
	@IsEnum(eNotificationChannel, { each: true })
	@IsNotEmpty()
	channels!: eNotificationChannel[]

	@IsOptional()
	@IsString()
	userId?: string

	@IsOptional()
	@IsObject()
	metadata?: any
}
