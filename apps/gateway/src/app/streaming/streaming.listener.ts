import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import type { iLog } from '@sentinel-supreme/shared'
import { LOG_PATTERNS } from '@sentinel-supreme/shared'
import { DashboardStreamGateway } from './streaming.gateway'

@Controller()
export class RmqStreamBridge {
	constructor(private readonly logsGateway: DashboardStreamGateway) {}

	@EventPattern(LOG_PATTERNS.BROADCAST_TO_UI)
	handleBroadcast(@Payload() data: iLog) {
		this.logsGateway.sendToClients(data)
	}
}
