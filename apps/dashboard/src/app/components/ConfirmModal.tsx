import { FC, MouseEvent } from 'react'

interface iProps {
	onClose: () => void
	onConfirm: () => void
	title: string
	message: string
}

const ConfirmModal: FC<iProps> = ({ onClose, onConfirm, title, message }) => {
	const handleContentClick = (e: MouseEvent) => {
		e.stopPropagation()
	}

	return (
		<div onClick={onClose} className='fixed inset-0 flex items-center justify-center z-50'>
			<div
				onClick={handleContentClick}
				className='bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-md'
			>
				<h2 className='text-xl font-bold text-white mb-4'>{title}</h2>
				<p className='text-slate-300 mb-6'>{message}</p>
				<div className='flex justify-end space-x-4'>
					<button
						onClick={onClose}
						className='px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors cursor-pointer'
					>
						{'Cancel'}
					</button>
					<button
						onClick={onConfirm}
						className='px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors cursor-pointer'
					>
						{'Confirm'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default ConfirmModal
