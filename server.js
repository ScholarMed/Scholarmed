const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ==================================================
// 🔑 YOUR REAL CONNECTION STRING
// ==================================================
mongoose.connect('mongodb+srv://medx:kazi123@medx.h103uhn.mongodb.net/medxDB?retryWrites=true&w=majority&appName=medx')
    .then(() => console.log('✅ Connected to MongoDB Atlas!'))
    .catch(err => console.error('❌ Connection Error:', err));

// --- NOTE MODEL ---
const noteSchema = new mongoose.Schema({
    title: String,
    category: String,
    price: Number
});
const Note = mongoose.model('Note', noteSchema);

// ==========================================
// 👉 STEP 3: NEW SCHOLARMED WELCOME MESSAGE
// ==========================================
app.get('/', (req, res) => {
    res.send('<h1>ScholarMed Server is Online 🎓</h1>');
});

// --- API ROUTES (Your Notes Logic) ---
app.get('/api/notes', async (req, res) => {
    const notes = await Note.find();
    res.json(notes);
});

app.post('/api/notes', async (req, res) => {
    const newNote = new Note(req.body);
    await newNote.save();
    const updatedList = await Note.find();
    res.json(updatedList);
});

// --- START SERVER ---
// "process.env.PORT" lets Render choose the port.
// "|| 5000" is a backup for your computer.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 ScholarMed Server running on Port ${PORT}`);
});