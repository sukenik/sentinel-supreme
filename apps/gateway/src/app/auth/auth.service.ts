import { InjectRedis } from '@nestjs-modules/ioredis'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { iAuthResponse, iJwtPayload } from '@sentinel-supreme/shared'
import * as bcrypt from 'bcrypt'
import { Response } from 'express'
import Redis from 'ioredis'
import { v4 as uuidv4 } from 'uuid'
import { ONE_WEEK_IN_SECONDS, REFRESH_TOKEN_COOKIE_HEADER } from '../consts'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
	private REDIS_REFRESH_TOKEN_PREFIX = 'refresh_token:'

	constructor(
		@InjectRedis() private readonly redis: Redis,
		private usersService: UsersService,
		private jwtService: JwtService
	) {}

	private async updateUserRefreshToken(token: string, payload: iJwtPayload) {
		await this.redis.set(
			`${this.REDIS_REFRESH_TOKEN_PREFIX}${token}`,
			JSON.stringify(payload),
			'EX',
			ONE_WEEK_IN_SECONDS
		)
	}

	private updateResponseCookie(res: Response, refreshToken: string) {
		res.cookie(REFRESH_TOKEN_COOKIE_HEADER, refreshToken, {
			httpOnly: true,
			// TODO: Change for prod!
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: ONE_WEEK_IN_SECONDS
		})
	}

	async login(email: string, pass: string, res: Response) {
		const user = await this.usersService.getByEmail(email)

		if (!user || !(await bcrypt.compare(pass, user.password!))) {
			throw new UnauthorizedException('Invalid credentials')
		}

		const payload = {
			sub: user.id,
			email: user.email,
			role: user.role
		} as iJwtPayload

		const accessToken = this.jwtService.sign(payload)
		const refreshToken = uuidv4()

		await this.updateUserRefreshToken(refreshToken, payload)

		this.updateResponseCookie(res, refreshToken)

		const result = {
			access_token: accessToken,
			user: {
				userId: user.id,
				email: user.email,
				role: user.role
			}
		} as iAuthResponse

		return result
	}

	async refresh(oldRefreshToken: string, res: Response) {
		const userData = await this.redis.get(
			`${this.REDIS_REFRESH_TOKEN_PREFIX}${oldRefreshToken}`
		)

		if (!userData) {
			throw new UnauthorizedException('Invalid or expired refresh token')
		}

		const payload = JSON.parse(userData) as iJwtPayload

		const accessToken = this.jwtService.sign(payload)
		const newRefreshToken = uuidv4()

		await this.redis.del(`${this.REDIS_REFRESH_TOKEN_PREFIX}${oldRefreshToken}`)

		await this.updateUserRefreshToken(newRefreshToken, payload)

		this.updateResponseCookie(res, newRefreshToken)

		return { access_token: accessToken }
	}
}
