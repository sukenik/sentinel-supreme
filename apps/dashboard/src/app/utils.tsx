import { eLogLevel, eUserRole, iUser } from '@sentinel-supreme/shared'
import { LayoutDashboard, Search, Server, Settings, ShieldAlert } from 'lucide-react'
import AiManager from './components/AiManager/AiManager'
import DashboardView from './components/DashboardView'
import NotificationManager from './components/NotificationsManager'
import UserManager from './components/UserManager'
import { eMenuOptions, eSettingsMenu } from './consts'
import InvestigationPage from './pages/InvestigationPage'
import MachinesPage from './pages/MachinesPage'
import RulesPage from './pages/RulesPage'
import SettingsPage from './pages/SettingsPage'
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
	const options = [eMenuOptions.DASHBOARD, eMenuOptions.INVESTIGATION]

	if (role === eUserRole.ADMIN) {
		return options.concat([eMenuOptions.MACHINES, eMenuOptions.RULES, eMenuOptions.SETTINGS])
	}

	return options
}

export const getComponentByMenuOption = (option: eMenuOptions) => {
	switch (option) {
		case eMenuOptions.DASHBOARD:
			return DashboardView
		case eMenuOptions.INVESTIGATION:
			return InvestigationPage
		case eMenuOptions.MACHINES:
			return MachinesPage
		case eMenuOptions.RULES:
			return RulesPage
		case eMenuOptions.SETTINGS:
			return SettingsPage
		default:
			return DashboardView
	}
}

export const getStyleByRole = (role: eUserRole, isEditMode: boolean) =>
	role === eUserRole.ADMIN
		? `bg-purple-500/20 text-purple-400 ${isEditMode ? 'hover:bg-purple-500/40 cursor-pointer' : ''}`
		: `bg-blue-500/20 text-blue-400 ${isEditMode ? 'hover:bg-blue-500/40 cursor-pointer' : ''}`

export const getErrorMsg = (
	id: string,
	email: string,
	password: string,
	role: eUserRole,
	users: iUser[],
	isAdding: boolean
): string => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

	if (!emailRegex.test(email)) {
		return 'Invalid email format'
	}

	const isEmailInUse = users.some(
		(user) => user.email.toLowerCase() === email.toLowerCase() && user.id !== id
	)

	if (isEmailInUse) {
		return 'Email already in use'
	}

	if (role !== eUserRole.ADMIN && users.length === 1 && !isAdding) {
		return 'There must be at least one admin'
	}

	const passwordErrMsg = 'Password must be at least 8 characters long'

	if (isAdding) {
		if (!password) {
			return passwordErrMsg
		}
	}

	if (password.length && password?.length < 8) {
		return passwordErrMsg
	}

	return ''
}

export const getIconByMenuOption = (option: eMenuOptions) => {
	const props = { size: 20 }

	switch (option) {
		case eMenuOptions.DASHBOARD:
			return <LayoutDashboard {...props} />
		case eMenuOptions.INVESTIGATION:
			return <Search {...props} />
		case eMenuOptions.MACHINES:
			return <Server {...props} />
		case eMenuOptions.RULES:
			return <ShieldAlert {...props} />
		case eMenuOptions.SETTINGS:
			return <Settings {...props} />
		default:
			return <LayoutDashboard {...props} />
	}
}

export const getComponentBySettingsMenu = (menu: eSettingsMenu) => {
	switch (menu) {
		case eSettingsMenu.USER:
			return UserManager
		case eSettingsMenu.NOTIFICATION:
			return NotificationManager
		case eSettingsMenu.AI:
			return AiManager
		default:
			return UserManager
	}
}
