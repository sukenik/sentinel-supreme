import { create } from 'zustand'

interface StatsState {
	stats: {
		criticalAlertsToday: number
		totalLogsLastDay: number
		activeRules: number
	}
	updateStats: (newStats: Partial<StatsState['stats']>) => void
	incrementCritical: () => void
	incrementLogs: () => void
	incrementRules: () => void
	decrementRules: () => void
}

export const useStatStore = create<StatsState>((set) => ({
	stats: {
		criticalAlertsToday: 0,
		totalLogsLastDay: 0,
		activeRules: 0
	},
	updateStats: (newStats) =>
		set((state) => ({
			stats: { ...state.stats, ...newStats }
		})),
	incrementCritical: () =>
		set((state) => ({
			stats: { ...state.stats, criticalAlertsToday: state.stats.criticalAlertsToday + 1 }
		})),
	incrementLogs: () =>
		set((state) => ({
			stats: { ...state.stats, totalLogsLastDay: state.stats.totalLogsLastDay + 1 }
		})),
	incrementRules: () =>
		set((state) => ({
			stats: { ...state.stats, activeRules: state.stats.activeRules + 1 }
		})),
	decrementRules: () =>
		set((state) => ({
			stats: { ...state.stats, activeRules: state.stats.activeRules - 1 }
		}))
}))
