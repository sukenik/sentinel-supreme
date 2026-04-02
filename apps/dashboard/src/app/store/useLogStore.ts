import { iLog } from '@sentinel-supreme/shared'
import { create } from 'zustand'

interface LogState {
	logs: iLog[]
	addLog: (log: iLog) => void
	clearLogs: () => void
}

export const useLogStore = create<LogState>((set) => ({
	logs: [],
	addLog: (log) =>
		set((state) => {
			return {
				logs: [log, ...state.logs].slice(0, 100)
			}
		}),
	clearLogs: () => set({ logs: [] })
}))
