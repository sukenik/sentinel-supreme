import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common'
import { eUserRole, GATEWAY_ROUTES } from '@sentinel-supreme/shared'
import { GetUser } from '../auth/decorators/get-user.decorator'
import { Roles } from '../auth/decorators/roles.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { MachinesService } from './machines.service'

@Controller(GATEWAY_ROUTES.MACHINES)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(eUserRole.ADMIN)
export class MachinesController {
	private readonly logger = new Logger(MachinesController.name)

	constructor(private readonly machinesService: MachinesService) {}

	@Post()
	async register(@Body('name') name: string, @GetUser('email') userEmail: string) {
		this.logger.log(`Creating new machine: ${name} by ${userEmail}`)

		return this.machinesService.createMachine(name)
	}

	@Get()
	async getAll() {
		return this.machinesService.getAll()
	}
}
