import React, { useState, useEffect } from 'react';

const API_URL = 'https://scholarmed-api.onrender.com';
const ADMIN_PASSWORD = 'admin2026'; // 🔑 MASTER KEY

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, notes, users
  const [pendingNotes, setPendingNotes] = useState([]);
  const [approvedNotes, setApprovedNotes] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (sessionStorage.getItem('adminAuth') === 'true') {
      setIsAuthenticated(true);
      fetchAllData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      fetchAllData();
    } else {
      alert("❌ ACCESS DENIED");
    }
  };

  const fetchAllData = async () => {
    const pendingRes = await fetch(`${API_URL}/api/admin/pending`);
    const pendingData = await pendingRes.json();
    setPendingNotes(pendingData);

    const userRes = await fetch(`${API_URL}/api/admin/users`);
    const userData = await userRes.json();
    setUsers(userData);

    // We fetch approved notes just to calculate revenue
    const notesRes = await fetch(`${API_URL}/api/notes`);
    const notesData = await notesRes.json();
    setApprovedNotes(notesData);
  };

  const handleApprove = async (id) => {
    await fetch(`${API_URL}/api/admin/approve/${id}`, { method: 'PUT' });
    fetchAllData();
  };

  const handleReject = async (id) => {
    if(!window.confirm("CONFIRM DELETION?")) return;
    await fetch(`${API_URL}/api/admin/reject/${id}`, { method: 'DELETE' });
    fetchAllData();
  };

  const handleDeleteUser = async (id) => {
    if(!window.confirm("⚠️ BAN USER PERMANENTLY?")) return;
    await fetch(`${API_URL}/api/admin/users/${id}`, { method: 'DELETE' });
    fetchAllData();
  };

  // 💰 CALCULATE REVENUE (Your 20% Cut)
  const totalMarketValue = approvedNotes.reduce((acc, note) => acc + (note.price || 0), 0);
  const potentialEarnings = (totalMarketValue * 0.20).toFixed(0); 

  // --- 🔒 LOCK SCREEN ---
  if (!isAuthenticated) {
    return (
      <div style={{ height: '100vh', background: '#09090b', color: '#00f2ff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: '"Courier New", monospace' }}>
        <div style={{ width: '400px', padding: '40px', border: '1px solid #333', background: 'rgba(0,0,0,0.8)', boxShadow: '0 0 20px rgba(0, 242, 255, 0.2)' }}>
          <h2 style={{ textAlign: 'center', letterSpacing: '3px', textShadow: '0 0 10px #00f2ff' }}>SYSTEM_LOCKED</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
            <input 
              type="password" 
              placeholder="ENTER_PASSCODE" 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={{ background: '#111', border: '1px solid #333', padding: '15px', color: 'white', outline: 'none', textAlign: 'center', fontSize: '18px' }}
            />
            <button type="submit" style={{ background: '#00f2ff', color: 'black', border: 'none', padding: '15px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- 👔 BOSS DASHBOARD ---
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: '"Inter", sans-serif', display: 'flex' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '250px', background: '#1e293b', borderRight: '1px solid #334155', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: '#38bdf8', fontSize: '24px', marginBottom: '40px', letterSpacing: '1px', fontWeight: '800' }}>ScholarMed<span style={{color:'white'}}>OS</span></h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setActiveTab('dashboard')} style={navBtnStyle(activeTab === 'dashboard')}>📊 Overview</button>
          <button onClick={() => setActiveTab('notes')} style={navBtnStyle(activeTab === 'notes')}>📝 Pending ({pendingNotes.length})</button>
          <button onClick={() => setActiveTab('users')} style={navBtnStyle(activeTab === 'users')}>👥 User Database</button>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button onClick={() => { setIsAuthenticated(false); sessionStorage.clear(); }} style={{ width: '100%', padding: '12px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>LOGOUT</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: '300' }}>Welcome, <span style={{fontWeight:'bold'}}>Administrator</span></h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '10px', height: '10px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 10px #4ade80' }}></div>
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>SYSTEM ONLINE</span>
          </div>
        </div>

        {/* --- VIEW: DASHBOARD OVERVIEW --- */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <StatCard title="Total Revenue (20%)" value={`₹${potentialEarnings}`} color="#38bdf8" icon="💰" />
            <StatCard title="Active Users" value={users.length} color="#a78bfa" icon="👥" />
            <StatCard title="Notes Pending" value={pendingNotes.length} color="#fbbf24" icon="⏳" />
            <StatCard title="Live Notes" value={approvedNotes.length} color="#34d399" icon="✅" />
          </div>
        )}

        {/* --- VIEW: PENDING NOTES --- */}
        {activeTab === 'notes' && (
          <div>
            <h2 style={{ borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '25px' }}>Incoming Submissions</h2>
            {pendingNotes.length === 0 ? (
              <div style={{ padding: '40px', border: '2px dashed #334155', borderRadius: '10px', textAlign: 'center', color: '#64748b' }}>No pending tasks. Good job.</div>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
                {pendingNotes.map(note => (
                  <div key={note._id} style={{ background: '#1e293b', padding: '25px', borderRadius: '12px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ background: '#fbbf24', color: 'black', fontSize: '11px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>WAITING</span>
                      <h3 style={{ margin: '10px 0', fontSize: '20px' }}>{note.title}</h3>
                      <p style={{ color: '#94a3b8', margin: 0 }}>Category: {note.category} • Price: ₹{note.price}</p>
                      {note.fileUrl ? (
                         <a href={note.fileUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '10px', color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>👁️ PREVIEW FILE</a>
                      ) : (
                         <span style={{ color: '#ef4444', marginTop: '10px', display: 'block' }}>⚠️ NO FILE</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                       <button onClick={() => handleApprove(note._id)} style={actionBtn('#16a34a')}>APPROVE</button>
                       <button onClick={() => handleReject(note._id)} style={actionBtn('#dc2626')}>REJECT</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- VIEW: USER DATABASE --- */}
        {activeTab === 'users' && (
          <div>
            <h2 style={{ borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '25px' }}>User Registry</h2>
            <div style={{ background: '#1e293b', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#0f172a', color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '15px' }}>Name</th>
                    <th style={{ padding: '15px' }}>Email</th>
                    <th style={{ padding: '15px' }}>Course</th>
                    <th style={{ padding: '15px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '15px', fontWeight: 'bold' }}>{user.name}</td>
                      <td style={{ padding: '15px', color: '#94a3b8' }}>{user.email}</td>
                      <td style={{ padding: '15px' }}>{user.course} ({user.year})</td>
                      <td style={{ padding: '15px' }}>
                        <button onClick={() => handleDeleteUser(user._id)} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid #dc2626', color: '#dc2626', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>BAN USER</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// --- STYLES & COMPONENTS ---
const navBtnStyle = (active) => ({
  width: '100%', padding: '12px 15px', 
  background: active ? '#38bdf8' : 'transparent', 
  color: active ? '#0f172a' : '#94a3b8', 
  border: 'none', borderRadius: '8px', 
  cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px',
  transition: '0.2s'
});

const actionBtn = (color) => ({
  padding: '10px 20px', background: color, color: 'white', 
  border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer',
  boxShadow: `0 4px 10px ${color}40`
});

const StatCard = ({ title, value, color, icon }) => (
  <div style={{ background: '#1e293b', padding: '25px', borderRadius: '12px', border: '1px solid #334155', position: 'relative', overflow: 'hidden' }}>
    <div style={{ fontSize: '30px', marginBottom: '10px' }}>{icon}</div>
    <h3 style={{ margin: 0, fontSize: '32px', color: 'white' }}>{value}</h3>
    <p style={{ margin: '5px 0 0', color: color, fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}>{title}</p>
    <div style={{ position: 'absolute', top: -20, right: -20, width: '100px', height: '100px', background: color, borderRadius: '50%', opacity: 0.1, filter: 'blur(40px)' }}></div>
  </div>
);

export default Admin;