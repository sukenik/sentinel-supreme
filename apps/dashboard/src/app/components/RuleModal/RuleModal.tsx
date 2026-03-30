import { eRuleType, tRule } from '@sentinel-supreme/shared'
import { FC } from 'react'
import { FormProvider } from 'react-hook-form'
import { useRuleForm } from '../../hooks/useRuleForm'
import RateLimitFields from './RateLimitFields'
import RuleActiveToggle from './RuleActiveToggle'
import RuleIdentityFields from './RuleIdentityFields'
import RuleLogicFields from './RuleLogicFields'

interface iProps {
	onClose: () => void
	initialData?: tRule
}

const RuleModal: FC<iProps> = ({ onClose, initialData }) => {
	const { methods, onSubmit, selectedType } = useRuleForm(initialData, onClose)

	return (
		<div className='fixed inset-0 bg-black/80 backdrop-blur-sm z-100 flex items-center justify-center p-4'>
			<div className='bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden'>
				<FormProvider {...methods}>
					<form onSubmit={methods.handleSubmit(onSubmit)} className='p-8 space-y-6'>
						<h2 className='text-2xl font-bold text-white border-b border-slate-800 pb-4'>
							{initialData ? 'Edit Detection Rule' : 'Create New Rule'}
						</h2>
						<div className='grid grid-cols-2 gap-4'>
							<RuleIdentityFields />
							<RuleLogicFields />
							{selectedType === eRuleType.RATE_LIMIT && <RateLimitFields />}
							<RuleActiveToggle />
						</div>
						<div className='flex justify-end gap-3 pt-6 border-t border-slate-800'>
							<button
								type='button'
								onClick={onClose}
								className='px-6 py-2 text-slate-400 hover:text-white transition-colors cursor-pointer'
							>
								{'Cancel'}
							</button>
							<button
								type='submit'
								className='px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-indigo-500/20 cursor-pointer active:scale-95'
							>
								{'Save'}
							</button>
						</div>
					</form>
				</FormProvider>
			</div>
		</div>
	)
}

export default RuleModal
