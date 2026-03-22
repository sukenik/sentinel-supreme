import { appConfig, GATEWAY_ROUTES } from '@sentinel-supreme/shared'
import axios from 'axios'
import { ROUTES } from '../consts'
import { useAuthStore } from '../store/useAuthStore'

const api = axios.create({
	withCredentials: true,
	baseURL: `${appConfig.GATEWAY_URL}${GATEWAY_ROUTES.PREFIX}`
})

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().access_token

	if (token && config.headers) {
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
})

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error)
		} else {
			prom.resolve(token)
		}
	})

	failedQueue = []
}

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject })
				})
					.then((token) => {
						originalRequest.headers.Authorization = `Bearer ${token}`
						return api(originalRequest)
					})
					.catch((err) => Promise.reject(err))
			}

			originalRequest._retry = true
			isRefreshing = true

			try {
				const { data } = await axios.post(
					`${appConfig.GATEWAY_URL}${GATEWAY_ROUTES.PREFIX}${GATEWAY_ROUTES.AUTH}${GATEWAY_ROUTES.REFRESH}`,
					{},
					{ withCredentials: true }
				)

				const { access_token } = data.data

				useAuthStore.getState().setAuth(access_token, useAuthStore.getState().user!)

				processQueue(null, access_token)

				originalRequest.headers.Authorization = `Bearer ${data.access_token}`

				return api(originalRequest)
			} catch (refreshError) {
				processQueue(refreshError, null)
				useAuthStore.getState().logout()
				window.location.href = ROUTES.LOGIN_PAGE

				return Promise.reject(refreshError)
			} finally {
				isRefreshing = false
			}
		}

		return Promise.reject(error)
	}
)

export default api
