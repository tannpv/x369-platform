import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Simple test component
function TestApp() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel Loading...</h1>
        <p className="text-gray-600 mt-2">Testing if React and Tailwind are working</p>
      </div>
    </div>
  )
}

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <StrictMode>
      <TestApp />
    </StrictMode>
  )
} else {
  console.error('Root element not found!')
}
