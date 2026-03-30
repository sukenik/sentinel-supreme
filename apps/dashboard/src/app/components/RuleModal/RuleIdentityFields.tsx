import { tRule } from '@sentinel-supreme/shared'
import { useFormContext } from 'react-hook-form'

const RuleIdentityFields = () => {
	const {
		register,
		formState: { errors }
	} = useFormContext<tRule>()

	return (
		<>
			<div className='col-span-2 space-y-2'>
				<label className='text-sm text-slate-400'>{'Rule Name*'}</label>
				<input
					{...register('name', { required: 'Required' })}
					className={`w-full bg-slate-800 border ${errors.name ? 'border-red-500' : 'border-slate-700'} rounded-lg p-2 text-white outline-none focus:border-indigo-500`}
					placeholder='e.g. Brute Force IP Block'
				/>
				{errors.name && <p className='text-red-500 text-[14px]'>{errors.name.message}</p>}
			</div>

			<div className='col-span-2 space-y-2'>
				<label className='text-sm text-slate-400'>{'Description (Optional)'}</label>
				<textarea
					{...register('description')}
					rows={2}
					className='w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-indigo-500 transition-colors resize-none'
					placeholder='Explain what this rule detects...'
				/>
			</div>
		</>
	)
}

export default RuleIdentityFields
