import { Injectable, Logger } from '@nestjs/common'
import { eLogLevel, eRuleOperator, eSeverity, iAlert, iLog, iRule } from '@sentinel-supreme/shared'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class RulesService {
	private readonly logger = new Logger(RulesService.name)

	// TOOD: Move to DB
	// ביינתים נחזיק "סט חוקים" קשיח בקוד, בהמשך נשלוף מה-DB
	private rules: iRule[] = [
		{
			id: '1',
			name: 'Critical Severity Alert',
			description: 'Triggers when a log level is critical',
			field: 'level',
			operator: eRuleOperator.EQUALS,
			value: eLogLevel.ERROR,
			severity: eSeverity.CRITICAL,
			isActive: true
		},
		{
			id: '2',
			name: 'Auth Failure Detection',
			description: 'Detects unauthorized access attempts',
			field: 'message',
			operator: eRuleOperator.CONTAINS,
			value: 'unauthorized',
			severity: eSeverity.HIGH,
			isActive: true
		}
	]

	async evaluateLog(log: iLog): Promise<iAlert[]> {
		const alerts: iAlert[] = []

		for (const rule of this.rules.filter((r) => r.isActive)) {
			const isMatch = this.checkRule(log, rule)

			if (isMatch) {
				this.logger.warn(
					`🚨 Rule Match: [${rule.name}] triggered for log ${log.fingerprint}`
				)
				alerts.push(this.createAlert(log, rule))
			}
		}

		return alerts
	}

	private checkRule(log: iLog, rule: iRule): boolean {
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

	private createAlert(log: iLog, rule: iRule): iAlert {
		return {
			id: uuidv4(),
			ruleId: rule.id,
			ruleName: rule.name,
			severity: rule.severity,
			message: `Rule '${rule.name}' triggered: ${rule.description}`,
			triggerLogFingerprint: log.fingerprint || 'unknown',
			createdAt: new Date().toISOString(),
			isRead: false
		}
	}

	private getValueByPath(obj: any, path: string) {
		return path.split('.').reduce((acc, part) => acc && acc[part], obj)
	}
}
