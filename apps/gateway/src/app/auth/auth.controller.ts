import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from '@sentinel-supreme/shared'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	async login(@Body() loginDto: RegisterDto) {
		return this.authService.login(loginDto.email, loginDto.password)
	}
}
