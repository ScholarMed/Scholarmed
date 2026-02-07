import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Register from './Register.jsx'
import Login from './Login.jsx'
import Admin from './Admin.jsx' // Import Admin

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} /> {/* Secret Route */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)