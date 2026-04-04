import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class LogSearchDto {
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
