import {
	eSeverity,
	GATEWAY_ROUTES,
	iAlert,
	iAlertUpdate,
	iLog,
	twentyFourHoursAgo,
	WS_EVENTS
} from '@sentinel-supreme/shared'
import { useCallback, useEffect, useState } from 'react'
import api from '../api/axiosInstance'
import { socket } from '../api/socket'
import { useAlertStore } from '../store/useAlertStore'
import { useAuthStore } from '../store/useAuthStore'
import { useLogStore } from '../store/useLogStore'
import { useRuleStore } from '../store/useRuleStore'
import { useStatStore } from '../store/useStatStore'

const getCriticalTodayAlerts = (alerts: iAlert[]) => {
	const criticalAlerts = alerts.filter(({ severity }) => severity === eSeverity.CRITICAL)

	return criticalAlerts.filter((alert) => {
		const alertDate = new Date(alert.createdAt)
		return alertDate >= twentyFourHoursAgo
	})
}

export const useDashboardSocket = () => {
	const [isConnected, setIsConnected] = useState(socket.connected)
	const { access_token } = useAuthStore()

	const { addLog } = useLogStore()
	const { addAlert, setAlerts } = useAlertStore()
	const { updateStats, incrementCritical, incrementLogs } = useStatStore()
	const { fetchRules } = useRuleStore()

	const fetchInitialData = useCallback(async () => {
		try {
			const [alertsRes, rules, logsCountRes] = await Promise.all([
				api.get(GATEWAY_ROUTES.ALERTS),
				fetchRules(),
				api.get(`${GATEWAY_ROUTES.LOG_SEARCH}${GATEWAY_ROUTES.LOG_COUNT}`)
			])

			const alerts = alertsRes.data.data as iAlert[]
			const totalLogsLastDay = logsCountRes.data.data as number
			const activeRules = rules.filter(({ isActive }) => isActive)
			const criticalTodayAlerts = getCriticalTodayAlerts(alerts)

			setAlerts(alerts)
			updateStats({
				activeRules: activeRules.length,
				totalLogsLastDay: totalLogsLastDay,
				criticalAlertsToday: criticalTodayAlerts.length
			})
		} catch (err) {
			console.error('Failed to fetch initial alerts', err)
		}
	}, [setAlerts, updateStats, fetchRules])

	useEffect(() => {
		if (!access_token) return

		fetchInitialData()

		const onConnect = () => setIsConnected(true)
		const onDisconnect = () => setIsConnected(false)

		socket.on('connect', onConnect)
		socket.on('disconnect', onDisconnect)

		socket.on(WS_EVENTS.LOG_RECEIVED, (newLog: iLog) => {
			addLog(newLog)
			incrementLogs()
		})

		socket.on(WS_EVENTS.ALERT_RECEIVED, (newAlert: iAlert) => {
			addAlert(newAlert)
			if (newAlert.severity === eSeverity.CRITICAL) {
				incrementCritical()
			}
		})

		socket.on(WS_EVENTS.AI_ANALYSIS_RECEIVED, (update: iAlertUpdate) => {
			useAlertStore
				.getState()
				.updateAlert(update.alertId, { aiInsight: update.aiInsight || null })
		})

		return () => {
			socket.off('connect', onConnect)
			socket.off('disconnect', onDisconnect)
			socket.off(WS_EVENTS.LOG_RECEIVED)
			socket.off(WS_EVENTS.ALERT_RECEIVED)
			socket.off(WS_EVENTS.AI_ANALYSIS_RECEIVED)
		}
	}, [access_token, fetchInitialData, addLog, addAlert, incrementCritical, incrementLogs])

	return { isConnected }
}
