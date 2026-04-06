import { FC, ReactNode } from 'react'

interface TooltipProps {
	text: string
	children: ReactNode
	position?: 'top' | 'right'
	show?: boolean
}

const Tooltip: FC<TooltipProps> = ({ text, children, position = 'top', show = true }) => {
	if (!show) return <>{children}</>

	const positionClasses = {
		top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
		right: 'left-full top-1/2 -translate-y-1/2 ml-3'
	}

	const arrowClasses = {
		top: 'top-full left-1/2 -translate-x-1/2 -mt-1 rotate-45 border-b border-r',
		right: 'right-full top-1/2 -translate-y-1/2 -mr-1 rotate-45 border-l border-b'
	}

	return (
		<div className='group relative inline-flex items-center justify-center'>
			{children}
			<div
				className={`
                absolute ${positionClasses[position]} 
                px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md 
                whitespace-nowrap opacity-0 group-hover:opacity-100 
                transition-all duration-200 pointer-events-none
                border border-slate-700 shadow-2xl z-9999
            `}
			>
				{text}
				<div
					className={`absolute w-2 h-2 bg-slate-800 border-slate-700 ${arrowClasses[position]}`}
				/>
			</div>
		</div>
	)
}

export default Tooltip
