import { eRuleOperator, eRuleType, eSeverity } from '../rules.types'
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator'

export class CreateRuleDto {
	@IsString()
	@IsNotEmpty()
	name!: string

	@IsString()
	description!: string

	@IsEnum(eRuleType)
	type!: eRuleType

	@IsEnum(eSeverity)
	severity!: eSeverity

	@IsString()
	@IsNotEmpty()
	field!: string

	@IsEnum(eRuleOperator)
	operator!: eRuleOperator

	@IsString()
	value!: string

	@IsBoolean()
	isActive!: boolean

	@ValidateIf((o) => o.type === eRuleType.RATE_LIMIT)
	@IsNumber()
	@IsNotEmpty()
	limit?: number

	@ValidateIf((o) => o.type === eRuleType.RATE_LIMIT)
	@IsNumber()
	@IsNotEmpty()
	windowSeconds?: number

	@ValidateIf((o) => o.type === eRuleType.RATE_LIMIT)
	@IsString()
	@IsNotEmpty()
	groupBy?: string
}
