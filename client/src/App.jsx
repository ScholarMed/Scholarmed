import React, { useState, useEffect } from 'react';

// ==========================================
// 🔗 CONNECTING TO YOUR LIVE BACKEND (BRAIN)
// ==========================================
const API_URL = 'https://scholarmed-api.onrender.com';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('MBBS');
  const [price, setPrice] = useState('');

  // --- FETCH NOTES (Load from Internet) ---
  useEffect(() => {
    // This connects to your Render server to get notes
    fetch(`${API_URL}/api/notes`)
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => console.error("Error fetching notes:", err));
  }, []);

  // --- UPLOAD FUNCTION (Send to Internet) ---
  const handleUpload = () => {
    const newNote = { title, category, price };

    fetch(`${API_URL}/api/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote)
    })
    .then(res => res.json())
    .then(updatedList => {
      setNotes(updatedList);
      setTitle('');
      setPrice('');
      alert('Note Uploaded Successfully to Cloud! ☁️');
    })
    .catch(err => console.error("Error uploading note:", err));
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f9', minHeight: '100vh' }}>
      
      {/* NAVBAR */}
      <nav style={{ backgroundColor: '#0d1b2a', color: 'white', padding: '15px 20px', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>ScholarMed 🎓</h1>
      </nav>

      <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px' }}>
        
        {/* UPLOAD FORM */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <h3 style={{ marginTop: 0 }}>📤 Sell Your Note</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            
            <input 
              type="text" 
              placeholder="Note Title (e.g. Physics Formulas)" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ padding: '10px', flex: 1 }}
            />
            
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '10px' }}>
              <option>MBBS</option>
              <option>NEET</option>
              <option>B.Pharm</option>
              <option>BHMS</option>
            </select>

            <input 
              type="number" 
              placeholder="Price (₹)" 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ padding: '10px', width: '80px' }}
            />

            <button onClick={handleUpload} style={{ padding: '10px 20px', backgroundColor: '#2a9d8f', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
              UPLOAD
            </button>
          </div>
        </div>

        {/* DISPLAY NOTES */}
        <h3 style={{ textAlign: 'center' }}>Available Notes</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {notes.length === 0 ? <p>Loading notes from Cloud...</p> : notes.map((note) => (
            <div key={note._id} style={{ width: '200px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <small style={{ color: '#0077b6', fontWeight: 'bold' }}>{note.category}</small>
              <h4 style={{ margin: '10px 0' }}>{note.title}</h4>
              <div style={{ color: '#2a9d8f', fontWeight: 'bold' }}>₹{note.price}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;