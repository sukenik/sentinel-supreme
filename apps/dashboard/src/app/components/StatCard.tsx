import { FC } from 'react'

interface iProps {
	title: string
	value: string | number
	label: string
}

const StatCard: FC<iProps> = ({ title, value, label }) => (
	<div className='bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col gap-1 shadow-sm hover:border-slate-700 transition-colors'>
		<span className='text-slate-400 text-xs font-semibold uppercase tracking-wider'>
			{title}
		</span>
		<span className='text-3xl font-bold text-white tracking-tight'>{value}</span>
		<span className='text-xs text-slate-500 mt-1'>{label}</span>
	</div>
)

export default StatCard
