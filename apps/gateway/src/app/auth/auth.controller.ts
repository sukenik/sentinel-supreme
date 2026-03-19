import { Body, Controller, Post } from '@nestjs/common'
import { GATEWAY_ROUTES, iAuthResponse } from '@sentinel-supreme/shared'
import { RegisterDto } from '@sentinel-supreme/shared/server'
import { AuthService } from './auth.service'

@Controller(GATEWAY_ROUTES.AUTH)
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post(GATEWAY_ROUTES.LOGIN)
	async login(@Body() loginDto: RegisterDto): Promise<iAuthResponse> {
		return this.authService.login(loginDto.email, loginDto.password)
	}
}
