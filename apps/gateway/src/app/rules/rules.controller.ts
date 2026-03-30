import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { GATEWAY_ROUTES } from '@sentinel-supreme/shared'
import { CreateRuleDto } from '@sentinel-supreme/shared/server'
import { RulesGatewayService } from './rules.service'

@Controller(GATEWAY_ROUTES.RULES)
export class RulesController {
	constructor(private readonly rulesService: RulesGatewayService) {}

	@Post()
	create(@Body() createRuleDto: CreateRuleDto) {
		return this.rulesService.create(createRuleDto)
	}

	@Get()
	getAll() {
		return this.rulesService.getAll()
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateRuleDto: CreateRuleDto) {
		return this.rulesService.update(id, updateRuleDto)
	}

	@Delete(':id')
	delete(@Param('id') id: string) {
		return this.rulesService.deleteById(id)
	}
}
