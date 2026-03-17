import { appConfig } from '@sentinel-supreme/shared'
import axios from 'axios'
import { useAuthStore } from '../store/useAuthStore'

const api = axios.create({
	baseURL: `${appConfig.GATEWAY_URL}api`
})

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().access_token

	if (token && config.headers) {
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
})

export default api
