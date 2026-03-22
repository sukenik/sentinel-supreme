import { eUserRole, GATEWAY_ROUTES, iUser } from '@sentinel-supreme/shared'
import { FC, MouseEvent, useEffect, useState } from 'react'
import api from '../api/axiosInstance'
import ConfirmModal from './ConfirmModal'

const UserManager: FC = () => {
	const [users, setUsers] = useState<iUser[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [userToDelete, setUserToDelete] = useState<string | null>(null)

	const fetchUsers = async () => {
		setIsLoading(true)
		try {
			const { data } = await api.get(GATEWAY_ROUTES.USERS)
			setUsers(data.data)
		} catch (error) {
			console.error('Failed to fetch users', error)
		} finally {
			setIsLoading(false)
		}
	}

	const toggleDeleteModal = () => {
		setIsModalOpen((prevState) => !prevState)
	}

	const handleDeleteUser = (e: MouseEvent) => {
		const userId = e.currentTarget.id
		setUserToDelete(userId)
		toggleDeleteModal()
	}

	const confirmDelete = async () => {
		if (!userToDelete) return

		try {
			await api.delete(`${GATEWAY_ROUTES.USERS}/${userToDelete}`)
			setUsers(users.filter((u) => u.id !== userToDelete))
		} catch (error) {
			console.error('Failed to delete user', error)
		} finally {
			toggleDeleteModal()
			setUserToDelete(null)
		}
	}

	const handleToggleRole = async (user: iUser) => {
		const newRole = user.role === eUserRole.ADMIN ? eUserRole.USER : eUserRole.ADMIN

		try {
			await api.patch(`${GATEWAY_ROUTES.USERS}/${user.id}`, { role: newRole })
			setUsers(users.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)))
		} catch (error) {
			console.error('Failed to update role', error)
		}
	}

	useEffect(() => {
		fetchUsers()
	}, [])

	return (
		<>
			<div className='mt-8 animate-in fade-in slide-in-from-top-4 duration-300'>
				<div className='flex justify-between items-center mb-4'>
					<h3 className='text-xl font-bold text-cyan-400'>{'User Directory'}</h3>
					<button className='bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-4 py-2 rounded-lg font-bold transition-all'>
						{'+ Add User'}
					</button>
				</div>
				<div className='overflow-hidden border border-slate-700 rounded-xl bg-slate-800/30 backdrop-blur-sm'>
					<table className='w-full text-left border-collapse'>
						<thead>
							<tr className='bg-slate-800 text-slate-400 uppercase text-xs tracking-widest'>
								<th className='px-6 py-4'>{'Email'}</th>
								<th className='px-6 py-4'>{'Role'}</th>
								<th className='px-6 py-4'>{'Joined'}</th>
								<th className='px-6 py-4 text-right'>{'Actions'}</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-slate-800'>
							{isLoading ? (
								<tr>
									<td colSpan={4} className='p-10 text-center text-slate-500'>
										{'Loading users...'}
									</td>
								</tr>
							) : (
								users.map((u) => (
									<tr
										key={u.id}
										className='hover:bg-slate-700/20 transition-colors'
									>
										<td className='px-6 py-4 font-medium'>{u.email}</td>
										<td className='px-6 py-4'>
											<button
												// TODO: Change
												onClick={() => handleToggleRole(u)}
												className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${
													u.role === eUserRole.ADMIN
														? 'bg-purple-500/20 text-purple-400'
														: 'bg-blue-500/20 text-blue-400'
												}`}
											>
												{u.role}
											</button>
										</td>
										<td className='px-6 py-4 text-slate-400 text-sm'>
											{new Date(u.createdAt).toLocaleDateString()}
										</td>
										<td className='px-6 py-4 text-right space-x-3'>
											<button className='text-slate-400 hover:text-cyan-400 transition-colors text-sm cursor-pointer'>
												{'Edit'}
											</button>
											<button
												id={u.id}
												onClick={handleDeleteUser}
												className='text-slate-400 hover:text-red-400 transition-colors text-sm cursor-pointer'
											>
												{'Delete'}
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
			{isModalOpen && (
				<ConfirmModal
					onClose={toggleDeleteModal}
					onConfirm={confirmDelete}
					title={'Confirm Deletion'}
					message={
						'Are you sure you want to delete this user? This action cannot be undone.'
					}
				/>
			)}
		</>
	)
}

export default UserManager
