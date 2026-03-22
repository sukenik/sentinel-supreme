import { eLogLevel, eUserRole } from '@sentinel-supreme/shared'
import { LogLiveList } from './components/LogLiveList'
import MachinesPage from './components/MachinesPage'
import SettingsPage from './components/SettingsPage'
import { eMenuOptions } from './consts'
import { useAuthStore } from './store/useAuthStore'

export const getLevelColor = (level: eLogLevel) => {
	switch (level.toLowerCase()) {
		case eLogLevel.ERROR:
			return 'bg-red-900/40 text-red-400'
		case eLogLevel.WARN:
			return 'bg-yellow-900/40 text-yellow-400'
		case eLogLevel.DEBUG:
			return 'bg-purple-900/40 text-purple-400'
		default:
			return 'bg-green-900/40 text-green-400'
	}
}

export const useMenuOptionsByRole = () => {
	const role = useAuthStore().user?.role
	const options = [eMenuOptions.DASHBOARD]

	if (role === eUserRole.ADMIN) {
		return options.concat([eMenuOptions.MACHINES, eMenuOptions.SETTINGS])
	}

	return options
}

export const getComponentByMenuOption = (option: eMenuOptions) => {
	switch (option) {
		case eMenuOptions.DASHBOARD:
			return LogLiveList
		case eMenuOptions.MACHINES:
			return MachinesPage
		case eMenuOptions.SETTINGS:
			return SettingsPage
		default:
			return LogLiveList
	}
}
