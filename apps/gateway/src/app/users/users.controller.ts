import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UseGuards
} from '@nestjs/common'
import { eUserRole, GATEWAY_ROUTES, iUser } from '@sentinel-supreme/shared'
import {
	JwtAuthGuard,
	RegisterDto,
	Roles,
	RolesGuard,
	UpdateDto
} from '@sentinel-supreme/shared/server'
import { GetUser } from '../auth/decorators/get-user.decorator'
import { UsersService } from './users.service'

@Controller(GATEWAY_ROUTES.USERS)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(eUserRole.ADMIN)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	async createUser(@Body() body: RegisterDto) {
		return this.usersService.create(body.email, body.password, body.role)
	}

	@Get()
	async getAllUsers(): Promise<iUser[]> {
		return this.usersService.getAll()
	}

	@Delete(':id')
	async deleteUser(@Param('id') id: string, @GetUser('userId') requesterId: string) {
		if (id === requesterId) {
			throw new BadRequestException('Self-deletion is not allowed')
		}

		return this.usersService.deleteById(id)
	}

	@Put(':id')
	async updateUser(@Param('id') id: string, @Body() body: UpdateDto) {
		return this.usersService.update(id, body)
	}
}
