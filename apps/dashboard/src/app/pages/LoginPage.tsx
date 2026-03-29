import { appConfig, GATEWAY_ROUTES, iAuthResponse } from '@sentinel-supreme/shared'
import { ChangeEvent, FC, SyntheticEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance'
import { ROUTES } from '../consts'
import { useAuthStore } from '../store/useAuthStore'
import { AxiosError } from 'axios'

const LoginPage: FC = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const setAuth = useAuthStore((state) => state.setAuth)
	const navigate = useNavigate()

	const handleLogin = async (e: SyntheticEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError(null)

		try {
			const loginRoute = `${GATEWAY_ROUTES.AUTH}${GATEWAY_ROUTES.LOGIN}`

			const response = await api.post<{ data: iAuthResponse }>(loginRoute, {
				email,
				password
			})

			const { access_token, user } = response.data.data

			setAuth(access_token, user)
			navigate(ROUTES.HOME_PAGE)
		} catch (error) {
			const err = error as AxiosError
			setError(err.message || 'Authentication failed. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value)
	}

	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value)
	}

	return (
		<div className='min-h-screen bg-slate-950 flex items-center justify-center p-4'>
			<div className='max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl'>
				<div className='text-center mb-8'>
					<div className='inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-xl mb-4 border border-cyan-500/20'>
						<img src='favicon.ico' className='w-10 h-10' alt='logo' />
					</div>
					<h1 className='text-2xl font-bold text-white tracking-tight'>
						{'Sentinel Supreme'}
					</h1>
					<p className='text-slate-400 text-sm mt-2'>{'Secure Access Gateway'}</p>
				</div>

				{error && (
					<div className='bg-red-500/10 border border-red-500/20 text-white text-sm rounded-lg p-4 mb-6'>
						{error}
					</div>
				)}

				<form onSubmit={handleLogin} className='space-y-6'>
					<div>
						<label className='block text-sm font-medium text-slate-300 mb-2'>
							{'Email Address'}
						</label>
						<input
							type='email'
							required
							value={email}
							onChange={handleEmailChange}
							className='w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all'
							placeholder='email'
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-slate-300 mb-2'>
							{'Password'}
						</label>
						<input
							type='password'
							required
							value={password}
							onChange={handlePasswordChange}
							className='w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all'
							placeholder='password'
						/>
					</div>

					<button
						type='submit'
						disabled={isLoading}
						className='w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-50'
					>
						{isLoading ? 'Authenticating...' : 'Authorize Access'}
					</button>
				</form>

				<div className='mt-8 pt-6 border-t border-slate-800 text-center'>
					<p className='text-xs text-slate-500 uppercase tracking-widest'>
						{'Restricted System - Authorized Personnel Only'}
					</p>
				</div>
			</div>
		</div>
	)
}

export default LoginPage
