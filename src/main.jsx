import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Catalog, { loader as catalogLoader } from './routes/Catalog.jsx'

/**
 * Konfigurasi Routing Aplikasi
 * Menggunakan React Router DOM Data API (v6+)
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <Catalog />, // Komponen utama yang akan dirender
    loader: catalogLoader, // Fungsi loader untuk mengambil/memproses data sebelum komponen dirender
  }
])

// Titik masuk utama (Entry Point) aplikasi React
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
