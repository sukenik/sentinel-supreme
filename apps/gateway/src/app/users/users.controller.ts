import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { eUserRole, GATEWAY_ROUTES } from '@sentinel-supreme/shared'
import { RegisterDto } from '@sentinel-supreme/shared/server'
import { Roles } from '../auth/decorators/roles.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { UsersService } from './users.service'

@Controller(GATEWAY_ROUTES.USERS)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post(GATEWAY_ROUTES.REGISTER)
	async register(@Body() body: RegisterDto) {
		return this.usersService.create(body.email, body.password)
	}

	@Get()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(eUserRole.ADMIN)
	async getAllUsers() {
		return this.usersService.getAll()
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(eUserRole.ADMIN)
	async deleteUser(@Param('id') id: string) {
		return this.usersService.deleteById(id)
	}
}
