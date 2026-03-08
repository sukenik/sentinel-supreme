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
