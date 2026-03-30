import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { tRule } from '@sentinel-supreme/shared'

const RuleActiveToggle: FC = () => {
	const { watch, setValue } = useFormContext<tRule>()

	const isActive = watch('isActive')

	const handleToggle = () => {
		setValue('isActive', !isActive)
	}

	return (
		<div className='col-span-2 flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-800'>
			<div className='flex flex-col'>
				<span className='text-sm font-medium text-white'>{'Active Status'}</span>
				<span className='text-xs text-slate-500'>
					{'Enable or disable this rule in real-time'}
				</span>
			</div>
			<button
				type='button'
				onClick={handleToggle}
				className={`w-12 h-6 rounded-full transition-colors relative outline-none cursor-pointer ${isActive ? 'bg-indigo-600' : 'bg-slate-700'}`}
			>
				<div
					className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${isActive ? 'left-7' : 'left-1'}`}
				/>
			</button>
		</div>
	)
}

export default RuleActiveToggle
