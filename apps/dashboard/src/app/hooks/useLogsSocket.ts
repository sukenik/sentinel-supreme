import { appConfig, GATEWAY_DASHBOARD_NAMESPACE, iLog, WS_EVENTS } from '@sentinel-supreme/shared'
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export const useLogsSocket = () => {
	const [logs, setLogs] = useState<iLog[]>([])
	const [isConnected, setIsConnected] = useState(false)

	const { GATEWAY_URL } = appConfig

	useEffect(() => {
		const socket: Socket = io(`${GATEWAY_URL}${GATEWAY_DASHBOARD_NAMESPACE}`, {
			transports: ['websocket']
		})

		socket.on('connect', () => {
			setIsConnected(true)
			console.log('Connected to Sentinel Socket')
		})

		socket.on(WS_EVENTS.LOG_RECEIVED, (newLog: iLog) => {
			setLogs((prevLogs) => {
				const updatedLogs = [newLog, ...prevLogs]
				return updatedLogs.slice(0, 100)
			})
		})

		socket.on('disconnect', () => {
			setIsConnected(false)
		})

		return () => {
			socket.disconnect()
		}
	}, [])

	return { logs, isConnected }
}
