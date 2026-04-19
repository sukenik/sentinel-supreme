import { FC, MouseEvent, useState } from 'react'
import { eSettingsMenu, SETTINGS_MENU_DICT } from '../consts'
import { getComponentBySettingsMenu } from '../utils'

const SettingsPage: FC = () => {
	const [openMenu, setOpenMenu] = useState<eSettingsMenu>()

	const handleToggleMenu = (e: MouseEvent) => {
		const menu = e.currentTarget.id as eSettingsMenu

		openMenu === menu ? setOpenMenu(undefined) : setOpenMenu(menu)
	}

	const MenuComponent = openMenu && getComponentBySettingsMenu(openMenu)

	return (
		<div className='p-6 bg-slate-900 h-full text-blue-100 flex flex-col border border-slate-800 rounded-xl overflow-y-auto custom-scrollbar'>
			<div className='mb-6 shrink-0'>
				<h1 className='text-3xl font-bold tracking-tight'>{'System Settings'}</h1>
				<p className='text-slate-400 text-sm'>
					{'Manage global configurations and user permissions.'}
				</p>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-4'>
				{Object.values(eSettingsMenu).map((menu) => (
					<div className='p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-cyan-500/50 transition-colors'>
						<h3 className='text-lg font-bold mb-2 text-cyan-400'>{`${menu} Management`}</h3>
						<p className='text-sm text-slate-400 mb-4'>
							{SETTINGS_MENU_DICT[menu].info}
						</p>
						<button
							id={menu}
							onClick={handleToggleMenu}
							className='text-xs bg-slate-700 px-3 py-2 rounded-lg hover:bg-slate-600 transition-all cursor-pointer'
						>
							{`${openMenu === menu ? 'Close' : 'Open'} ${menu} Manager`}
						</button>
					</div>
				))}
			</div>
			{MenuComponent && (
				<div className='flex-1 mt-8'>
					<MenuComponent />
				</div>
			)}
		</div>
	)
}

export default SettingsPage
