export const ROUTES = {
	HOME_PAGE: '/',
	LOGIN_PAGE: '/login'
}

export enum eMenuOptions {
	DASHBOARD = 'Dashboard',
	INVESTIGATION = 'Investigation',
	MACHINES = 'Machines',
	RULES = 'Rules',
	SETTINGS = 'Settings'
}

export enum eSettingsMenu {
	USER = 'User',
	NOTIFICATION = 'Notification',
	AI = 'AI'
}

export enum eAiSettingsTabs {
	MODELS = 'Models',
	PROMPTS = 'Prompts',
	USAGE = 'Usage'
}

export const SETTINGS_MENU_DICT = {
	[eSettingsMenu.USER]: {
		info: 'Assign roles and manage active users in the system.'
	},
	[eSettingsMenu.NOTIFICATION]: {
		info: 'Manage how and when you get alerted.'
	},
	[eSettingsMenu.AI]: {
		info: 'Configure LLM models, monitor token usage, and refine the AI analysis engine.'
	}
}

export const SIDEBAR_COLLAPSED_LOCAL_STORAGE = 'sidebar-collapsed'
