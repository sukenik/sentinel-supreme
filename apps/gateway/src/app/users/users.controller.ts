import { Body, Controller, Post } from '@nestjs/common'
import { GATEWAY_ROUTES } from '@sentinel-supreme/shared'
import { RegisterDto } from '@sentinel-supreme/shared/server'
import { UsersService } from './users.service'

@Controller(GATEWAY_ROUTES.USERS)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post(GATEWAY_ROUTES.REGISTER)
	async register(@Body() body: RegisterDto) {
		return this.usersService.create(body.email, body.password)
	}
}
