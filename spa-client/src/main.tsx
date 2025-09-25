import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

const router = createBrowserRouter([
	{ path: '/', element: <App /> },
	{ path: '/login', element: <div className="p-4">Login page (to implement with shadcn/ui)</div> },
	{ path: '/signup', element: <div className="p-4">Signup page (to implement with shadcn/ui)</div> },
	{ path: '/profile', element: <div className="p-4">Profile page</div> },
	{ path: '/subscription', element: <div className="p-4">Subscription page</div> },
	{ path: '/admin', element: <div className="p-4">Admin dashboard</div> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
)
