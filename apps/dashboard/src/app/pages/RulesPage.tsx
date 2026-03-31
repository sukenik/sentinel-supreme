import { eSeverity, tRule } from '@sentinel-supreme/shared'
import { FC, MouseEvent, useEffect, useState } from 'react'
import RuleModal from '../components/RuleModal/RuleModal'
import { useRuleStore } from '../store/useRuleStore'
import { eToastType, iToastMessage } from '../types'
import ConfirmModal from '../components/ConfirmModal'

const RulesPage: FC = () => {
	const { rules, fetchRules, deleteRule, updateRule } = useRuleStore()
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedRule, setSelectedRule] = useState<tRule | undefined>(undefined)
	const [deleteRuleId, setDeleteRuleId] = useState<string | undefined>(undefined)
	const [toastMessage, setToastMessage] = useState<iToastMessage | null>(null)

	useEffect(() => {
		fetchRules()
	}, [fetchRules])

	const getSeverityColor = (sev: eSeverity) => {
		const colors = {
			[eSeverity.LOW]: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
			[eSeverity.MEDIUM]: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
			[eSeverity.HIGH]: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
			[eSeverity.CRITICAL]: 'bg-red-500/10 text-red-400 border border-red-500/20'
		}
		return colors[sev]
	}

	const openModal = (rule?: tRule) => {
		setSelectedRule(rule)
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setSelectedRule(undefined)
		setIsModalOpen(false)
	}

	const toggleDeleteModal = () => {
		setDeleteRuleId(undefined)
	}

	const handleDeleteRule = (e: MouseEvent) => {
		const ruleId = e.currentTarget.id
		setDeleteRuleId(ruleId)
	}

	const handleEditRule = (e: MouseEvent) => {
		const ruleId = e.currentTarget.id
		openModal(rules.find(({ id }) => ruleId === id))
	}

	const handleToggleStatus = (e: MouseEvent) => {
		const ruleId = e.currentTarget.id
		const ruleToUpdate = rules.find(({ id }) => ruleId === id)!

		updateRule(ruleId, {
			...ruleToUpdate,
			isActive: !ruleToUpdate.isActive
		})
	}

	const confirmDelete = async () => {
		if (!deleteRuleId) return

		try {
			await deleteRule(deleteRuleId)
			setToastMessage({ message: 'Rule deleted successfully', type: eToastType.SUCCESS })
		} catch (error) {
			console.error('Failed to delete user', error)
			setToastMessage({ message: 'Failed to delete rule', type: eToastType.ERROR })
		} finally {
			toggleDeleteModal()
		}
	}

	return (
		<>
			<div className='p-6 bg-slate-900 h-full text-blue-100 flex flex-col border border-slate-800 rounded-xl'>
				<div className='flex justify-between items-center mb-6 h-10'>
					<div>
						<h1 className='text-3xl font-bold tracking-tight'>{'Detection Rules'}</h1>
					</div>
					<button
						onClick={() => openModal()}
						className='bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium transition-all cursor-pointer shadow-[0_0_15px_rgba(8,145,178,0.3)]'
					>
						{'+ Create New Rule'}
					</button>
				</div>
				<div className='flex-1 overflow-hidden border border-blue-900 rounded-lg bg-slate-800/50 backdrop-blur-sm flex flex-col'>
					<div className='overflow-y-auto flex-1'>
						<table className='w-full text-left border-collapse'>
							<thead className='sticky top-0 z-10 bg-slate-800 shadow-md'>
								<tr className='bg-blue-900/30 text-cyan-300 uppercase text-xs tracking-widest'>
									<th className='px-6 py-4'>{'Name'}</th>
									<th className='px-6 py-4'>{'Logic Type'}</th>
									<th className='px-6 py-4'>{'Severity'}</th>
									<th className='px-6 py-4'>{'Status'}</th>
									<th className='px-6 py-4 text-right'>{'Actions'}</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-slate-800'>
								{rules.map((rule) => (
									<tr
										key={rule.id}
										className='hover:bg-blue-900/10 transition-colors group'
									>
										<td className='px-6 py-4'>
											<div className='text-white transition-colors'>
												{rule.name}
											</div>
										</td>
										<td className='px-6 py-4'>
											<span className='px-2 py-1 bg-slate-900 rounded border border-slate-700 text-xs font-mono text-indigo-400'>
												{rule.type}
											</span>
										</td>
										<td className='px-6 py-4'>
											<span
												className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter ${getSeverityColor(rule.severity)}`}
											>
												{rule.severity}
											</span>
										</td>
										<td className='px-6 py-4'>
											<button
												id={rule.id}
												onClick={handleToggleStatus}
												className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${rule.isActive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-slate-700'}`}
											>
												<div
													className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${rule.isActive ? 'left-6' : 'left-1'}`}
												/>
											</button>
										</td>
										<td className='px-6 py-4 text-right space-x-2'>
											<button
												id={rule.id}
												onClick={handleEditRule}
												className='text-slate-400 hover:text-cyan-400 transition-colors text-sm cursor-pointer'
											>
												{'Edit'}
											</button>
											<button
												id={rule.id}
												onClick={handleDeleteRule}
												className='text-slate-400 hover:text-red-400 transition-colors text-sm cursor-pointer'
											>
												{'Delete'}
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						{!rules.length && (
							<div className='p-20 text-center'>
								<div className='text-slate-600 font-mono italic'>
									{'No rules created.'}
								</div>
							</div>
						)}
					</div>
				</div>

				{isModalOpen && <RuleModal onClose={closeModal} initialData={selectedRule} />}
			</div>
			{deleteRuleId && (
				<ConfirmModal
					onClose={toggleDeleteModal}
					onConfirm={confirmDelete}
					title={'Confirm Deletion'}
					message={
						'Are you sure you want to delete this rule? This action cannot be undone.'
					}
				/>
			)}
			{toastMessage && (
				<div
					className={`fixed bottom-5 right-5 text-white px-4 py-2 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-5 duration-300 ${
						toastMessage.type === eToastType.SUCCESS ? 'bg-green-600' : 'bg-red-600'
					}`}
				>
					{toastMessage.message}
				</div>
			)}
		</>
	)
}

export default RulesPage
