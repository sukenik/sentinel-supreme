import { IsString, IsNotEmpty, IsEnum, IsOptional, IsObject } from 'class-validator'

export enum LogLevel {
	INFO = 'info',
	WARN = 'warn',
	ERROR = 'error',
	DEBUG = 'debug'
}

export class CreateLogDto {
	@IsString()
	@IsNotEmpty()
	message!: string

	@IsEnum(LogLevel)
	level!: LogLevel

	@IsString()
	@IsNotEmpty()
	service!: string

	@IsObject()
	@IsOptional()
	metadata?: Record<string, any>
}
