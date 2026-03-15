import { appConfig, GATEWAY_DASHBOARD_NAMESPACE, iLog, WS_EVENTS } from '@sentinel-supreme/shared'
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useLogStore } from '../store/useLogStore'

export const useLogsSocket = () => {
	const addLog = useLogStore((state) => state.addLog)
	const [isConnected, setIsConnected] = useState(false)

	const { GATEWAY_URL } = appConfig

	useEffect(() => {
		const socket: Socket = io(`${GATEWAY_URL}${GATEWAY_DASHBOARD_NAMESPACE}`, {
			transports: ['websocket']
		})

		socket.on('connect', () => setIsConnected(true))
		socket.on('disconnect', () => setIsConnected(false))

		socket.on(WS_EVENTS.LOG_RECEIVED, (newLog: iLog) => {
			addLog(newLog)
		})

		return () => {
			socket.disconnect()
		}
	}, [addLog])

	return { isConnected }
}
