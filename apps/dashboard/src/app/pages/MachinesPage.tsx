import { GATEWAY_ROUTES, iMachine } from '@sentinel-supreme/shared'
import { Check, Copy, Edit2, Trash2 } from 'lucide-react'
import { ChangeEvent, FC, MouseEvent, useEffect, useState } from 'react'
import api from '../api/axiosInstance'
import ConfirmModal from '../components/ConfirmModal'
import Tooltip from '../components/Tooltip'
import { eToastType, iToastMessage } from '../types'

const MachinesPage: FC = () => {
	const [machines, setMachines] = useState<iMachine[]>([])
	const [showRegisterModal, setShowRegisterModal] = useState(false)
	const [editingMachine, setEditingMachine] = useState<iMachine | null>(null)
	const [deleteMachineId, setDeleteMachineId] = useState<string | undefined>(undefined)
	const [newMachineName, setNewMachineName] = useState('')
	const [copiedId, setCopiedId] = useState<string | null>(null)
	const [toastMessage, setToastMessage] = useState<iToastMessage | null>(null)

	const { MACHINES } = GATEWAY_ROUTES

	const fetchMachines = async () => {
		try {
			const { data } = await api.get(MACHINES)
			setMachines(data.data)
		} catch (err) {
			console.error('Failed to fetch machines', err)
		}
	}

	useEffect(() => {
		fetchMachines()
	}, [])

	const handleCopyKey = (key: string, id: string) => {
		navigator.clipboard.writeText(key)
		setCopiedId(id)
		setTimeout(() => setCopiedId(null), 2000)
	}

	const handleCopyClick = (e: MouseEvent) => {
		const [apiKey, id] = e.currentTarget.id.split(',')
		handleCopyKey(apiKey, id)
	}

	const handleOpenRegister = () => {
		setEditingMachine(null)
		setNewMachineName('')
		setShowRegisterModal(true)
	}

	const handleOpenEdit = (e: MouseEvent) => {
		const id = e.currentTarget.id
		const machine = machines.find((m) => m.id === id)
		if (machine) {
			setEditingMachine(machine)
			setNewMachineName(machine.name)
			setShowRegisterModal(true)
		}
	}

	const handleSaveMachine = async () => {
		if (!newMachineName) return
		try {
			if (editingMachine) {
				await api.patch(`${MACHINES}/${editingMachine.id}`, { name: newMachineName })

				setToastMessage({
					message: 'Machine updated successfully',
					type: eToastType.SUCCESS
				})
			} else {
				await api.post(MACHINES, { name: newMachineName })

				setToastMessage({
					message: 'Machine created successfully',
					type: eToastType.SUCCESS
				})
			}
			setShowRegisterModal(false)
			fetchMachines()
		} catch (err) {
			console.error('Save failed', err)
			setToastMessage({
				message: 'Save failed',
				type: eToastType.ERROR
			})
		}
	}

	const handleDeleteClick = (e: MouseEvent) => {
		setDeleteMachineId(e.currentTarget.id)
	}

	const confirmDelete = async () => {
		if (!deleteMachineId) return
		try {
			await api.delete(`${MACHINES}/${deleteMachineId}`)
			fetchMachines()

			setToastMessage({
				message: 'Machine deleted successfully',
				type: eToastType.SUCCESS
			})
		} finally {
			setDeleteMachineId(undefined)
		}
	}

	const handleMachineEdit = (e: ChangeEvent<HTMLInputElement>) => {
		setNewMachineName(e.target.value)
	}

	const handleCloseRegisterModal = () => {
		setShowRegisterModal(false)
	}

	const handleCloseConfirm = () => {
		setDeleteMachineId(undefined)
	}

	return (
		<div className='p-6 bg-slate-900 h-full text-blue-100 flex flex-col border border-slate-800 rounded-xl'>
			<div className='flex justify-between items-center mb-6 h-10'>
				<h1 className='text-3xl font-bold tracking-tight'>{'Machine Management'}</h1>
				<button
					onClick={handleOpenRegister}
					className='bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer shadow-[0_0_15px_rgba(8,145,178,0.3)]'
				>
					{'+ Register New Machine'}
				</button>
			</div>

			<div className='flex-1 overflow-hidden border border-blue-900 rounded-lg bg-slate-800/50 backdrop-blur-sm flex flex-col'>
				<table className='w-full text-left border-collapse'>
					<thead className='sticky top-0 z-10 bg-slate-800 shadow-md'>
						<tr className='bg-blue-900/30 text-cyan-300 uppercase text-xs tracking-widest'>
							<th className='px-6 py-4'>{'Name'}</th>
							<th className='px-6 py-4'>{'API Key'}</th>
							<th className='px-6 py-4'>{'Status'}</th>
							<th className='px-6 py-4'>{'Created'}</th>
							<th className='px-6 py-4 text-right'>{'Actions'}</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-slate-800'>
						{machines.map((m) => (
							<tr
								key={m.id}
								className='group/row hover:bg-blue-900/10 transition-colors'
							>
								<td className='px-6 py-4 font-medium'>{m.name}</td>
								<td className='px-6 py-4'>
									<div className='flex items-center space-x-2'>
										<code className='text-xs bg-slate-900 px-2 py-1 rounded text-slate-500'>
											{copiedId === m.id ? m.apiKey : '••••••••••••••••'}
										</code>
										<button
											id={`${m.apiKey},${m.id}`}
											onClick={handleCopyClick}
											className='text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer'
										>
											{copiedId === m.id ? (
												<Check size={14} />
											) : (
												<Copy size={14} />
											)}
										</button>
									</div>
								</td>
								<td className='px-6 py-4'>
									<span
										className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${m.isActive ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
									>
										{m.isActive ? 'Active' : 'Revoked'}
									</span>
								</td>
								<td className='px-6 py-4 text-slate-400 text-sm'>
									{new Date(m.createdAt).toLocaleDateString()}
								</td>
								<td className='px-6 py-4 text-right'>
									<div className='opacity-0 group-hover/row:opacity-100 transition-opacity flex justify-end space-x-1'>
										<Tooltip text='Edit' position='top'>
											<button
												id={m.id}
												onClick={handleOpenEdit}
												className='p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-full transition-all cursor-pointer'
											>
												<Edit2 size={18} />
											</button>
										</Tooltip>
										<Tooltip text='Delete' position='top'>
											<button
												id={m.id}
												onClick={handleDeleteClick}
												className='p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all cursor-pointer'
											>
												<Trash2 size={18} />
											</button>
										</Tooltip>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{!machines.length && (
					<div className='p-20 text-center text-slate-500 italic font-mono'>
						{'No machines connected.'}
					</div>
				)}
			</div>
			{showRegisterModal && (
				<div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
					<div className='bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200'>
						<h2 className='text-xl font-bold mb-4 text-white'>
							{editingMachine ? 'Edit Machine' : 'Register New Machine'}
						</h2>
						<input
							autoFocus
							type='text'
							className='w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 mb-6 focus:ring-2 focus:ring-cyan-500 text-white outline-none transition-all'
							value={newMachineName}
							onChange={handleMachineEdit}
							placeholder='Machine Name (e.g. AWS-Lambda-01)'
						/>
						<div className='flex gap-4'>
							<button
								onClick={handleCloseRegisterModal}
								className='flex-1 px-4 py-2 text-slate-400 hover:text-white transition-colors cursor-pointer'
							>
								{'Cancel'}
							</button>
							<button
								onClick={handleSaveMachine}
								className='flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded-lg font-bold transition-all cursor-pointer'
							>
								{editingMachine ? 'Save Changes' : 'Create'}
							</button>
						</div>
					</div>
				</div>
			)}
			{deleteMachineId && (
				<ConfirmModal
					onClose={handleCloseConfirm}
					onConfirm={confirmDelete}
					title={'Confirm Machine Deletion'}
					message={
						'Are you sure you want to delete this machine? All associated keys will be immediately revoked.'
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
		</div>
	)
}

export default MachinesPage
