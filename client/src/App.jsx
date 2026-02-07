import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// 🔗 CONFIGURATION
const API_URL = 'https://scholarmed-api.onrender.com';
const CLOUD_NAME = 'dkl5ay1ml';               
const UPLOAD_PRESET = 'scholarmed_upload';    

function App() {
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const fileInputRef = useRef(null); 

  // Login States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Upload States
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('B.Pharm');
  const [file, setFile] = useState(null); 
  const [uploading, setUploading] = useState(false); 

  useEffect(() => {
    fetchNotes();
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/notes`);
      const data = await response.json();
      setNotes(data.reverse());
    } catch (error) { console.error("Error:", error); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setShowWelcome(true);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Show animation for 3.5 seconds to let the story play out
        setTimeout(() => {
            setUser(data.user);
            setShowWelcome(false);
        }, 3500);
      } else { alert("❌ " + data.error); }
    } catch (error) { console.error(error); }
  };

  const handleUpload = async () => {
    if (!title || !price || !file) return alert("Please fill details and select a file!");
    setUploading(true); 
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, { method: 'POST', body: formData });
      const cloudData = await cloudRes.json();
      if (cloudData.error) throw new Error(cloudData.error.message);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
            title, category, price, 
            fileUrl: cloudData.secure_url,
            authorName: user.name 
        }), 
      });

      if (response.ok) {
        alert("Note Submitted for Review! 🚀");
        setTitle(''); setPrice(''); setFile(null);
        fetchNotes();
      }
    } catch (error) { alert("Upload Failed: " + error.message); } 
    finally { setUploading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // 🌟 NEW MODERN ANIMATION SCREEN 🌟
  if (showWelcome) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 9999, color: 'white' }}>
        <style>{`
          @keyframes slideInLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes transferDoc {
            0% { opacity: 0; transform: translate(-30px, 10px) scale(0.5); }
            20% { opacity: 1; transform: translate(-30px, 10px) scale(1); }
            80% { opacity: 1; transform: translate(30px, -10px) scale(1); }
            100% { opacity: 0; transform: translate(30px, -10px) scale(0.5); }
          }
          @keyframes pulseLine { 0% { opacity: 0.3; stroke-dashoffset: 100; } 100% { opacity: 1; stroke-dashoffset: 0; } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>

        {/* Modern SVG Illustration */}
        <svg width="220" height="130" viewBox="0 0 220 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Connecting Path */}
          <path d="M60 65 C 80 45, 140 85, 160 65" stroke="url(#grad1)" strokeWidth="3" strokeLinecap="round" strokeDasharray="120" style={{ animation: 'pulseLine 2s ease-in-out infinite alternate' }} />
          
          {/* Person 1 (Giver - Left) */}
          <g style={{ animation: 'slideInLeft 1s ease-out' }}>
            <circle cx="50" cy="45" r="18" fill="#0077b6" />
            <path d="M25 90 Q 50 65 75 90 L 75 120 L 25 120 Z" fill="#0077b6" />
          </g>

          {/* Person 2 (Receiver - Right) */}
          <g style={{ animation: 'slideInRight 1s ease-out 0.3s backwards' }}>
            <circle cx="170" cy="45" r="18" fill="#00b4d8" />
            <path d="M145 90 Q 170 65 195 90 L 195 120 L 145 120 Z" fill="#00b4d8" />
          </g>

          {/* The Note (Moving Document) */}
          <g style={{ animation: 'transferDoc 2.5s ease-in-out infinite' }}>
            <rect x="100" y="50" width="28" height="36" rx="4" fill="white" stroke="#4cc9f0" strokeWidth="2" />
            <line x1="107" y1="62" x2="121" y2="62" stroke="#4cc9f0" strokeWidth="2" />
            <line x1="107" y1="70" x2="121" y2="70" stroke="#4cc9f0" strokeWidth="2" />
            <line x1="107" y1="78" x2="116" y2="78" stroke="#4cc9f0" strokeWidth="2" />
          </g>

          {/* Gradients */}
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0077b6" />
              <stop offset="100%" stopColor="#4cc9f0" />
            </linearGradient>
          </defs>
        </svg>

        <h1 style={{ marginTop: '35px', fontFamily: '"Poppins", sans-serif', fontWeight: '300', fontSize: '32px', animation: 'slideUp 0.8s ease-out 0.5s backwards', letterSpacing: '1px' }}>
          Connecting Scholars...
        </h1>
        <p style={{ color: '#4cc9f0', marginTop: '10px', fontSize: '16px', animation: 'slideUp 0.8s ease-out 0.7s backwards', fontWeight: '300' }}>
          Sharing knowledge, empowering peers.
        </p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: '"Poppins", sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh', color: '#333' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;800&display=swap');
        .gradient-btn { background: linear-gradient(135deg, #0077b6 0%, #00b4d8 100%); color: white; border: none; cursor: pointer; transition: 0.3s; }
        .gradient-btn:hover { transform: scale(1.02); box-shadow: 0 5px 15px rgba(0,119,182,0.4); }
        .upload-box { border: 2px dashed #0077b6; border-radius: 12px; padding: 30px; text-align: center; cursor: pointer; background: #e0f7fa; transition: 0.3s; display: flex; flexDirection: column; align-items: center; justify-content: center; }
        .upload-box:hover { background: #b3e5fc; border-color: #0096c7; }
        .glass-card { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 15px; padding: 20px; border: 1px solid rgba(255, 255, 255, 0.2); color: white; text-align: center; flex: 1; min-width: 250px; box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); transition: transform 0.3s ease; }
        .glass-card:hover { transform: translateY(-5px); background: rgba(255, 255, 255, 0.2); }
      `}</style>

      {/* HERO SECTION */}
      <div style={{ background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '50px', margin: 0, fontWeight: '800' }}>ScholarMed <span style={{color: '#4cc9f0'}}>Pro</span></h1>
        <p style={{ fontSize: '18px', marginTop: '10px', opacity: 0.9, marginBottom: '40px' }}>The Premium Marketplace for Medical Notes</p>
        
        {/* GLASS BANNERS */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', maxWidth: '1000px', width: '100%', justifyContent: 'center' }}>
          <div className="glass-card">
            <div style={{ fontSize: '30px', marginBottom: '10px' }}>📤</div>
            <h3 style={{ margin: '0 0 10px 0' }}>Easy Upload</h3>
            <p style={{ fontSize: '13px', opacity: 0.8, margin: 0 }}>Drag & drop your study notes. We support PDF and Images.</p>
          </div>
          <div className="glass-card">
             <div style={{ fontSize: '30px', marginBottom: '10px' }}>💰</div>
             <h3 style={{ margin: '0 0 10px 0' }}>Earn Revenue</h3>
             <p style={{ fontSize: '13px', opacity: 0.8, margin: 0 }}>Set your price. Keep 80% of every single sale.</p>
          </div>
          <div className="glass-card">
             <div style={{ fontSize: '30px', marginBottom: '10px' }}>🤝</div>
             <h3 style={{ margin: '0 0 10px 0' }}>Help Peers</h3>
             <p style={{ fontSize: '13px', opacity: 0.8, margin: 0 }}>Your notes help other students pass their exams.</p>
          </div>
        </div>
        {user && <button onClick={handleLogout} style={{ marginTop: '40px', padding: '8px 20px', background: 'rgba(255,255,255,0.2)', border: '1px solid white', borderRadius: '20px', color: 'white', cursor: 'pointer' }}>Logout</button>}
      </div>

      <div style={{ maxWidth: '1200px', margin: '30px auto', display: 'flex', gap: '40px', padding: '0 20px', flexWrap: 'wrap' }}>
        {/* Left: Feed */}
        <div style={{ flex: 3, minWidth: '300px' }}>
          <h2 style={{ borderBottom: '3px solid #0077b6', display: 'inline-block', paddingBottom: '5px' }}>Latest Notes 📚</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
            {notes.map((note) => (
              <div key={note._id} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                   <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'white', background: '#0077b6', padding: '4px 8px', borderRadius: '4px' }}>{note.category}</span>
                   <span style={{ fontSize: '12px', color: '#666' }}>By: <b>{note.authorName || 'Unknown'}</b></span>
                </div>
                <h3 style={{ margin: '10px 0', fontSize: '18px' }}>{note.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2a9d8f' }}>₹{note.price}</span>
                  {note.fileUrl ? (
                    <a href={note.fileUrl} target="_blank" rel="noreferrer"><button style={{ padding: '8px 15px', background: '#e0f7fa', color: '#0077b6', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Download 📥</button></a>
                  ) : <button disabled>No File</button>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Upload/Login */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ position: 'sticky', top: '20px', background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
            {user ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <h3>Hello, {user.name} 👋</h3>
                  <div style={{ display: 'inline-block', background: '#e0f2f1', color: '#00695c', padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', marginTop: '5px' }}>
                    ✅ Posting as: {user.name}
                  </div>
                </div>
                <h4 style={{ color: '#555', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Upload New Note</h4>
                <input type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])} style={{ display: 'none' }} />
                <div className="upload-box" onClick={() => fileInputRef.current.click()}>
                  <div style={{fontSize:'30px', color:'#0077b6', marginBottom:'10px'}}>☁️</div>
                  {file ? <div style={{color: 'green', fontWeight: 'bold'}}>{file.name} ✅</div> : <div style={{color: '#555'}}><b>Click to Upload PDF</b><br/><span style={{fontSize: '12px', opacity: 0.7}}>Supports PDF, IMG</span></div>}
                </div>
                <div style={{ marginTop: '15px' }}>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (e.g. Anatomy Ch 1)" style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #eee' }} />
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ flex:1, padding: '12px', borderRadius: '8px', border: '1px solid #eee' }}>
                      <option>B.Pharm</option> <option>MBBS</option> <option>Nursing</option>
                    </select>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" style={{ width:'80px', padding: '12px', borderRadius: '8px', border: '1px solid #eee' }} />
                  </div>
                </div>
                <p style={{ fontSize: '11px', color: '#e63946', marginBottom: '15px', fontStyle: 'italic' }}>💡 Please keep prices low to help other students. ❤️</p>
                <button className="gradient-btn" onClick={handleUpload} disabled={uploading} style={{ width: '100%', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize:'15px', opacity: uploading ? 0.7 : 1 }}>
                  {uploading ? "Uploading... ⏳" : "Submit PDF 🚀"}
                </button>
              </>
            ) : (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h3 style={{ textAlign: 'center', color: '#0077b6' }}>Login to Upload</h3>
                <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px' }} />
                <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px' }} />
                <button type="submit" className="gradient-btn" style={{ padding: '15px', borderRadius: '8px', fontWeight: 'bold' }}>Login</button>
                <Link to="/register" style={{ textAlign: 'center', color: '#e63946', textDecoration: 'none', fontSize: '14px' }}>New here? Create Account</Link>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;