import { eRuleOperator, eRuleType, eSeverity, tRule } from '@sentinel-supreme/shared'
import { useFormContext } from 'react-hook-form'

const RuleLogicFields = () => {
	const {
		register,
		watch,
		formState: { errors }
	} = useFormContext<tRule>()
	const selectedOperator = watch('operator')

	return (
		<>
			<div className='space-y-2'>
				<label className='text-sm text-slate-400'>{'Type'}</label>
				<select
					{...register('type')}
					className='w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-indigo-500 cursor-pointer'
				>
					<option value={eRuleType.STATIC}>{'Static Condition'}</option>
					<option value={eRuleType.RATE_LIMIT}>{'Rate Limit (Threshold)'}</option>
				</select>
			</div>
			<div className='space-y-2'>
				<label className='text-sm text-slate-400'>{'Severity'}</label>
				<select
					{...register('severity')}
					className='w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-indigo-500 cursor-pointer'
				>
					{Object.values(eSeverity).map((s) => (
						<option key={s} value={s}>
							{s.toUpperCase()}
						</option>
					))}
				</select>
			</div>
			<div className='col-span-2 p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-4'>
				<div className='grid grid-cols-3 gap-3'>
					<div className='space-y-2'>
						<label className='text-xs text-slate-500 uppercase'>
							{'Field (Dot notation)*'}
						</label>
						<input
							{...register('field', {
								required: 'Required'
							})}
							className={`w-full bg-slate-800 border ${errors.field ? 'border-red-500' : 'border-slate-700'} rounded-lg p-2 text-white text-sm outline-none focus:border-indigo-500`}
							placeholder='level / message'
						/>
						{errors.field && (
							<p className='text-red-500 text-[14px]'>{errors.field.message}</p>
						)}
					</div>
					<div className='space-y-2'>
						<label className='text-xs text-slate-500 uppercase'>{'Operator'}</label>
						<select
							{...register('operator')}
							className='w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-sm cursor-pointer focus:border-indigo-500'
						>
							{Object.values(eRuleOperator).map((op) => (
								<option key={op} value={op}>
									{op}
								</option>
							))}
						</select>
					</div>
					<div className='space-y-2'>
						<label className='text-xs text-slate-500 uppercase'>{'Value'}</label>
						<input
							{...register('value', {
								required:
									selectedOperator !== eRuleOperator.EXISTS ? 'Required' : false
							})}
							disabled={selectedOperator === eRuleOperator.EXISTS}
							className={`w-full bg-slate-800 border ${selectedOperator !== eRuleOperator.EXISTS && errors.value ? 'border-red-500' : 'border-slate-700'} rounded-lg p-2 text-white text-sm outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed`}
							placeholder={
								selectedOperator === eRuleOperator.EXISTS ? 'N/A' : 'Expected value'
							}
						/>
						{selectedOperator !== eRuleOperator.EXISTS && errors.value && (
							<p className='text-red-500 text-[14px]'>{errors.value.message}</p>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default RuleLogicFields
