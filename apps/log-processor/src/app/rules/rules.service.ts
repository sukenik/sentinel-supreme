import { InjectRedis } from '@nestjs-modules/ioredis'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import {
	AI_ANALYSIS_PATTERNS,
	eRuleOperator,
	eRuleType,
	eSeverity,
	iAlert,
	iLog,
	iNotificationPayload,
	iNotificationPreference,
	iNotificationRecipient,
	iRateLimitRule,
	iReputationData,
	iStaticRule,
	LOG_PATTERNS,
	NOTIFICATION_PATTERNS,
	REDIS_CHANNELS,
	REDIS_SUBSCRIBER,
	tRule
} from '@sentinel-supreme/shared'
import {
	AlertsService,
	NotificationsPreferencesService,
	RulesManagerService
} from '@sentinel-supreme/shared/server'
import Redis from 'ioredis'
import { firstValueFrom } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { AI_ANALYSIS_CLIENT, ALERTS_CLIENT, NOTIFICATIONS_CLIENT } from '../consts'
import { ExternalApiService } from '../external-api/external-api.service'

@Injectable()
export class RulesEngineService {
	private readonly logger = new Logger(RulesEngineService.name)
	private rules: tRule[] = []
	private notificationsPreferences: iNotificationPreference[] = []
	private mutedUsers: Set<string> = new Set()

	constructor(
		@Inject(ALERTS_CLIENT) private readonly alertsClient: ClientProxy,
		@Inject(NOTIFICATIONS_CLIENT) private readonly notificationsClient: ClientProxy,
		@Inject(AI_ANALYSIS_CLIENT) private readonly aiAnalysisClient: ClientProxy,
		@InjectRedis() private readonly redis: Redis,
		@Inject(REDIS_SUBSCRIBER) private readonly redisSub: Redis,
		private readonly externalApi: ExternalApiService,
		private readonly alertsService: AlertsService,
		private readonly rulesManager: RulesManagerService,
		private readonly notificationsPreferencesService: NotificationsPreferencesService
	) {}

	async onModuleInit() {
		await Promise.all([
			this.refreshRules(),
			this.refreshNotificationsPreferences(),
			this.loadInitialMutedUsers()
		])
		this.initSubscriber()
	}

	private async loadInitialMutedUsers() {
		try {
			this.logger.log('🔄 Loading initial global mute states...')

			const mutedConfigs = await this.notificationsPreferencesService.getAllMutedUsers()
			this.mutedUsers = new Set(mutedConfigs.map((c) => c.userEmail))

			this.logger.log(`✅ Loaded ${this.mutedUsers.size} muted users.`)
		} catch (error) {
			this.logger.error('❌ Failed to load muted users:', error)
		}
	}

	async evaluateLog(log: iLog): Promise<void> {
		for (const rule of this.rules.filter((r) => r.isActive)) {
			const isMatch = this.checkRule(log, rule)
			if (!isMatch) continue

			if (rule.type === eRuleType.RATE_LIMIT) {
				await this.handleRateLimit(log, rule)
			} else {
				await this.handleStaticRule(log, rule)
			}
		}
	}

	private dispatchNotification(severity: eSeverity, title: string, message: string) {
		const relevantPrefs = this.notificationsPreferences.filter(
			(p) => p.severity === severity && p.isEnabled
		)

		const activeRecipients = relevantPrefs
			.filter((p) => !this.mutedUsers.has(p.userEmail))
			.map((p) => ({
				userEmail: p.userEmail,
				channel: p.channel
			})) as iNotificationRecipient[]

		if (activeRecipients.length > 0) {
			this.notificationsClient.emit(NOTIFICATION_PATTERNS.SEND, {
				severity,
				title,
				message,
				recipients: activeRecipients
			} as iNotificationPayload)
		}
	}

