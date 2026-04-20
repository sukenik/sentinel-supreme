import { Body, Controller, Get, Param, Patch } from '@nestjs/common'
import { GATEWAY_ROUTES } from '../consts'
import { AiConfigService } from './ai-config.service'
import { AiConfigEntity } from './entities/ai-config.entity'

@Controller(GATEWAY_ROUTES.AI_CONFIG)
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
