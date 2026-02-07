import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 🔗 CONNECT TO LIVE BRAIN
const API_URL = 'https://scholarmed-api.onrender.com'; 

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate(); // To redirect user after login

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // SAVE THE DIGITAL KEY (Token) 🔑
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        alert("🎉 Login Successful!");
        navigate('/'); // Go to Home Page
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      
      {/* LEFT SIDE: ARTWORK */}
      <div style={{ flex: 1, backgroundColor: '#e0f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{fontSize: '80px'}}>🔐</h1>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <div style={{ width: '300px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '15px' }}>
          
          <h2 style={{ color: '#0077b6', textAlign: 'center' }}>Welcome Back 👋</h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required 
              style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
            
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required 
              style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />

            <button type="submit" style={{ padding: '12px', backgroundColor: '#0077b6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Login
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            New here? <Link to="/register" style={{ color: '#0077b6', fontWeight: 'bold' }}>Create Account</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;