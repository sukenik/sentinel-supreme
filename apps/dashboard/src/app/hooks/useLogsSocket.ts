import { appConfig, GATEWAY_ROUTES, iLog, WS_EVENTS } from '@sentinel-supreme/shared'
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import api from '../api/axiosInstance'
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

		socket.on('connect_error', async (err) => {
			if (err.message === 'jwt expired') {
				console.warn('WS Token expired, attempting refresh...')

				try {
					const response = await api.post(
						`${appConfig.GATEWAY_URL}${GATEWAY_ROUTES.PREFIX}${GATEWAY_ROUTES.AUTH}${GATEWAY_ROUTES.REFRESH}`,
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
		})

		return () => {
			socket.disconnect()
		}
	}, [access_token, addLog, logout])

	return { isConnected }
}
