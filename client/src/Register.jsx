import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 📝 FORM DATA (Includes Course, Year, Role)
  const [formData, setFormData] = useState({
    name: '', password: '', mobile: '', college: '', 
    role: 'Student', // Default
    course: 'B.Pharm', // Default
    year: '1st Year'   // Default
  });
  
  const navigate = useNavigate();
  
  // 👇 ENSURE THIS MATCHES YOUR SERVER PORT
  const API_BASE = 'https://scholarmed-api.onrender.com/api'; 

  // 1. SEND OTP
  const sendOtp = async () => {
    if(!email.includes('@')) return alert("Enter valid email!");
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/send-otp`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
      });
      const data = await res.json();
      if(res.ok) { alert("✅ OTP Sent!"); setStep(2); } 
      else { alert("❌ " + data.error); }
    } catch (err) { alert("❌ Server Connection Error"); } 
    finally { setIsLoading(false); }
  };

  // 2. VERIFY OTP
  const verifyOtp = async () => {
    try {
      const res = await fetch(`${API_BASE}/verify-otp`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp })
      });
      if(res.ok) { alert("✅ Verified!"); setStep(3); } 
      else { alert("❌ Invalid OTP"); }
    } catch (err) { alert("Connection Error"); }
  };

  // 3. REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    const finalData = { ...formData, email };
    try {
      const res = await fetch(`${API_BASE}/register`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalData)
      });
      if(res.ok) { alert("🎉 Registered! Please Login."); navigate('/'); } 
      else { alert("Registration Failed"); }
    } catch (err) { alert("Connection Error"); }
  };

  const inputStyle = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f4f7f6', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', color: '#0077b6' }}>Create Account 🎓</h2>
        
        {/* STEP 1: EMAIL */}
        {step === 1 && (
          <div>
            <label style={{fontSize:'12px', fontWeight:'bold'}}>College Email:</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="student@college.edu" style={inputStyle} />
            <button onClick={sendOtp} disabled={isLoading} style={{ width:'100%', background: '#0077b6', color: 'white', padding: '12px', border:'none', borderRadius:'6px', cursor:'pointer' }}>
              {isLoading ? "Sending... ⏳" : "Send OTP 📩"}
            </button>
          </div>
        )}

        {/* STEP 2: OTP */}
        {step === 2 && (
          <div>
            <div style={{background:'#e0f7fa', color:'#006064', padding:'10px', borderRadius:'5px', marginBottom:'10px', fontSize:'13px'}}>Code sent to: <b>{email}</b></div>
            <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter 4-digit Code" style={inputStyle} />
            <button onClick={verifyOtp} style={{ width:'100%', background: '#2a9d8f', color: 'white', padding: '12px', border:'none', borderRadius:'6px', cursor:'pointer' }}>Verify OTP ✅</button>
          </div>
        )}

        {/* STEP 3: DETAILS (WITH DROPDOWNS!) */}
        {step === 3 && (
          <form onSubmit={handleRegister}>
            <div style={{background:'#e8f5e9', color:'#1b5e20', padding:'10px', borderRadius:'5px', marginBottom:'10px', fontSize:'13px'}}>✅ Verified!</div>
            
            <input placeholder="Full Name" onChange={e => setFormData({...formData, name:e.target.value})} required style={inputStyle} />
            <input type="password" placeholder="Password" onChange={e => setFormData({...formData, password:e.target.value})} required style={inputStyle} />
            <input type="tel" placeholder="Mobile" onChange={e => setFormData({...formData, mobile:e.target.value})} required style={inputStyle} />
            <input placeholder="College Name" onChange={e => setFormData({...formData, college:e.target.value})} required style={inputStyle} />

            {/* 👇 HERE ARE THE DROPDOWNS YOU WANTED 👇 */}
            <label style={{fontSize:'12px', fontWeight:'bold'}}>Select Your Course:</label>
            <select onChange={e => setFormData({...formData, course:e.target.value})} style={inputStyle}>
                <option>B.Pharm</option>
                <option>MBBS</option>
                <option>Nursing</option>
                <option>Engineering</option>
            </select>

            <div style={{display:'flex', gap:'10px'}}>
                <div style={{flex:1}}>
                   <label style={{fontSize:'12px', fontWeight:'bold'}}>Role:</label>
                   <select onChange={e => setFormData({...formData, role:e.target.value})} style={inputStyle}>
                      <option>Student</option>
                      <option>Professor</option>
                   </select>
                </div>
                <div style={{flex:1}}>
                   <label style={{fontSize:'12px', fontWeight:'bold'}}>Year:</label>
                   <select onChange={e => setFormData({...formData, year:e.target.value})} style={inputStyle}>
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>Final Year</option>
                   </select>
                </div>
            </div>

            <button type="submit" style={{ width:'100%', background: '#0077b6', color: 'white', padding: '12px', border:'none', borderRadius:'6px', fontWeight:'bold', cursor:'pointer' }}>Finish Registration 🚀</button>
          </form>
        )}
         <p style={{textAlign:'center', marginTop:'15px', fontSize:'13px'}}>Already registered? <Link to="/">Login</Link></p>
      </div>
    </div>
  );
}

export default Register;