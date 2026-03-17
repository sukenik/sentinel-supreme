import { Body, Controller, Post } from '@nestjs/common'
import { iAuthResponse } from '@sentinel-supreme/shared'
import { RegisterDto } from '@sentinel-supreme/shared/server'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	async login(@Body() loginDto: RegisterDto): Promise<iAuthResponse> {
		return this.authService.login(loginDto.email, loginDto.password)
	}
}
