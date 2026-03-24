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

export interface iRule {
	id: string
	name: string
	description: string
	field: string
	operator: eRuleOperator
	value: any
	severity: eSeverity
	isActive: boolean
}
