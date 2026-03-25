import { IsDateString, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator'
import { eLogLevel, iBaseLog } from '../types'

export class CreateLogDto implements iBaseLog {
	@IsString()
	@IsNotEmpty()
	message!: string

	@IsEnum(eLogLevel)
	level!: eLogLevel

	@IsString()
	@IsNotEmpty()
	service!: string

	@IsString()
	@IsOptional()
	sourceIp?: string

	@IsObject()
	@IsOptional()
	metadata?: Record<string, any>

	@IsOptional()
	@IsDateString()
	createdAt?: string
}
