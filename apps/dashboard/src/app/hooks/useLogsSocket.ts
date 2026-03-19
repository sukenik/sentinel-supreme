import { appConfig, GATEWAY_ROUTES, iLog, WS_ERRORS, WS_EVENTS } from '@sentinel-supreme/shared'
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '../store/useAuthStore'
import { useLogStore } from '../store/useLogStore'

export const useLogsSocket = () => {
	const [isConnected, setIsConnected] = useState(false)

	const { access_token, logout } = useAuthStore()
	const addLog = useLogStore((state) => state.addLog)

	useEffect(() => {
		if (!access_token) return

		const socket: Socket = io(`${appConfig.GATEWAY_URL}${GATEWAY_ROUTES.WS_DASHBOARD_STREAM}`, {
			transports: ['websocket'],
			auth: { token: access_token }
		})

		socket.on('connect', () => setIsConnected(true))
		socket.on('disconnect', () => setIsConnected(false))

		socket.on('connect_error', (err) => {
			if (err.message === 'jwt expired' || err.message === WS_ERRORS.NO_TOKEN_PROVIDED) {
				logout()
			}
		})

		socket.on(WS_EVENTS.LOG_RECEIVED, (newLog: iLog) => {
			addLog(newLog)
		})

		return () => {
			socket.disconnect()
		}
	}, [access_token, addLog, logout])

	return { isConnected }
}
