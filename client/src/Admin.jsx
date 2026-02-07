import React, { useState, useEffect } from 'react';

const API_URL = 'https://scholarmed-api.onrender.com';

function Admin() {
  const [pendingNotes, setPendingNotes] = useState([]);

  useEffect(() => {
    fetchPendingNotes();
  }, []);

  const fetchPendingNotes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/pending`);
      const data = await response.json();
      setPendingNotes(data);
    } catch (error) {
      console.error("Error fetching pending notes:", error);
    }
  };

  const handleApprove = async (id) => {
    await fetch(`${API_URL}/api/admin/approve/${id}`, { method: 'PUT' });
    alert("✅ Note Live on Website!");
    fetchPendingNotes(); // Refresh list
  };

  const handleReject = async (id) => {
    if(!window.confirm("Are you sure you want to delete this?")) return;
    await fetch(`${API_URL}/api/admin/reject/${id}`, { method: 'DELETE' });
    fetchPendingNotes();
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#d32f2f', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
        👮‍♂️ Admin Dashboard
      </h1>
      <p>Only you can see this page. Approve notes to make them public.</p>

      {pendingNotes.length === 0 ? (
        <h3 style={{ color: 'green' }}>All caught up! No pending notes. ✅</h3>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
          {pendingNotes.map((note) => (
            <div key={note._id} style={{ 
              backgroundColor: 'white', padding: '20px', borderRadius: '10px', 
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)', borderLeft: '5px solid orange',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <span style={{ backgroundColor: '#fff3e0', color: 'orange', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold' }}>PENDING REVIEW</span>
                <h3 style={{ margin: '10px 0' }}>{note.title}</h3>
                <p style={{ margin: 0 }}>Category: <b>{note.category}</b> | Price: <b>₹{note.price}</b></p>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleApprove(note._id)} style={{ padding: '10px 20px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                  APPROVE ✅
                </button>
                <button onClick={() => handleReject(note._id)} style={{ padding: '10px 20px', backgroundColor: '#c62828', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                  REJECT 🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;