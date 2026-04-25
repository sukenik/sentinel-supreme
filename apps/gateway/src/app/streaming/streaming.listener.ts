import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import type { iAiChatChunk, iAlert, iAlertUpdate, iLog } from '@sentinel-supreme/shared'
import { AI_CHAT_PATTERNS, LOG_PATTERNS } from '@sentinel-supreme/shared'
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

	@EventPattern(LOG_PATTERNS.ALERT_UPDATED)
	async handleAlertUpdate(@Payload() data: iAlertUpdate) {
		this.logsGateway.emitAlertUpdate(data)
	}

	@EventPattern(AI_CHAT_PATTERNS.CHUNK)
	handleAiChatChunk(@Payload() data: iAiChatChunk) {
		this.logsGateway.emitAiChunk(data)
	}

	@EventPattern(AI_CHAT_PATTERNS.ERROR)
	handleAiChatError(@Payload() data: { userId: string; error: string }) {
		this.logsGateway.emitAiError(data)
	}
}
