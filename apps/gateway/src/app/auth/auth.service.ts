import { InjectRedis } from '@nestjs-modules/ioredis'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { iAuthResponse, iJwtPayload } from '@sentinel-supreme/shared'
import * as bcrypt from 'bcrypt'
import Redis from 'ioredis'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
	constructor(
		@InjectRedis() private readonly redis: Redis,
		private usersService: UsersService,
		private jwtService: JwtService
	) {}

	async login(email: string, pass: string) {
		const ONE_DAY_IN_SECONDS = 60 * 60 * 24
		const user = await this.usersService.getByEmail(email)

		if (!user || !(await bcrypt.compare(pass, user.password!))) {
			throw new UnauthorizedException('Invalid credentials')
		}

		const payload = {
			sub: user.id,
			email: user.email,
			role: user.role
		} as iJwtPayload

		const result = {
			access_token: this.jwtService.sign(payload),
			user: {
				userId: user.id,
				email: user.email,
				role: user.role
			}
		} as iAuthResponse

		await this.redis.set(
			`session:${result.user.userId}`,
			JSON.stringify(result.user),
			'EX',
			ONE_DAY_IN_SECONDS
		)

		return result
	}
}
