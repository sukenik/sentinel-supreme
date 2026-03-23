import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { ROUTES } from './consts'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'

export function App() {
	const { LOGIN_PAGE, HOME_PAGE } = ROUTES

	return (
		<BrowserRouter>
			<Routes>
				<Route path={LOGIN_PAGE} element={<LoginPage />} />
				<Route
					path={HOME_PAGE}
					element={
						<ProtectedRoute>
							<HomePage />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	)
}

export default App
