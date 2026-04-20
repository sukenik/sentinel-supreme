import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common'
import { GATEWAY_ROUTES } from '../consts'
import { Roles } from '../decorators/roles.decorator'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { RolesGuard } from '../guards/roles.guard'
import { eUserRole } from '../types'
import { AiConfigService } from './ai-config.service'
import { AiConfigEntity } from './entities/ai-config.entity'

@Controller(GATEWAY_ROUTES.AI_CONFIG)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(eUserRole.ADMIN)
export class AiConfigController {
	constructor(private readonly aiConfigService: AiConfigService) {}

	@Get()
	get() {
		return this.aiConfigService.get()
	}

	@Get(GATEWAY_ROUTES.AI_MODELS)
	getAvailableModels() {
		return this.aiConfigService.getAvailableModels()
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() dto: Partial<AiConfigEntity>) {
		return this.aiConfigService.update(id, dto)
	}
}
