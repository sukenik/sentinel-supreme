import {
	appConfig,
	eSeverity,
	GATEWAY_ROUTES,
	iAlert,
	iAlertUpdate,
	iLog,
	twentyFourHoursAgo,
	WS_EVENTS
} from '@sentinel-supreme/shared'
import { useCallback, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import api from '../api/axiosInstance'
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
	const [isConnected, setIsConnected] = useState(false)

	const { access_token, logout } = useAuthStore()
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

		const socket: Socket = io(`${appConfig.GATEWAY_URL}${GATEWAY_ROUTES.WS_DASHBOARD_STREAM}`, {
			transports: ['websocket'],
			auth: { token: access_token }
		})

		socket.on('connect', () => setIsConnected(true))
		socket.on('disconnect', () => setIsConnected(false))

		socket.on('connect_error', async (err) => {
			if (err.message === 'jwt expired') {
				console.warn('WS Token expired, attempting refresh...')

				try {
					const response = await api.post(
						`${GATEWAY_ROUTES.AUTH}${GATEWAY_ROUTES.REFRESH}`,
						{},
						{ withCredentials: true }
					)
					const { access_token } = response.data.data

					useAuthStore.getState().setAuth(access_token, useAuthStore.getState().user!)

					socket.auth = { token: access_token }
					socket.connect()
				} catch (refreshErr) {
					logout()
				}
			} else {
				logout()
			}
		})

		socket.on(WS_EVENTS.LOG_RECEIVED, (newLog: iLog) => {
			addLog(newLog)
			incrementLogs()
		})

		socket.on(WS_EVENTS.ALERT_RECEIVED, (newAlert: iAlert) => {
			addAlert(newAlert)
			newAlert.severity === eSeverity.CRITICAL && incrementCritical()
		})

		socket.on(WS_EVENTS.AI_ANALYSIS_RECEIVED, (update: iAlertUpdate) => {
			useAlertStore.getState().updateAlert(update.alertId, { aiInsight: update.aiInsight })
		})

		socket.on(
			WS_EVENTS.AI_CHAT_CHUNK_RECEIVED,
			(data: { isFinal: boolean; content?: string }) => {
				console.log(data)
			}
		)

		return () => {
			socket.disconnect()
		}
	}, [access_token, fetchInitialData, addLog, addAlert, incrementCritical, incrementLogs, logout])

	return { isConnected }
}
