import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { GATEWAY_ROUTES } from '../consts'
import { CreateRuleDto } from '@sentinel-supreme/shared/server'
import { RulesManagerService } from './rules.service'

@Controller(GATEWAY_ROUTES.RULES)
export class RulesController {
	constructor(private readonly rulesManager: RulesManagerService) {}

	@Post()
	create(@Body() createRuleDto: CreateRuleDto) {
		return this.rulesManager.create(createRuleDto)
	}

	@Get()
	getAll() {
		return this.rulesManager.getAll()
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateRuleDto: CreateRuleDto) {
		return this.rulesManager.update(id, updateRuleDto)
	}

	@Delete(':id')
	delete(@Param('id') id: string) {
		return this.rulesManager.deleteById(id)
	}
}
