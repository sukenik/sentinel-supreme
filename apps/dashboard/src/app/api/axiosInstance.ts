import { appConfig, GATEWAY_ROUTES } from '@sentinel-supreme/shared'
import axios from 'axios'
import { ROUTES } from '../consts'
import { useAuthStore } from '../store/useAuthStore'

const api = axios.create({
	baseURL: `${appConfig.GATEWAY_URL}${GATEWAY_ROUTES.PREFIX}`
})

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().access_token

	if (token && config.headers) {
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
})

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			useAuthStore.getState().logout()
			window.location.href = ROUTES.LOGIN_PAGE
		}
		return Promise.reject(error)
	}
)

export default api
