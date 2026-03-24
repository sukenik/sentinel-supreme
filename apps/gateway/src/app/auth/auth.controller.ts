import { Body, Controller, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { GATEWAY_ROUTES, iAuthResponse } from '@sentinel-supreme/shared'
import { LoginDto } from '@sentinel-supreme/shared/server'
import type { Request, Response } from 'express'
import { REFRESH_TOKEN_COOKIE_HEADER } from '../consts'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@Controller(GATEWAY_ROUTES.AUTH)
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post(GATEWAY_ROUTES.LOGIN)
	async login(
		@Body() loginDto: LoginDto,
		@Res({ passthrough: true }) res: Response
	): Promise<iAuthResponse> {
		return this.authService.login(loginDto.email, loginDto.password, res)
	}

	@Post(GATEWAY_ROUTES.REFRESH)
	async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const token = req.cookies[REFRESH_TOKEN_COOKIE_HEADER]

		if (!token) {
			throw new UnauthorizedException()
		}

		return this.authService.refresh(token, res)
	}

	@Post(GATEWAY_ROUTES.LOGOUT)
	@UseGuards(JwtAuthGuard)
	async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const token = req.cookies[REFRESH_TOKEN_COOKIE_HEADER]

		await this.authService.logout(token)

		res.clearCookie(REFRESH_TOKEN_COOKIE_HEADER, {
			httpOnly: true,
			// TODO: Change for prod!
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict'
		})

		return { message: 'Logged out successfully' }
	}
}
