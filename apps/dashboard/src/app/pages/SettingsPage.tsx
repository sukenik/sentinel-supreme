import { FC, useState } from 'react'
import UserManager from '../components/UserManager'

const SettingsPage: FC = () => {
	const [showUserManager, setShowUserManager] = useState(false)

	const handleToggleUserManager = () => {
		setShowUserManager((prevState) => !prevState)
	}

	return (
		<div className='p-6 bg-slate-900 h-full text-blue-100 flex flex-col border border-slate-800 rounded-xl'>
			<div className='mb-6 h-10'>
				<h1 className='text-3xl font-bold tracking-tight'>{'System Settings'}</h1>
				<p className='text-slate-400 text-sm'>
					{'Manage global configurations and user permissions.'}
				</p>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-4'>
				<div className='p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-cyan-500/50 transition-colors'>
					<h3 className='text-lg font-bold mb-2 text-cyan-400'>{'User Management'}</h3>
					<p className='text-sm text-slate-400 mb-4'>
						{'Assign roles and manage active users in the system.'}
					</p>
					<button
						onClick={handleToggleUserManager}
						className='text-xs bg-slate-700 px-3 py-2 rounded-lg hover:bg-slate-600 transition-all'
					>
						{`${showUserManager ? 'Close' : 'Open'} User Manager`}
					</button>
				</div>

				<div className='p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-cyan-500/50 transition-colors'>
					<h3 className='text-lg font-bold mb-2 text-cyan-400'>{'Alert Thresholds'}</h3>
					<p className='text-sm text-slate-400 mb-4'>
						{'Set global rules for when a log should trigger a Critical alert.'}
					</p>
					<button className='text-xs bg-slate-700 px-3 py-2 rounded-lg hover:bg-slate-600 transition-all'>
						{'Configure Alerts'}
					</button>
				</div>
			</div>

			{showUserManager && <UserManager />}
		</div>
	)
}

export default SettingsPage
