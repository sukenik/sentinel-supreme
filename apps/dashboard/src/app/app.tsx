import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import { ROUTES } from './consts'

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
