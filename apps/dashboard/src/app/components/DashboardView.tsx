import { FC } from 'react'
import AlertsTable from '../components/AlertsTable'
import LiveLogList from '../components/LiveLogList'
import { useDashboardSocket } from '../hooks/useDashboardSocket'
import { useAlertStore } from '../store/useAlertStore'
import StatCard from './StatCard'

const DashboardView: FC = () => {
	const { isConnected } = useDashboardSocket()
	const { alerts, stats } = useAlertStore()

	return (
		<div className='flex flex-col h-full gap-6 overflow-y-auto xl:overflow-hidden custom-scrollbar'>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0'>
				<StatCard
					title='Critical Alerts Today'
					value={stats.criticalToday}
					label={isConnected ? 'Real-time monitoring' : 'Offline'}
				/>
				<StatCard title='Total Logs 24h' value={stats.total24h} label='Aggregated data' />
				<StatCard
					title='Active Rules'
					value={stats.activeRules}
					label='Rules engine status'
				/>
			</div>

			<div className='flex-1 flex flex-col xl:flex-row gap-6 min-h-0'>
				<div className='flex-[2.5] flex flex-col min-h-125 xl:min-h-0'>
					<AlertsTable alerts={alerts} />
				</div>

				<div className='flex-1 min-h-100 xl:min-h-0 2xl:min-w-97 3xl:min-w-183'>
					<LiveLogList />
				</div>
			</div>
		</div>
	)
}

export default DashboardView
