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
