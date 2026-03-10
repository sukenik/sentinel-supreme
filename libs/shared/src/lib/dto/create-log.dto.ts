import { IsString, IsNotEmpty, IsEnum, IsOptional, IsObject, IsDateString } from 'class-validator'

export enum eLogLevel {
	INFO = 'info',
	WARN = 'warn',
	ERROR = 'error',
	DEBUG = 'debug'
}

export class CreateLogDto {
	@IsString()
	@IsNotEmpty()
	message!: string

	@IsEnum(eLogLevel)
	level!: eLogLevel

	@IsString()
	@IsNotEmpty()
	service!: string

	@IsObject()
	@IsOptional()
	metadata?: Record<string, any>

	@IsOptional()
	@IsDateString()
	createdAt?: string
}
