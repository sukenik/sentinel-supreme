import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { GATEWAY_ROUTES } from '@sentinel-supreme/shared'
import { LogSearchDto } from '@sentinel-supreme/shared/server'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { LogSearchService } from './log-search.service'

@Controller(GATEWAY_ROUTES.LOG_SEARCH)
@UseGuards(JwtAuthGuard)
export class LogsSearchController {
	constructor(private readonly logsSearchService: LogSearchService) {}

	@Get(GATEWAY_ROUTES.SEARCH)
	async searchLogs(@Query() query: LogSearchDto) {
		return this.logsSearchService.search(query)
	}
}
