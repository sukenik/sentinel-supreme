import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { iAuthResponse, iJwtPayload } from '@sentinel-supreme/shared'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService
	) {}

	async login(email: string, pass: string) {
		const user = await this.usersService.getByEmail(email)

		if (!user || !(await bcrypt.compare(pass, user.password!))) {
			throw new UnauthorizedException('Invalid credentials')
		}

		const payload = {
			sub: user.id,
			email: user.email,
			role: user.role
		} as iJwtPayload

		return {
			access_token: this.jwtService.sign(payload),
			user: {
				userId: user.id,
				email: user.email,
				role: user.role
			}
		} as iAuthResponse
	}
}
