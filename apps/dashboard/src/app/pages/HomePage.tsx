import { GATEWAY_ROUTES } from '@sentinel-supreme/shared'
import { Menu } from 'lucide-react'
import { FC, MouseEvent, useEffect, useRef, useState } from 'react'
import api from '../api/axiosInstance'
import Tooltip from '../components/Tooltip'
import { eMenuOptions, SIDEBAR_COLLAPSED_LOCAL_STORAGE } from '../consts'
import { useAuthStore } from '../store/useAuthStore'
import { getComponentByMenuOption, getIconByMenuOption, useMenuOptionsByRole } from '../utils'

const HomePage: FC = () => {
	const [openOption, setOpenOption] = useState(eMenuOptions.DASHBOARD)
	const [isPopupOpen, setIsPopupOpen] = useState(false)
	const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
		const saved = localStorage.getItem(SIDEBAR_COLLAPSED_LOCAL_STORAGE)
		return saved ? JSON.parse(saved) : false
	})
	const popupRef = useRef<HTMLDivElement>(null)

	const options = useMenuOptionsByRole()
	const { user, logout } = useAuthStore()

	const handleMachinesClick = (e: MouseEvent) => {
		setOpenOption(e.currentTarget.id as eMenuOptions)
	}

	const handleAvatarClick = () => {
		setIsPopupOpen(!isPopupOpen)
	}

	const handleCollapseToggle = () => {
		setIsCollapsed(!isCollapsed)
	}

	const handleLogout = async () => {
		try {
			await api.post(`${GATEWAY_ROUTES.AUTH}${GATEWAY_ROUTES.LOGOUT}`)
		} catch (err) {
			console.error('Server logout failed', err)
		} finally {
			logout()
		}
	}

	useEffect(() => {
		localStorage.setItem(SIDEBAR_COLLAPSED_LOCAL_STORAGE, JSON.stringify(isCollapsed))
	}, [isCollapsed])

	useEffect(() => {
		const handleClickOutside = (event: globalThis.MouseEvent) => {
			if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
				setIsPopupOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [popupRef])

	const OpenComponent = getComponentByMenuOption(openOption)

	const userInitial = user?.email.charAt(0).toUpperCase() || '?'

	return (
		<div className='flex h-screen w-full bg-slate-950 text-white overflow-hidden'>
			<aside
				className={`${isCollapsed ? 'w-20' : 'w-64'} bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out relative`}
			>
				<div
					className={`flex items-center p-4 h-16 ${isCollapsed ? 'justify-start' : 'justify-between'}`}
				>
					{!isCollapsed && (
						<div className='flex items-center gap-2 overflow-hidden whitespace-nowrap'>
							<img src='favicon.ico' alt='Logo' className='h-8 w-8 min-w-8' />
							<span className='text-xl text-accent tracking-tighter'>
								{'Sentinel Supreme'}
							</span>
						</div>
					)}
					<button
						onClick={handleCollapseToggle}
						className='p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer'
					>
						<Menu size={20} />
					</button>
				</div>
				<nav className='flex-1 px-3 space-y-2 mt-4'>
					{options.map((option) => (
						<Tooltip key={option} text={option} position='right' show={isCollapsed}>
							<div
								key={option}
								id={option}
								onClick={handleMachinesClick}
								className={`
								group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
								${
									option === openOption
										? 'bg-accent/10 text-accent border border-accent/20'
										: 'hover:bg-slate-800 text-slate-400 hover:text-white border border-transparent'
								}
								${isCollapsed ? 'justify-center' : ''}
							`}
							>
								<span className={option === openOption ? 'text-accent' : ''}>
									{getIconByMenuOption(option)}
								</span>
								{!isCollapsed && (
									<span className='font-medium overflow-hidden whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-200'>
										{option}
									</span>
								)}
							</div>
						</Tooltip>
					))}
				</nav>
				<div
					className={`p-4 border-t border-slate-800 text-xs text-slate-500 ${isCollapsed ? 'text-center' : ''}`}
				>
					{isCollapsed ? 'v1' : 'v1.0.0-alpha'}
				</div>
			</aside>
			<main className='flex-1 flex flex-col overflow-hidden'>
				<header className='h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8'>
					<h1 className='text-lg font-medium text-slate-300'>
						{isCollapsed && <span className='text-accent mr-2'>|</span>}
						{openOption}
					</h1>
					<div className='relative' ref={popupRef}>
						<div
							className='w-8 h-8 rounded-full bg-accent flex items-center justify-center text-slate-950 font-bold cursor-pointer'
							onClick={handleAvatarClick}
						>
							{userInitial}
						</div>
						{isPopupOpen && (
							<div className='absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg z-10'>
								<div className='px-4 py-2 text-sm text-slate-400'>
									{user?.email}
								</div>
								<div className='border-t border-slate-700' />
								<div
									className='block px-4 py-2 text-sm text-white hover:bg-slate-700 cursor-pointer rounded-md'
									onClick={handleLogout}
								>
									{'Logout'}
								</div>
							</div>
						)}
					</div>
				</header>
				<section className='flex-1 p-8 overflow-hidden flex flex-col'>
					{<OpenComponent />}
				</section>
			</main>
		</div>
	)
}

export default HomePage
