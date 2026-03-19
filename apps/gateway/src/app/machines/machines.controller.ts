import { Body, Controller, Get, Logger, Post, Req, UseGuards } from '@nestjs/common'
import { eUserRole, GATEWAY_ROUTES } from '@sentinel-supreme/shared'
import { Roles } from '../auth/decorators/roles.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { MachinesService } from './machines.service'

@Controller(GATEWAY_ROUTES.MACHINES)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(eUserRole.USER, eUserRole.ADMIN)
export class MachinesController {
	private readonly logger = new Logger(MachinesController.name)

	constructor(private readonly machinesService: MachinesService) {}

	// TODO: change any
	@Post()
	async register(@Body('name') name: string, @Req() req: any) {
		const creatorEmail = req.user.email

		this.logger.log(`Creating new machine: ${name} by ${creatorEmail}`)

		return this.machinesService.createMachine(name)
	}

	@Get()
	async getAll() {
		return this.machinesService.getAll()
	}
}
