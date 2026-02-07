const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// --- CONNECT TO DATABASE ---
mongoose.connect('mongodb+srv://medx:kazi123@medx.h103uhn.mongodb.net/medxDB?retryWrites=true&w=majority&appName=medx')
    .then(() => console.log('✅ Connected to MongoDB Atlas!'))
    .catch(err => console.error('❌ Connection Error:', err));

// --- SCHEMAS ---
const User = require('./models/User'); 

const noteSchema = new mongoose.Schema({
    title: String,
    category: String,
    price: Number,
    fileUrl: String,  // 👈 THIS IS THE KEY! (The Guest List Entry)
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});
const Note = mongoose.model('Note', noteSchema);

const JWT_SECRET = 'scholar_med_secret_key_123';

// ==========================================
// 🔓 PUBLIC ROUTES
// ==========================================

// 1. GET APPROVED NOTES (Including Old Ones) 🌍
app.get('/api/notes', async (req, res) => {
    const notes = await Note.find({
        $or: [
            { status: 'approved' },
            { status: { $exists: false } }
        ]
    });
    res.json(notes);
});

// 2. UPLOAD NOTE (Starts as Pending) 📤
app.post('/api/notes', async (req, res) => {
    console.log("📥 INCOMING UPLOAD:", req.body); // Keep tracking just in case!

    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    // Mongoose will now see 'fileUrl' in the schema and SAVE it!
    const newNote = new Note(req.body);
    await newNote.save();
    
    console.log("✅ Note Saved with File!");
    res.json({ message: "Note submitted for review!" });
});

// ==========================================
// 👮‍♂️ ADMIN ROUTES
// ==========================================

// 3. GET PENDING NOTES (Including Ghosts) 🕵️‍♂️
app.get('/api/admin/pending', async (req, res) => {
    const notes = await Note.find({
        $or: [
            { status: 'pending' },
            { status: { $exists: false } }
        ]
    });
    res.json(notes);
});

// 4. APPROVE A NOTE ✅
app.put('/api/admin/approve/:id', async (req, res) => {
    try {
        await Note.findByIdAndUpdate(req.params.id, { status: 'approved' });
        res.json({ message: "Note Approved!" });
    } catch (err) {
        res.status(500).json({ error: "Approval failed" });
    }
});

// 5. REJECT/DELETE A NOTE ❌
app.delete('/api/admin/reject/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: "Note Rejected!" });
    } catch (err) {
        res.status(500).json({ error: "Rejection failed" });
    }
});

// ==========================================
// 🔐 AUTH ROUTES
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 ScholarMed Server running on Port ${PORT}`));