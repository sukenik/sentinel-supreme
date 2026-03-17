import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage'
import { LoginPage } from './components/LoginPage'
import { useAuthStore } from './store/useAuthStore'

export function App() {
	const token = useAuthStore((state) => state.access_token)

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/login' element={<LoginPage />} />
				<Route path='/' element={token ? <HomePage /> : <Navigate to='/login' />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
