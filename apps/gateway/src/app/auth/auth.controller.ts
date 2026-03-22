import { Body, Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common'
import { GATEWAY_ROUTES, iAuthResponse } from '@sentinel-supreme/shared'
import { RegisterDto } from '@sentinel-supreme/shared/server'
import type { Request, Response } from 'express'
import { REFRESH_TOKEN_COOKIE_HEADER } from '../consts'
import { AuthService } from './auth.service'

@Controller(GATEWAY_ROUTES.AUTH)
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post(GATEWAY_ROUTES.LOGIN)
	async login(
		@Body() loginDto: RegisterDto,
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
}
