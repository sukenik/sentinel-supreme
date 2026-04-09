import { InjectRedis } from '@nestjs-modules/ioredis'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import {
	eLogLevel,
	eNotificationChannel,
	eRuleOperator,
	eRuleType,
	eSeverity,
	iAlert,
	iLog,
	iRateLimitRule,
	iReputationData,
	LOG_PATTERNS,
	NOTIFICATION_PATTERNS,
	REDIS_CHANNELS,
	REDIS_SUBSCRIBER,
	tRule
} from '@sentinel-supreme/shared'
import { AlertsService, RulesManagerService } from '@sentinel-supreme/shared/server'
import Redis from 'ioredis'
import { firstValueFrom } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { ALERTS_CLIENT, NOTIFICATIONS_CLIENT } from '../consts'
import { ExternalApiService } from '../external-api/external-api.service'

@Injectable()
export class RulesEngineService {
	private readonly logger = new Logger(RulesEngineService.name)
	private rules: tRule[] = []

	constructor(
		@Inject(ALERTS_CLIENT) private readonly alertsClient: ClientProxy,
		@Inject(NOTIFICATIONS_CLIENT) private readonly notificationsClient: ClientProxy,
		@InjectRedis() private readonly redis: Redis,
		@Inject(REDIS_SUBSCRIBER) private readonly redisSub: Redis,
		private readonly externalApi: ExternalApiService,
		private readonly alertsService: AlertsService,
		private readonly rulesManager: RulesManagerService
	) {}

	async onModuleInit() {
		await this.refreshRules()
		this.initSubscriber()
	}

	async evaluateLog(log: iLog): Promise<iAlert[]> {
		if (log.level === eLogLevel.ERROR) {
			this.notificationsClient.emit(NOTIFICATION_PATTERNS.SEND, {
				severity: eSeverity.CRITICAL,
				title: `Critical Error in ${log.service}`,
				message: log.message,
				channels: [
					eNotificationChannel.EMAIL,
					eNotificationChannel.SLACK,
					eNotificationChannel.DISCORD
				]
			})
		}

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

	private async refreshRules() {
		try {
			this.logger.log('🔄 Fetching rules from Postgres...')
			const rules = await this.rulesManager.getAllActiveRules()

			if (rules && rules.length > 0) {
				this.rules = rules
				this.logger.log(`✅ Loaded ${this.rules.length} active rules.`)
			} else {
				this.logger.warn('⚠️ No rules found in Postgres. System is running with 0 rules.')
				this.rules = []
			}
		} catch (error) {
			this.logger.error('❌ Failed to refresh rules from Postgres:', error)
		}
	}

	private initSubscriber() {
		this.redisSub.subscribe(REDIS_CHANNELS.RULES_UPDATED, (err) => {
			if (err) {
				this.logger.error('❌ Failed to subscribe to rules channel:', err)
				return
			}
			this.logger.log(`📡 Subscribed to [${REDIS_CHANNELS.RULES_UPDATED}] channel.`)
		})

		this.redisSub.removeAllListeners('message')

		this.redisSub.on('message', async (channel, message) => {
			if (channel === REDIS_CHANNELS.RULES_UPDATED) {
				try {
					this.logger.log('🔔 Rules update received via Redis Pub/Sub.')

					const newRules = JSON.parse(message) as tRule[]

					if (Array.isArray(newRules)) {
						this.rules = newRules
						this.logger.log(`✅ Cache updated locally with ${this.rules.length} rules.`)
					}
				} catch (error) {
					this.logger.error(
						'❌ Failed to parse rules from Redis, falling back to DB...',
						error
					)
					await this.refreshRules()
				}
			}
		})
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
		reputationData?: iReputationData
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
			reputationData: reputationData,
			logSourceIp: log.sourceIp
		}

		try {
			this.logger.log(`🚀 Processing Alert & Broadcast for: ${rule.name}`)

			await Promise.all([
				this.alertsService.create(alert),
				firstValueFrom(this.alertsClient.emit(LOG_PATTERNS.NEW_ALERT, alert))
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
