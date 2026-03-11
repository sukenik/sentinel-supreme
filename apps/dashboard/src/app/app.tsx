export function App() {
	return (
		<div className="flex h-screen w-full bg-slate-950 text-white overflow-hidden">
			{/* Sidebar */}
			<aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
				<div className="flex justify-center items-center p-4 gap-2">
					<img
						src="favicon.ico"
						alt="Sentinel-Supreme icon"
						style={{ height: '32px', width: '30px' }}
					/>
					<div className="text-2xl font- text-accent tracking-tighter">
						Sentinel Supreme
					</div>
				</div>
				<nav className="flex-1 px-4 space-y-2">
					<div className="p-3 bg-slate-800 rounded-lg cursor-pointer">Dashboard</div>
					<div className="p-3 hover:bg-slate-800 rounded-lg cursor-pointer transition">
						Logs
					</div>
					<div className="p-3 hover:bg-slate-800 rounded-lg cursor-pointer transition">
						Security Events
					</div>
				</nav>
				<div className="p-4 border-t border-slate-800 text-sm text-slate-400">
					v1.0.0-alpha
				</div>
			</aside>

			{/* Main Area */}
			<main className="flex-1 flex flex-col overflow-hidden">
				{/* Header */}
				<header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8">
					<h1 className="text-lg font-medium">Overview</h1>
					<div className="flex items-center space-x-4">
						<div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-slate-950 font-bold">
							D
						</div>
					</div>
				</header>

				{/* Content Area */}
				<section className="flex-1 overflow-auto p-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
							<h3 className="text-slate-400 text-sm uppercase">Total Logs</h3>
							<p className="text-3xl font-bold mt-2">0</p>
						</div>
						{/* כאן יבואו עוד כרטיסיות */}
					</div>
				</section>
			</main>
		</div>
	)
}

export default App
