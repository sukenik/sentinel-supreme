import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import type { iAlert, iLog } from '@sentinel-supreme/shared'
import { LOG_PATTERNS } from '@sentinel-supreme/shared'
import { DashboardStreamGateway } from './streaming.gateway'

@Controller()
export class RmqStreamBridge {
	constructor(private readonly logsGateway: DashboardStreamGateway) {}

	@EventPattern(LOG_PATTERNS.PROCESSED_LOG)
	handleBroadcast(@Payload() data: iLog) {
		this.logsGateway.emitNewLog(data)
	}

	@EventPattern(LOG_PATTERNS.NEW_ALERT)
	async handleNewAlert(@Payload() data: iAlert) {
		this.logsGateway.emitNewAlert(data)
	}
}
