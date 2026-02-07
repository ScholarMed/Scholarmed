import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// 🔗 THIS CONNECTS TO YOUR LIVE BRAIN
const API_URL = 'https://scholarmed-api.onrender.com'; 

function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', course: 'B.Pharm', year: '1st Year'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert("🎉 Registration Successful! Please Login.");
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
        <h1 style={{fontSize: '50px'}}>🏥</h1>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <div style={{ width: '300px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '15px' }}>
          <h2 style={{ color: '#0077b6', textAlign: 'center' }}>Join ScholarMed 🎓</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required style={{ padding: '10px' }} />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={{ padding: '10px' }} />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={{ padding: '10px' }} />
            <button type="submit" style={{ padding: '10px', backgroundColor: '#0077b6', color: 'white', border: 'none', cursor: 'pointer' }}>Register</button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/">Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;