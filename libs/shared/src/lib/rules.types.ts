export enum eRuleOperator {
	EQUALS = 'EQUALS',
	CONTAINS = 'CONTAINS',
	GREATER_THAN = 'GREATER_THAN',
	LESS_THAN = 'LESS_THAN',
	EXISTS = 'EXISTS'
}

export enum eSeverity {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH',
	CRITICAL = 'CRITICAL'
}

export enum eRuleType {
	STATIC = 'STATIC',
	RATE_LIMIT = 'RATE_LIMIT'
}

interface iBaseRule {
	id: string
	name: string
	description: string
	severity: eSeverity
	isActive: boolean
	type: eRuleType
	field: string
	operator: eRuleOperator
	value: string
}

export interface iStaticRule extends iBaseRule {
	type: eRuleType.STATIC
}

export interface iRateLimitRule extends iBaseRule {
	type: eRuleType.RATE_LIMIT
	limit: number
	windowSeconds: number
	groupBy: string
}

export type tRule = iStaticRule | iRateLimitRule
