import { create } from 'zustand'
import { iLog } from '@sentinel-supreme/shared'

interface LogState {
	logs: iLog[]
	addLog: (log: iLog) => void
	clearLogs: () => void
}

export const useLogStore = create<LogState>((set) => ({
	logs: [],
	addLog: (log) =>
		set((state) => {
			const isDuplicate = state.logs.some(
				({ fingerprint }) => log.fingerprint === fingerprint
			)
			if (isDuplicate) return state

			return {
				logs: [log, ...state.logs].slice(0, 100)
			}
		}),
	clearLogs: () => set({ logs: [] })
}))
