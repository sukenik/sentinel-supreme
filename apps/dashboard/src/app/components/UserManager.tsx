import { eUserRole, GATEWAY_ROUTES, iUser, UpdateUser } from '@sentinel-supreme/shared'
import { ChangeEvent, FC, MouseEvent, useEffect, useState } from 'react'
import api from '../api/axiosInstance'
import { useAuthStore } from '../store/useAuthStore'
import { eToastType, iToastMessage } from '../types'
import { getErrorMsg } from '../utils'
import ConfirmModal from './ConfirmModal'
import UserRow from './UserRow'

const UserManager: FC = () => {
	const [users, setUsers] = useState<iUser[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
	const [editUser, setEditUser] = useState<iUser | null>(null)
	const [toastMessage, setToastMessage] = useState<iToastMessage | null>(null)

	const { access_token, user, setAuth } = useAuthStore()
	const currentUserId = user!.userId

	const TEMP_NEW_USER_ID = 'new-user'
	const isAdding = editUser?.id === TEMP_NEW_USER_ID

	const fetchUsers = async () => {
		setIsLoading(true)
		try {
			const { data } = await api.get(GATEWAY_ROUTES.USERS)

			const sorted = (data.data as iUser[]).sort((a, b) => {
				if (a.role === eUserRole.ADMIN && b.role !== eUserRole.ADMIN) {
					return -1
				}
				if (a.role !== eUserRole.ADMIN && b.role === eUserRole.ADMIN) {
					return 1
				}
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			})

			setUsers(sorted)
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
		setDeleteUserId(userId)
		toggleDeleteModal()
	}

	const handleAddUser = () => {
		setEditUser({
			id: TEMP_NEW_USER_ID,
			email: '',
			password: '',
			role: eUserRole.USER,
			createdAt: new Date()
		})
	}

	const handleEditUser = (e: MouseEvent) => {
		const userId = e.currentTarget.id
		const user = users.find(({ id }) => id === userId)

		user && setEditUser({ ...user, password: '' })
	}

	const handleEditUserField = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.currentTarget

		setEditUser((prev) => (prev ? { ...prev, [name]: value } : null))
	}

	const handleSaveEditUser = async () => {
		if (!editUser) return

		const errMsg = getErrorMsg(
			editUser.id,
			editUser.email,
			editUser.password!,
			editUser.role,
			users,
			isAdding
		)

		if (errMsg) {
			setToastMessage({
				message: errMsg,
				type: eToastType.ERROR
			})
			return
		}

		const action = isAdding
			? api.post(GATEWAY_ROUTES.USERS, {
					email: editUser.email,
					password: editUser.password,
					role: editUser.role
				})
			: api.put(`${GATEWAY_ROUTES.USERS}/${editUser.id}`, {
					email: editUser.email,
					role: editUser.role,
					...(editUser.password && { password: editUser.password })
				} as UpdateUser)

		try {
			await action
			if (currentUserId === editUser.id) {
				setAuth(access_token!, { ...user!, email: editUser.email, role: editUser.role })
			}
			setEditUser(null)
			setToastMessage({
				message: `User ${isAdding ? 'created' : 'updated'} successfully`,
				type: eToastType.SUCCESS
			})
			fetchUsers()
		} catch (error) {
			console.error(`Failed to ${isAdding ? 'create' : 'updated'} user`, error)
			setToastMessage({
				message: `Failed to ${isAdding ? 'create' : 'updated'} user`,
				type: eToastType.ERROR
			})
		}
	}

	const handleCancelEditUser = () => {
		setEditUser(null)
	}

	const confirmDelete = async () => {
		if (!deleteUserId) return

		try {
			await api.delete(`${GATEWAY_ROUTES.USERS}/${deleteUserId}`)
			setUsers(users.filter((u) => u.id !== deleteUserId))
			setToastMessage({ message: 'User deleted successfully', type: eToastType.SUCCESS })
		} catch (error) {
			console.error('Failed to delete user', error)
			setToastMessage({ message: 'Failed to delete user', type: eToastType.ERROR })
		} finally {
			toggleDeleteModal()
			setDeleteUserId(null)
		}
	}

	const handleToggleRole = () => {
		if (!editUser) return

		const newRole = editUser.role === eUserRole.ADMIN ? eUserRole.USER : eUserRole.ADMIN
		setEditUser((prevState) => ({ ...prevState!, role: newRole }))
	}

	useEffect(() => {
		fetchUsers()
	}, [])

	useEffect(() => {
		if (toastMessage) {
			const timer = setTimeout(() => {
				setToastMessage(null)
			}, 3000)
			return () => clearTimeout(timer)
		}

		return
	}, [toastMessage])

	const userRowProps = {
		editUser,
		currentUserId,
		handleEditUserField,
		handleToggleRole,
		handleSaveEditUser,
		handleCancelEditUser,
		handleEditUser,
		handleDeleteUser
	}

	return (
		<>
			<div className='h-full flex flex-col animate-in fade-in slide-in-from-top-4 duration-300'>
				<div className='flex justify-between items-center mb-4 shrink-0'>
					<h3 className='text-xl font-bold text-cyan-400'>{'User Directory'}</h3>
					<button
						onClick={handleAddUser}
						className='bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-4 py-2 rounded-lg font-bold transition-all disabled:bg-slate-500 cursor-pointer'
						disabled={isAdding || !!editUser}
					>
						{'+ Add User'}
					</button>
				</div>
				<div className='flex-1 min-h-0 border border-slate-700 rounded-xl bg-slate-800/30 backdrop-blur-sm flex flex-col overflow-hidden'>
					<div className='overflow-y-auto custom-scrollbar flex-1'>
						<table className='w-full text-left border-collapse'>
							<thead className='sticky top-0 z-10 bg-slate-800 shadow-md'>
								<tr className='text-slate-400 uppercase text-xs tracking-widest'>
									<th className='px-6 py-4'>{'Email'}</th>
									<th className='px-6 py-4'>{'Password'}</th>
									<th className='px-6 py-4'>{'Role'}</th>
									<th className='px-2 py-4'>{'Joined'}</th>
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
									<>
										{isAdding && editUser && (
											<UserRow
												key={editUser.id}
												user={editUser}
												{...userRowProps}
											/>
										)}
										{users.map((user) => (
											<UserRow key={user.id} user={user} {...userRowProps} />
										))}
									</>
								)}
							</tbody>
						</table>
					</div>
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

export default UserManager
