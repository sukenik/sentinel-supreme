import { Body, Controller, Post } from '@nestjs/common'
import { RegisterDto } from '@sentinel-supreme/shared/server'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('register')
	async register(@Body() body: RegisterDto) {
		return this.usersService.create(body.email, body.password)
	}
}
