import { GATEWAY_ROUTES } from '@sentinel-supreme/shared'
import { FC, MouseEvent, useEffect, useRef, useState } from 'react'
import api from '../api/axiosInstance'
import { eMenuOptions } from '../consts'
import { useAuthStore } from '../store/useAuthStore'
import { getComponentByMenuOption, useMenuOptionsByRole } from '../utils'

const HomePage: FC = () => {
	const [openOption, setOpenOption] = useState(eMenuOptions.DASHBOARD)
	const [isPopupOpen, setIsPopupOpen] = useState(false)
	const popupRef = useRef<HTMLDivElement>(null)

	const options = useMenuOptionsByRole()
	const { user, logout } = useAuthStore()

	const handleMachinesClick = (e: MouseEvent) => {
		setOpenOption(e.currentTarget.id as eMenuOptions)
	}

	const handleAvatarClick = () => {
		setIsPopupOpen(!isPopupOpen)
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
			<aside className='w-64 bg-slate-900 border-r border-slate-800 flex flex-col'>
				<div className='flex justify-center items-center p-4 gap-2'>
					<img
						src='favicon.ico'
						alt='Sentinel-Supreme icon'
						style={{ height: '32px', width: '30px' }}
					/>
					<div className='text-2xl font- text-accent tracking-tighter'>
						{'Sentinel Supreme'}
					</div>
				</div>
				<nav className='flex-1 px-4 space-y-2'>
					{options.map((option) => (
						<div
							key={option}
							id={option}
							onClick={handleMachinesClick}
							className={`${option === openOption ? '' : 'hover:'}bg-slate-800 p-3 rounded-lg cursor-pointer transition`}
						>
							{option}
						</div>
					))}
				</nav>
				<div className='p-4 border-t border-slate-800 text-sm text-slate-400'>
					{'v1.0.0-alpha'}
				</div>
			</aside>
			<main className='flex-1 flex flex-col overflow-hidden'>
				<header className='h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8'>
					<h1 className='text-lg font-medium'>{'Overview'}</h1>
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
