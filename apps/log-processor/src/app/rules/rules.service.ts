import { InjectRedis } from '@nestjs-modules/ioredis'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import {
	eLogLevel,
	eRuleOperator,
	eRuleType,
	eSeverity,
	iAlert,
	iLog,
	iRateLimitRule,
	LOG_PATTERNS,
	tRule
} from '@sentinel-supreme/shared'
import { AlertsService } from '@sentinel-supreme/shared/server'
import Redis from 'ioredis'
import { firstValueFrom } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { ALERTS_CLIENT } from '../consts'
import { ExternalApiService } from '../external-api/external-api.service'

@Injectable()
export class RulesService {
	private readonly logger = new Logger(RulesService.name)

	constructor(
		@Inject(ALERTS_CLIENT) private readonly rmqClient: ClientProxy,
		@InjectRedis() private readonly redis: Redis,
		private readonly externalApi: ExternalApiService,
		private readonly alertsService: AlertsService
	) {}

	// TOOD: Move to DB
	// ביינתים נחזיק "סט חוקים" קשיח בקוד, בהמשך נשלוף מה-DB
	private rules: tRule[] = [
		{
			id: '1',
			name: 'Critical Severity Alert',
			description: 'Triggers when a log level is critical',
			field: 'level',
			operator: eRuleOperator.EQUALS,
			value: eLogLevel.ERROR,
			severity: eSeverity.CRITICAL,
			isActive: true,
			type: eRuleType.STATIC
		},
		{
			id: '2',
			name: 'Auth Failure Detection',
			description: 'Detects unauthorized access attempts',
			field: 'message',
			operator: eRuleOperator.CONTAINS,
			value: 'unauthorized',
			severity: eSeverity.HIGH,
			isActive: true,
			type: eRuleType.STATIC
		},
		{
			id: 'rule_brute_force',
			name: 'Brute Force Detection',
			description: '5 failed logins within 60 seconds',
			field: 'message',
			operator: eRuleOperator.CONTAINS,
			value: 'unauthorized',
			severity: eSeverity.HIGH,
			isActive: true,
			type: eRuleType.RATE_LIMIT,
			limit: 5,
			windowSeconds: 60,
			groupBy: 'sourceIp'
		}
	]

	async evaluateLog(log: iLog): Promise<iAlert[]> {
		const alerts: iAlert[] = []

		for (const rule of this.rules.filter((r) => r.isActive)) {
			const isMatch = this.checkRule(log, rule)

			if (isMatch) {
				if (rule.type === eRuleType.RATE_LIMIT) {
					const rateLimitAlert = await this.handleRateLimit(log, rule)

					if (rateLimitAlert) {
						alerts.push(rateLimitAlert)
					}
				} else {
					const alert = await this.saveAlert(log, rule)
					alerts.push(alert)
				}
			}
		}

		return alerts
	}

	private async handleRateLimit(log: iLog, rule: iRateLimitRule): Promise<iAlert | null> {
		const identifier = this.getValueByPath(log, rule.groupBy)

		if (!identifier) {
			this.logger.warn(`⚠️ Skipping RateLimit Rule [${rule.name}]: Missing ${rule.groupBy}`)
			return null
		}

		const cleanIdentifier = this.sanitizeIdentifier(String(identifier))
		const redisKey = `rule:${rule.id}:${cleanIdentifier}`

		try {
			const count = await this.redis.incr(redisKey)

			if (count === 1) {
				await this.redis.expire(redisKey, rule.windowSeconds)
			}

			if (count >= rule.limit) {
				if (count === rule.limit) {
					this.logger.error(`🔥 Brute Force Detected! IP: ${identifier}, Count: ${count}`)

					const reputation = await this.externalApi.getIpReputation(String(identifier))

					const reputationMsg =
						reputation.maliciousCount > 0
							? ` | ⚠️ HIGH RISK: Flagged by ${reputation.maliciousCount} security engines!`
							: ` | Info: IP appears clean`

					return await this.saveAlert(
						log,
						rule,
						`Brute Force detected from ${identifier}${reputationMsg}`,
						reputation
					)
				}
			}
		} catch (error) {
			this.logger.error(`❌ Error:`, error)
		}

		return null
	}

	private async saveAlert(
		log: iLog,
		rule: tRule,
		customMessage?: string,
		reputationData?: any
	): Promise<iAlert> {
		const alert: iAlert = {
			id: uuidv4(),
			ruleId: rule.id,
			ruleName: rule.name,
			severity: rule.severity,
			message: customMessage || `Rule '${rule.name}' triggered: ${rule.description}`,
			triggerLogFingerprint: log.fingerprint || 'unknown',
			createdAt: new Date().toISOString(),
			isRead: false,
			reputationData: reputationData || null
		}

		try {
			this.logger.log(`🚀 Processing Alert & Broadcast for: ${rule.name}`)

			await Promise.all([
				this.alertsService.create(alert),
				firstValueFrom(this.rmqClient.emit(LOG_PATTERNS.NEW_ALERT, alert))
			])

			this.logger.log(`✅ Alert ${alert.id} is now Persisted and Broadcasted.`)
			return alert
		} catch (error) {
			this.logger.error(`❌ Critical error in alert pipeline for ${alert.id}`, error)
			throw error
		}
	}

	private checkRule(log: iLog, rule: tRule): boolean {
		const logValue = this.getValueByPath(log, rule.field)

		if (logValue === undefined && rule.operator !== eRuleOperator.EXISTS) {
			return false
		}

		switch (rule.operator) {
			case eRuleOperator.EQUALS:
				return String(logValue).toLowerCase() === String(rule.value).toLowerCase()
			case eRuleOperator.CONTAINS:
				return String(logValue).toLowerCase().includes(String(rule.value).toLowerCase())
			case eRuleOperator.GREATER_THAN:
				return Number(logValue) > Number(rule.value)
			case eRuleOperator.LESS_THAN:
				return Number(logValue) < Number(rule.value)
			case eRuleOperator.EXISTS:
				return logValue !== undefined && logValue !== null
			default:
				return false
		}
	}

	private getValueByPath(obj: any, path: string) {
		return path.split('.').reduce((acc, part) => acc && acc[part], obj)
	}

	private sanitizeIdentifier(id: string): string {
		return id.replace(/:/g, '_')
	}
}
