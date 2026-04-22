import { Database } from 'lucide-react'
import { FC } from 'react'

interface iProps {
	totalTokensUsed: number
}

const UsageStats: FC<iProps> = ({ totalTokensUsed }) => {
	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-left-4 duration-300'>
			<div className='p-6 bg-slate-800/40 border border-slate-700 rounded-xl backdrop-blur-sm'>
				<div className='flex items-center gap-3 mb-4 text-slate-400'>
					<Database size={18} />
					<span className='text-xs font-bold uppercase tracking-wider'>
						{'Total Tokens Used'}
					</span>
				</div>
				<div className='text-4xl font-mono text-white'>
					{Number(totalTokensUsed).toLocaleString()}
				</div>
				<div className='mt-4 h-1 w-full bg-slate-700 rounded-full overflow-hidden'>
					<div
						className='h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee]'
						// TODO:
						style={{ width: '65%' }}
					/>
				</div>
				<p className='text-xs text-slate-500 mt-4 font-mono uppercase'>
					{'Cumulative processing load since last cycle'}
				</p>
			</div>
		</div>
	)
}

export default UsageStats
