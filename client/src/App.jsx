import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'https://scholarmed-api.onrender.com';

function App() {
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);
  
  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Upload Form States
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('B.Pharm');

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
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        alert("Welcome back!");
      } else { alert("❌ " + data.error); }
    } catch (error) { console.error(error); }
  };

  const handleUpload = async () => {
    const token = localStorage.getItem('token');
    if (!title || !price) return alert("Please fill details");
    try {
      const response = await fetch(`${API_URL}/api/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, category, price }),
      });
      if (response.ok) {
        alert("Note Submitted for Review! 🚀");
        setTitle(''); setPrice(''); fetchNotes();
      }
    } catch (error) { console.error(error); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div style={{ fontFamily: '"Poppins", "Segoe UI", sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh', color: '#333' }}>
      
      {/* 🌟 CSS STYLES FOR ANIMATIONS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;800&display=swap');
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        
        .feature-card { 
          background: white; padding: 25px; borderRadius: 15px; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.05); 
          transition: 0.3s; flex: 1; min-width: 250px;
          border-bottom: 4px solid #0077b6;
        }
        .feature-card:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.1); }
        
        .note-card { transition: 0.2s; background: white; padding: 20px; border-radius: 12px; border: 1px solid #eee; }
        .note-card:hover { transform: scale(1.02); box-shadow: 0 5px 15px rgba(0,0,0,0.1); border-color: #0077b6; }
        
        .gradient-btn { background: linear-gradient(135deg, #0077b6 0%, #00b4d8 100%); color: white; border: none; cursor: pointer; transition: 0.3s; }
        .gradient-btn:hover { background: linear-gradient(135deg, #023e8a 0%, #0077b6 100%); box-shadow: 0 5px 15px rgba(0,119,182,0.4); }
      `}</style>

      {/* 🖼️ HERO SECTION */}
      <div style={{ 
        height: '400px', 
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        color: 'white', textAlign: 'center', padding: '0 20px'
      }}>
        <h1 style={{ fontSize: '55px', margin: 0, fontWeight: '800', animation: 'fadeIn 1s' }}>
          ScholarMed <span style={{color: '#4cc9f0'}}>Pro</span>
        </h1>
        <p style={{ fontSize: '20px', maxWidth: '600px', marginTop: '15px', opacity: 0.9, animation: 'fadeIn 1.5s' }}>
          The First Marketplace for Medical Students.
        </p>
        {user && <button onClick={handleLogout} style={{ marginTop: '20px', padding: '10px 25px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '30px', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>Logout</button>}
      </div>

      {/* 💎 PURPOSE / FEATURES SECTION (New Addition!) */}
      <div style={{ maxWidth: '1200px', margin: '-50px auto 40px', padding: '0 20px', display: 'flex', gap: '20px', flexWrap: 'wrap', position: 'relative', zIndex: 10 }}>
        
        <div className="feature-card" style={{ animation: 'fadeIn 0.5s' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>💰</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#0077b6' }}>Earn While You Study</h3>
          <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
            Don't let your hard work go to waste. Upload your notes and earn money every time a student downloads them.
          </p>
        </div>

        <div className="feature-card" style={{ animation: 'fadeIn 0.7s', borderBottomColor: '#e63946' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🛡️</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#e63946' }}>Verified Quality</h3>
          <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
            Our team inspects every note. Your upload will be reviewed and released within <strong>max 2 days</strong>.
          </p>
        </div>

        <div className="feature-card" style={{ animation: 'fadeIn 0.9s', borderBottomColor: '#2a9d8f' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>⚡</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#2a9d8f' }}>Instant Access</h3>
          <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
            Need last-minute prep? Buy and access top-tier notes from toppers instantly.
          </p>
        </div>

      </div>

      {/* --- MAIN CONTENT (Split View) --- */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 50px', display: 'flex', gap: '40px', padding: '0 20px', flexWrap: 'wrap' }}>
        
        {/* 📚 LEFT: FEED */}
        <div style={{ flex: 3, minWidth: '300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: '#222' }}>Latest Notes 📚</h2>
            <span style={{ background: '#e0f7fa', color: '#0077b6', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{notes.length} Available</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {notes.length === 0 ? <p style={{color:'#999'}}>Loading latest notes...</p> : notes.map((note) => (
              <div key={note._id} className="note-card">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'white', background: note.category === 'MBBS' ? '#e63946' : '#2a9d8f', padding: '4px 8px', borderRadius: '4px' }}>
                    {note.category}
                  </span>
                </div>
                <h3 style={{ fontSize: '18px', margin: '15px 0', color: '#333' }}>{note.title}</h3>
                <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#0077b6' }}>₹{note.price}</span>
                  <button style={{ padding: '8px 15px', background: '#f0f9ff', color: '#0077b6', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>View</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🔐 RIGHT: STICKY SIDEBAR */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ position: 'sticky', top: '20px', background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
            
            {user ? (
              // 📤 UPLOAD MODE
              <>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ width: '60px', height: '60px', background: '#0077b6', color: 'white', borderRadius: '50%', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                    {user.name.charAt(0)}
                  </div>
                  <h3 style={{ margin: 0 }}>Hello, {user.name}</h3>
                  <p style={{ margin: '5px 0 0', color: '#2a9d8f', fontSize: '13px' }}>Verified Student ✅</p>
                </div>
                
                <h4 style={{ color: '#555', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Upload New Note</h4>
                
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note Title (e.g. Anatomy)" style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #eee', outline: 'none', boxSizing: 'border-box' }} />
                
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ flex:1, padding: '12px', borderRadius: '8px', border: '1px solid #eee' }}>
                    <option>B.Pharm</option> <option>MBBS</option> <option>Nursing</option>
                  </select>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="₹ Price" style={{ width:'80px', padding: '12px', borderRadius: '8px', border: '1px solid #eee', boxSizing: 'border-box' }} />
                </div>

                <button className="gradient-btn" onClick={handleUpload} style={{ width: '100%', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize:'15px' }}>
                  Submit for Review 🚀
                </button>
                <p style={{ fontSize: '11px', color: '#888', textAlign: 'center', marginTop: '10px' }}>*Approval within 48 hours</p>
              </>
            ) : (
              // 🔐 LOGIN MODE
              <>
                <h2 style={{ textAlign: 'center', color: '#0077b6', marginTop: 0 }}>Student Login</h2>
                <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '25px' }}>Login to buy or sell notes.</p>
                
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} 
                    style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f8f9fa' }} />
                  <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} 
                    style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f8f9fa' }} />
                  
                  <button type="submit" className="gradient-btn" style={{ padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' }}>
                    Login Securely
                  </button>
                </form>

                <div style={{ marginTop: '25px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                  <Link to="/register" style={{ color: '#e63946', fontWeight: 'bold', textDecoration: 'none', fontSize: '14px' }}>
                     New here? Create Account
                  </Link>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;