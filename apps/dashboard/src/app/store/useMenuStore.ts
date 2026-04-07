import { create } from 'zustand'
import { eMenuOptions } from '../consts'

interface MenuState {
	openOption: eMenuOptions
	searchContext: string | null
	setOpenOption: (option: eMenuOptions, context?: string) => void
	clearSearchContext: () => void
}

export const useMenuStore = create<MenuState>((set) => ({
	openOption: eMenuOptions.DASHBOARD,
	searchContext: null,
	setOpenOption: (option, context) =>
		set({
			openOption: option,
			searchContext: context || null
		}),
	clearSearchContext: () => set({ searchContext: null })
}))
