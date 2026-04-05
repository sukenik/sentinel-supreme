import {
	GATEWAY_ROUTES,
	iLog,
	iLogSearchParams,
	iLogSearchReturnType
} from '@sentinel-supreme/shared'
import { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'

export const useLogsSearch = (initialParams: iLogSearchParams = { page: 1, limit: 50 }) => {
	const [logs, setLogs] = useState<iLog[]>([])
	const [loading, setLoading] = useState(false)
	const [stats, setStats] = useState<iLogSearchReturnType['stats']>()
	const [timeline, setTimeline] = useState<iLogSearchReturnType['timeline']>([])
	const [meta, setMeta] = useState({ total: 0, lastPage: 1 })
	const [params, setParams] = useState(initialParams)
	const [debouncedParams, setDebouncedParams] = useState(initialParams)

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedParams(params)
		}, 500)

		return () => clearTimeout(handler)
	}, [params])

	const fetchLogs = useCallback(async () => {
		setLoading(true)

		try {
			const { data: res } = await axiosInstance.get(
				`${GATEWAY_ROUTES.LOG_SEARCH}${GATEWAY_ROUTES.SEARCH}`,
				{ params: debouncedParams }
			)

			const { data, stats, timeline, meta } = res.data as iLogSearchReturnType

			setLogs(data)
			setStats(stats)
			setTimeline(timeline)
			setMeta(meta)
		} catch (error) {
			console.error('Failed to fetch logs:', error)
		} finally {
			setLoading(false)
		}
	}, [debouncedParams])

	useEffect(() => {
		fetchLogs()
	}, [fetchLogs])

	const updateParams = (newParams: Partial<iLogSearchParams>) => {
		setParams((prev) => ({ ...prev, ...newParams, page: newParams.page || 1 }))
	}

	return { logs, loading, stats, timeline, meta, params, updateParams, refresh: fetchLogs }
}
