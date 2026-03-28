import { Controller, Logger } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import type { iAlert, iLog } from '@sentinel-supreme/shared'
import { LOG_PATTERNS, WS_EVENTS } from '@sentinel-supreme/shared'
import { DashboardStreamGateway } from './streaming.gateway'

@Controller()
export class RmqStreamBridge {
	private readonly logger = new Logger(RmqStreamBridge.name)

	constructor(private readonly logsGateway: DashboardStreamGateway) {}

	@EventPattern(LOG_PATTERNS.PROCESSED_LOG)
	handleBroadcast(@Payload() data: iLog) {
		this.logsGateway.sendToClients(data)
	}

	@EventPattern(LOG_PATTERNS.NEW_ALERT)
	async handleNewAlert(@Payload() data: iAlert) {
		this.logger.log(`🔔 Received new alert from Processor: ${data.id}`)

		// TOOD: Remove
		this.logsGateway.server.emit(WS_EVENTS.ALERT_RECEIVED, data)
	}
}
