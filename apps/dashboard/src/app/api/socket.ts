import { appConfig, GATEWAY_ROUTES, SERVER_GLOBAL_PREFIX } from '@sentinel-supreme/shared'
import axios from 'axios'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '../store/useAuthStore'

export const socket: Socket = io(`${appConfig.GATEWAY_URL}${GATEWAY_ROUTES.WS_DASHBOARD_STREAM}`, {
	transports: ['websocket'],
	autoConnect: false
})

export const connectSocket = (token: string) => {
	socket.auth = { token }
	if (socket.disconnected) {
		socket.connect()
	}
}

export const disconnectSocket = () => {
	socket.disconnect()
}

socket.on('connect_error', async (err) => {
	if (err.message === 'jwt expired') {
		console.warn('WS Token expired, attempting refresh...')
		try {
			const response = await axios.post(
				`${appConfig.GATEWAY_URL}${SERVER_GLOBAL_PREFIX}${GATEWAY_ROUTES.AUTH}${GATEWAY_ROUTES.REFRESH}`,
				{},
				{ withCredentials: true }
			)
			const { access_token } = response.data.data

			useAuthStore.getState().setAuth(access_token, useAuthStore.getState().user!)
			connectSocket(access_token)
		} catch (refreshErr) {
			useAuthStore.getState().logout()
		}
	}
})
