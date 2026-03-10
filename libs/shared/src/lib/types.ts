import { CreateLogDto } from './dto/create-log.dto'

export enum eUserRole {
	USER = 'user',
	ANALYST = 'analyst',
	ADMIN = 'admin'
}

export interface iJwtPayload {
	sub: string
	email: string
	role: eUserRole
	iat?: number
	exp?: number
}

export interface iRequestUser {
	userId: string
	email: string
	role: eUserRole
}

export interface iLog extends CreateLogDto {
	fingerprint: string
}
