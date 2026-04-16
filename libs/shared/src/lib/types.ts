import { eSeverity } from './rules.types'

export enum eUserRole {
	USER = 'user',
	ANALYST = 'analyst',
	ADMIN = 'admin'
}

export enum eLogLevel {
	INFO = 'info',
	WARN = 'warn',
	ERROR = 'error',
	DEBUG = 'debug'
}

export interface iJwtPayload {
	sub: string
	email: string
	role: eUserRole
	iat?: number
	exp?: number
}

export interface iUser {
	id: string
	email: string
	password?: string
	role: eUserRole
	createdAt: Date
}

export interface iRequestUser {
	userId: string
	email: string
	role: eUserRole
}

export interface iAuthResponse {
	access_token: string
	user: iRequestUser
}

export interface iBaseLog {
	service: string
	level: eLogLevel
	message: string
	sourceIp?: string
	metadata?: Record<string, any>
	createdAt?: Date | string
}

export interface iLog extends iBaseLog {
	fingerprint: string
}

export interface iBaseMachine {
	id: string
	name: string
}

export interface iMachine extends iBaseMachine {
	apiKey: string
	isActive: boolean
	createdAt: Date
}

export interface iLoginUser {
	email: string
	password: string
}

export interface iRegisterUser extends iLoginUser {
	role: eUserRole
}

export type UpdateUser = Pick<iUser, 'email' | 'password' | 'role'>

export interface iAlert {
	id: string
	ruleId: string
	ruleName: string
	severity: eSeverity
	message: string
	triggerLogFingerprint: string
	createdAt: string
	isRead: boolean
	reputationData?: iReputationData
	logSourceIp?: string
	aiInsight?: string
}

export interface iReputationData {
	maliciousCount: number
	network: string
}

export interface iLogSearchParams {
	searchTerm?: string
	sourceIp?: string
	serviceName?: string
	lastId?: string
	limit?: number
}

export interface iLogSearchReturnType {
	data: iLog[]
	stats: Record<string, number>
	timeline: {
		time: Date | string
		count: number
	}[]
	meta: {
		total: number
		nextCursor?: string
		limit: number
	}
}

export enum eNotificationChannel {
	EMAIL = 'EMAIL',
	SLACK = 'SLACK',
	DISCORD = 'DISCORD',
	GLOBAL = 'GLOBAL'
}

export interface iNotificationRecipient {
	userEmail: string
	channel: eNotificationChannel
}

export interface iNotificationPreference {
	userEmail: string
	severity: eSeverity
	channel: eNotificationChannel
	isEnabled: boolean
}

export interface iNotificationPayload {
	severity: eSeverity
	title: string
	message: string
	recipients: iNotificationRecipient[]
}
