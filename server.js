const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. CONNECT TO DATABASE 💾 ---
mongoose.connect('mongodb+srv://medx:kazi123@medx.h103uhn.mongodb.net/medxDB?retryWrites=true&w=majority&appName=medx')
    .then(() => console.log('✅ Connected to MongoDB Atlas!'))
    .catch(err => console.error('❌ Connection Error:', err));

// --- 2. SCHEMAS 📝 ---
// User Schema (Make sure this matches your User.js or define it here if needed)
const User = require('./models/User'); 

// Note Schema (Updated with File URL)
const noteSchema = new mongoose.Schema({
    title: String,
    category: String,
    price: Number,
    fileUrl: String,  // 📂 Stores the PDF/Image link
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});
const Note = mongoose.model('Note', noteSchema);

const JWT_SECRET = 'scholar_med_secret_key_123';

// ==========================================
// 🔓 PUBLIC ROUTES (For Website)
// ==========================================

// Get Approved Notes (Home Page)
app.get('/api/notes', async (req, res) => {
    const notes = await Note.find({
        $or: [
            { status: 'approved' },
            { status: { $exists: false } }
        ]
    });
    res.json(notes);
});

// Upload New Note
app.post('/api/notes', async (req, res) => {
    console.log("📥 New Upload:", req.body);
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const newNote = new Note(req.body);
    await newNote.save();
    
    console.log("✅ Note Saved!");
    res.json({ message: "Note submitted for review!" });
});

// ==========================================
// 👮‍♂️ ADMIN ROUTES (The Control Panel)
// ==========================================

// Get Pending Notes
app.get('/api/admin/pending', async (req, res) => {
    const notes = await Note.find({
        $or: [
            { status: 'pending' },
            { status: { $exists: false } }
        ]
    });
    res.json(notes);
});

// Approve Note
app.put('/api/admin/approve/:id', async (req, res) => {
    await Note.findByIdAndUpdate(req.params.id, { status: 'approved' });
    res.json({ message: "Approved" });
});

// Reject/Delete Note
app.delete('/api/admin/reject/:id', async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// --- 👇 NEW: USER MANAGEMENT ROUTES 👇 ---

// Get All Users (For Admin Dashboard)
app.get('/api/admin/users', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all students
        res.json(users);
    } catch (err) { res.status(500).json({ error: "Failed to fetch users" }); }
});

// Delete/Ban User
app.delete('/api/admin/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User Banned/Deleted!" });
    } catch (err) { res.status(500).json({ error: "Delete failed" }); }
});

// ==========================================
// 🔐 AUTH ROUTES (Login/Register)
// ==========================================

app.post('/api/register', async (req, res) => {
    const { name, email, password, course, year } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "User exists" });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, course, year });
        await newUser.save();
        res.json({ message: "Registered!" });
    } catch (err) { res.status(500).json({ error: "Failed" }); }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET);
        res.json({ token, user: { name: user.name, email: user.email } });
    } catch (err) { res.status(500).json({ error: "Login Failed" }); }
});

// ==========================================
// 🚀 SERVER START (Here is app.listen!)
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 ScholarMed Server running on Port ${PORT}`));