import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Catalog, { loader as catalogLoader } from './routes/Catalog.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Catalog />,
    loader: catalogLoader,
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
