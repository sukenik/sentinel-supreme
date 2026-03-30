import { GATEWAY_ROUTES, iMachine } from '@sentinel-supreme/shared'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import api from '../api/axiosInstance'

const MachinesPage: FC = () => {
	const [machines, setMachines] = useState<iMachine[]>([])
	const [newMachineName, setNewMachineName] = useState('')
	const [showModal, setShowModal] = useState(false)

	const { MACHINES } = GATEWAY_ROUTES

	const fetchMachines = async () => {
		const { data } = await api.get(MACHINES)

		setMachines(data.data)
	}

	const createMachine = async () => {
		if (!newMachineName) return

		await api.post(MACHINES, { name: newMachineName })

		setNewMachineName('')
		setShowModal(false)
		fetchMachines()
	}

	useEffect(() => {
		fetchMachines()
	}, [])

	const handleToggleModal = () => {
		setShowModal((prevState) => !prevState)
	}

	const handleMachineNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setNewMachineName(e.target.value)
	}

	return (
		<div className='p-6 bg-slate-900 h-full text-blue-100 flex flex-col border border-slate-800 rounded-xl'>
			<div className='flex justify-between items-center mb-6 h-10'>
				<h1 className='text-3xl font-bold tracking-tight'>{'Machine Management'}</h1>
				<button
					onClick={handleToggleModal}
					className='bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer'
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
						</tr>
					</thead>
					<tbody className='divide-y divide-slate-800'>
						{machines.map((m) => (
							<tr key={m.id} className='hover:bg-blue-900/10 transition-colors group'>
								<td className='px-6 py-4 font-medium'>{m.name}</td>
								<td className='px-6 py-4 font-mono text-cyan-400 text-sm'>
									{/* TODO: wtf we do with dis */}
									{m.apiKey.slice(0, 8)}
									{'... (Hidden)'}
								</td>
								<td className='px-6 py-4'>
									<span
										className={`px-2 py-1 rounded text-xs font-bold ${m.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
									>
										{m.isActive ? 'Active' : 'Revoked'}
									</span>
								</td>
								<td className='px-6 py-4 text-slate-400 text-sm'>
									{new Date(m.createdAt).toLocaleDateString()}
								</td>
							</tr>
						))}
						{/* TODO: Test: */}
						{!machines.length && (
							<tr>
								<td colSpan={5} className='p-12 text-center text-slate-500 italic'>
									{'No Machines connected.'}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			{/* 
				TODO:
				{isModalOpen && (
					<ConfirmModal
						onClose={toggleDeleteModal}
						onConfirm={confirmDelete}
						title={'Confirm Deletion'}
						message={
							'Are you sure you want to delete this machine? This action cannot be undone.'
						}
					/>
				)}
			 */}
			{showModal && (
				<div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4'>
					<div className='bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full'>
						<h2 className='text-xl font-bold mb-4'>{'Register Machine'}</h2>
						<input
							type='text'
							placeholder='Machine Name (e.g. AWS-Lambda-01)'
							className='w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 mb-6 focus:ring-2 focus:ring-cyan-500 outline-none'
							value={newMachineName}
							onChange={handleMachineNameChange}
						/>
						<div className='flex gap-4'>
							<button
								onClick={handleToggleModal}
								className='flex-1 px-4 py-2 text-slate-400 hover:text-white cursor-pointer'
							>
								{'Cancel'}
							</button>
							<button
								onClick={createMachine}
								className='flex-1 bg-cyan-600 py-2 rounded-lg font-bold cursor-pointer'
							>
								{'Create'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default MachinesPage
