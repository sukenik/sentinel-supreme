import { iUser } from '@sentinel-supreme/shared'
import { ChangeEvent, FC, MouseEvent } from 'react'
import { getStyleByRole } from '../utils'

interface iProps {
	user: iUser
	editUser: iUser | null
	currentUserId: string
	handleEditUserField: (e: ChangeEvent<HTMLInputElement>) => void
	handleToggleRole: () => void
	handleSaveEditUser: () => Promise<void>
	handleCancelEditUser: () => void
	handleEditUser: (e: MouseEvent) => void
	handleDeleteUser: (e: MouseEvent) => void
}

const UserRow: FC<iProps> = ({
	user,
	editUser,
	currentUserId,
	handleEditUserField,
	handleToggleRole,
	handleSaveEditUser,
	handleCancelEditUser,
	handleEditUser,
	handleDeleteUser
}) => {
	return (
		<tr key={user.id} className='hover:bg-slate-700/20 transition-colors'>
			{editUser?.id === user.id ? (
				<>
					<td>
						<input
							id={editUser.id}
							name='email'
							type='email'
							value={editUser.email}
							onChange={handleEditUserField}
							className='bg-slate-800 border border-cyan-500/50 rounded px-2 py-1 ml-2 text-blue-100 outline-none focus:ring-1 focus:ring-cyan-500 w-50 animate-in fade-in duration-200'
							autoFocus
						/>
					</td>
					<td>
						<input
							name='password'
							type='password'
							value={editUser.password}
							onChange={handleEditUserField}
							className='bg-slate-800 border border-cyan-500/50 rounded px-2 py-1 mr-25 text-blue-100 outline-none focus:ring-1 focus:ring-cyan-500 w-full animate-in fade-in duration-200'
							placeholder='New password (leave blank to keep current)'
						/>
					</td>
				</>
			) : (
				<>
					<td className='px-6 py-4 font-medium'>{user.email}</td>
					<td className='px-6 py-4 font-medium'>{'••••••••'}</td>
				</>
			)}
			<td className='px-6 py-4'>
				<button
					onClick={handleToggleRole}
					disabled={editUser?.id !== user.id}
					className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${
						editUser?.id === user.id
							? getStyleByRole(editUser.role, true)
							: getStyleByRole(user.role, false)
					}`}
				>
					{editUser?.id === user.id ? editUser.role : user.role}
				</button>
			</td>
			<td className='px-2 py-4 text-slate-400 text-sm'>
				{new Date(user.createdAt).toLocaleDateString()}
			</td>
			<td className='px-6 py-4 text-right space-x-3'>
				{editUser?.id === user.id ? (
					<>
						<button
							id={user.id}
							onClick={handleSaveEditUser}
							className='text-slate-400 hover:text-green-400 transition-colors text-sm cursor-pointer'
						>
							{'Save'}
						</button>
						<button
							onClick={handleCancelEditUser}
							className='text-slate-400 hover:text-red-400 transition-colors text-sm cursor-pointer'
						>
							{'Cancel'}
						</button>
					</>
				) : (
					<>
						<button
							id={user.id}
							onClick={handleEditUser}
							className='text-slate-400 hover:text-cyan-400 transition-colors text-sm cursor-pointer'
						>
							{'Edit'}
						</button>
						{user.id !== currentUserId && (
							<button
								id={user.id}
								onClick={handleDeleteUser}
								className='text-slate-400 hover:text-red-400 transition-colors text-sm cursor-pointer'
							>
								{'Delete'}
							</button>
						)}
					</>
				)}
			</td>
		</tr>
	)
}

export default UserRow
