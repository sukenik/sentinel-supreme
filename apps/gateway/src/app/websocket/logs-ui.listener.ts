import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { LOG_PATTERNS } from '@sentinel-supreme/shared'
import { LogsGateway } from './logs.gateway'

@Controller()
export class LogsUIListener {
	constructor(private readonly logsGateway: LogsGateway) {}

	@EventPattern(LOG_PATTERNS.BROADCAST_TO_UI)
	handleBroadcast(@Payload() data: any) {
		this.logsGateway.sendToClients(data)
	}
}
