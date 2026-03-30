import { iRateLimitRule, tRule } from '@sentinel-supreme/shared'
import { FieldErrors, useFormContext } from 'react-hook-form'

const RateLimitFields = () => {
	const {
		register,
		formState: { errors }
	} = useFormContext<tRule>()

	return (
		<div className='col-span-2 grid grid-cols-3 gap-4 p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/20 animate-in fade-in slide-in-from-top-2'>
			<div className='space-y-2'>
				<label className='text-xs text-indigo-400 font-bold uppercase'>
					{'Limit (Events)'}
				</label>
				<input
					type='number'
					min={0}
					defaultValue={5}
					{...register('limit')}
					className='w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-sm'
				/>
			</div>
			<div className='space-y-2'>
				<label className='text-xs text-indigo-400 font-bold uppercase'>
					{'Window (Sec)'}
				</label>
				<input
					type='number'
					min={0}
					defaultValue={60}
					{...register('windowSeconds')}
					className='w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-sm'
				/>
			</div>
			<div className='space-y-2'>
				<label className='text-xs text-indigo-400 font-bold uppercase'>{'Group By*'}</label>
				<input
					{...register('groupBy', {
						required: 'Required'
					})}
					className={`w-full bg-slate-800 border ${(errors as FieldErrors<iRateLimitRule>).groupBy ? 'border-red-500' : 'border-slate-700'} rounded-lg p-2 text-white text-sm outline-none focus:border-indigo-500`}
					placeholder='sourceIp'
				/>
				{(errors as FieldErrors<iRateLimitRule>).groupBy && (
					<p className='text-red-500 text-[14px]'>
						{(errors as FieldErrors<iRateLimitRule>).groupBy?.message}
					</p>
				)}
			</div>
		</div>
	)
}

export default RateLimitFields
