import { appConfig, GATEWAY_DASHBOARD_NAMESPACE, iLog, WS_EVENTS } from '@sentinel-supreme/shared'
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useLogStore } from '../store/useLogStore'
import { useAuthStore } from '../store/useAuthStore'

export const useLogsSocket = () => {
	const addLog = useLogStore((state) => state.addLog)
	const [isConnected, setIsConnected] = useState(false)

	const { GATEWAY_URL } = appConfig

	const token = useAuthStore((state) => state.access_token)

	useEffect(() => {
		if (!token) return

		const socket: Socket = io(`${GATEWAY_URL}${GATEWAY_DASHBOARD_NAMESPACE}`, {
			transports: ['websocket'],
			auth: { token }
		})

		socket.on('connect', () => setIsConnected(true))
		socket.on('disconnect', () => setIsConnected(false))

		socket.on(WS_EVENTS.LOG_RECEIVED, (newLog: iLog) => {
			addLog(newLog)
		})

		return () => {
			socket.disconnect()
		}
	}, [addLog, token])

	return { isConnected }
}
