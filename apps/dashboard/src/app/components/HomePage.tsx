import { FC, MouseEvent, useState } from 'react'
import { eMenuOptions } from '../consts'
import { getComponentByMenuOption, useMenuOptionsByRole } from '../utils'

const HomePage: FC = () => {
	const [openOption, setOpenOption] = useState(eMenuOptions.DASHBOARD)

	const options = useMenuOptionsByRole()

	const handleMachinesClick = (e: MouseEvent) => {
		setOpenOption(e.currentTarget.id as eMenuOptions)
	}

	const OpenComponent = getComponentByMenuOption(openOption)

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
					<div className='flex items-center space-x-4'>
						<div className='w-8 h-8 rounded-full bg-accent flex items-center justify-center text-slate-950 font-bold'>
							{'D'}
						</div>
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
