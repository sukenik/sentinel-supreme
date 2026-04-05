import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'
import { iLogSearchParams } from '../types'

export class LogSearchDto implements iLogSearchParams {
	@IsOptional()
	@IsString()
	searchTerm?: string

	@IsOptional()
	@IsString()
	sourceIp?: string

	@IsOptional()
	@IsString()
	serviceName?: string

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page = 1

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	limit = 50
}