	private async refreshNotificationsPreferences() {
		try {
			this.logger.log('🔄 Fetching notification preferences from Postgres...')
			const notificationPreferences =
				await this.notificationsPreferencesService.getAllEnabledNotificationPreferences()

			if (notificationPreferences) {
				this.notificationsPreferences = notificationPreferences
				this.logger.log(
					`✅ Loaded ${this.notificationsPreferences.length} notification preferences.`
				)
			}
		} catch (error) {
			this.logger.error('❌ Failed to refresh notification preferences:', error)
		}
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
		const { RULES_UPDATED, NOTIFICATIONS_PREFERENCES_UPDATED, GLOBAL_MUTE_UPDATED } =
			REDIS_CHANNELS
		const channels = [RULES_UPDATED, NOTIFICATIONS_PREFERENCES_UPDATED, GLOBAL_MUTE_UPDATED]

		channels.forEach((ch) => {
			this.redisSub.subscribe(ch, (err) => {
				if (err) this.logger.error(`❌ Failed to subscribe to ${ch}`, err)
				else this.logger.log(`📡 Subscribed to [${ch}]`)
			})
		})

		this.redisSub.removeAllListeners('message')

		this.redisSub.on('message', async (channel, message) => {
			try {
				const data = JSON.parse(message)

				if (channel === RULES_UPDATED) {
					this.rules = data
					this.logger.log(`✅ Rules Cache updated (${this.rules.length})`)
				}

				if (channel === NOTIFICATIONS_PREFERENCES_UPDATED) {
					this.notificationsPreferences = data
					this.logger.log(
						`✅ Preferences Cache updated (${this.notificationsPreferences.length})`
					)
				}

				if (channel === GLOBAL_MUTE_UPDATED) {
					const { userEmail, isMuted } = JSON.parse(message)

					if (isMuted) {
						this.mutedUsers.add(userEmail)
					} else {
						this.mutedUsers.delete(userEmail)
					}

					this.logger.log(`👤 User ${userEmail} mute status changed to: ${isMuted}`)
				}
			} catch (error) {
				this.logger.error(`❌ Failed to parse Redis message from ${channel}`, error)
				await Promise.all([
					this.refreshRules(),
					this.refreshNotificationsPreferences(),
					this.loadInitialMutedUsers()
				])
			}
		})
	}

	private async handleStaticRule(log: iLog, rule: iStaticRule) {
		const alert = await this.saveAlert(log, rule)

		this.aiAnalysisClient.emit(AI_ANALYSIS_PATTERNS.ANALYZE_LOGS, {
			alertId: alert.id,
			logs: [log],
			reason: alert.message
		})
	}

	private async handleRateLimit(log: iLog, rule: iRateLimitRule): Promise<void> {
		const identifier = this.getValueByPath(log, rule.groupBy)

		if (!identifier) {
			this.logger.warn(`⚠️ Skipping RateLimit Rule [${rule.name}]: Missing ${rule.groupBy}`)
			return
		}

		const cleanIdentifier = this.sanitizeIdentifier(String(identifier))
		const countKey = `rule:${rule.id}:${cleanIdentifier}`
		const contextKey = `context:${cleanIdentifier}`

		await this.pushLogToContext(contextKey, log)
		const count = await this.redis.incr(countKey)

		if (count === 1) {
			await this.redis.expire(countKey, rule.windowSeconds)
		}

		if (count === rule.limit) {
			const reputation = await this.externalApi.getIpReputation(String(identifier))
			const logBatch = await this.getLogContext(contextKey)

			const alert = await this.saveAlert(
				log,
				rule,
				`Brute Force detected from ${identifier}`,
				reputation
			)

			this.aiAnalysisClient.emit(AI_ANALYSIS_PATTERNS.ANALYZE_LOGS, {
				alertId: alert.id,
				logs: logBatch,
				reason: alert.message
			})
		}
	}

	private async pushLogToContext(key: string, log: iLog) {
		await this.redis.lpush(key, JSON.stringify(log))
		await this.redis.ltrim(key, 0, 9)
		await this.redis.expire(key, 600)
	}

	private async getLogContext(key: string): Promise<iLog[]> {
		const rawLogs = await this.redis.lrange(key, 0, -1)
		return rawLogs.map((l) => JSON.parse(l))
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

		await Promise.all([
			this.alertsService.create(alert),
			firstValueFrom(this.alertsClient.emit(LOG_PATTERNS.NEW_ALERT, alert))
		])

		this.dispatchNotification(rule.severity, `Alert: ${rule.name}`, alert.message)

		return alert
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
