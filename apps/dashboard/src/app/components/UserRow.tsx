import { iUser } from '@sentinel-supreme/shared'
import { Check, Edit2, Trash2, X } from 'lucide-react' // ייבוא האייקונים
import { ChangeEvent, FC, MouseEvent } from 'react'
import { getStyleByRole } from '../utils'
import Tooltip from './Tooltip'

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
	const isEditing = editUser?.id === user.id

	return (
		<tr
			key={user.id}
			className='group/row hover:bg-slate-700/20 transition-colors border-b border-slate-800/50'
		>
			{isEditing ? (
				<>
					<td className='pl-6 pr-16 py-4 w-75'>
						<input
							id={editUser.id}
							name='email'
							type='email'
							value={editUser.email}
							onChange={handleEditUserField}
							className='bg-slate-800 border border-cyan-500/50 rounded px-2 py-1 text-blue-100 outline-none focus:ring-1 focus:ring-cyan-500 w-full animate-in fade-in duration-200'
							autoFocus
						/>
					</td>
					<td className='pr-6 py-4 w-75'>
						<input
							name='password'
							type='password'
							value={editUser.password}
							onChange={handleEditUserField}
							className='bg-slate-800 border border-cyan-500/50 rounded px-2 py-1 text-blue-100 outline-none focus:ring-1 focus:ring-cyan-500 w-full animate-in fade-in duration-200'
							placeholder='New password'
						/>
					</td>
				</>
			) : (
				<>
					<td className='pl-6 pr-16 py-4 w-75 font-medium text-slate-200'>
						{user.email}
					</td>
					<td className='pr-16 py-4 w-75 font-medium text-slate-500'>{'••••••••'}</td>
				</>
			)}
			<td className='pr-16 py-4'>
				<button
					onClick={handleToggleRole}
					disabled={!isEditing}
					className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${
						isEditing
							? getStyleByRole(editUser.role, true)
							: getStyleByRole(user.role, false)
					}`}
				>
					{isEditing ? editUser.role : user.role}
				</button>
			</td>
			<td className='pr-16 py-4 text-slate-500 text-sm'>
				{new Date(user.createdAt).toLocaleDateString()}
			</td>
			<td className='px-6 py-4 text-right w-31'>
				<div className='flex justify-end space-x-1'>
					{isEditing ? (
						<>
							<Tooltip text='Save' position='top'>
								<button
									onClick={handleSaveEditUser}
									className='p-2 text-slate-400 hover:text-green-400 hover:bg-green-400/10 rounded-full transition-all cursor-pointer'
								>
									<Check size={18} />
								</button>
							</Tooltip>
							<Tooltip text='Cancel' position='top'>
								<button
									onClick={handleCancelEditUser}
									className='p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all cursor-pointer'
								>
									<X size={18} />
								</button>
							</Tooltip>
						</>
					) : (
						<div className='opacity-0 group-hover/row:opacity-100 transition-opacity flex space-x-1'>
							<Tooltip text='Edit' position='top'>
								<button
									id={user.id}
									onClick={handleEditUser}
									className='p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-full transition-all cursor-pointer'
								>
									<Edit2 size={18} />
								</button>
							</Tooltip>
							{user.id !== currentUserId && (
								<Tooltip text='Delete' position='top'>
									<button
										id={user.id}
										onClick={handleDeleteUser}
										className='p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all cursor-pointer'
									>
										<Trash2 size={18} />
									</button>
								</Tooltip>
							)}
						</div>
					)}
				</div>
			</td>
		</tr>
	)
}

export default UserRow
