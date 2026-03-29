import { Controller, Get } from '@nestjs/common'
import { GATEWAY_ROUTES, iAlert } from '@sentinel-supreme/shared'
import { AlertsService } from '@sentinel-supreme/shared/server'

@Controller(GATEWAY_ROUTES.ALERTS)
export class AlertsController {
	constructor(private alertsService: AlertsService) {}

	@Get()
	async getAll(): Promise<iAlert[]> {
		return this.alertsService.getAll(100)
	}
}
