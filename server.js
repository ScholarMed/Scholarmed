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

// --- 2. UPDATED SCHEMAS 📝 ---

// 👤 User Schema (Now with Mobile, College, Role)
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    mobile: String,        // 📱 NEW
    college: String,       // 🏫 NEW
    role: String,          // 🎓 Student or Professor
    course: String,
    year: String
});
const User = mongoose.model('User', userSchema);

// 📄 Note Schema (Now remembers the Author)
const noteSchema = new mongoose.Schema({
    title: String,
    category: String,
    price: Number,
    fileUrl: String,
    authorName: String,    // ✍️ NEW: Stores "By Dr. Smith" or "By Rahul"
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});
const Note = mongoose.model('Note', noteSchema);

const JWT_SECRET = 'scholar_med_secret_key_123';

// ==========================================
// 🔓 PUBLIC ROUTES
// ==========================================

app.get('/api/notes', async (req, res) => {
    // Return approved notes OR notes created before we added status (Legacy support)
    const notes = await Note.find({
        $or: [ { status: 'approved' }, { status: { $exists: false } } ]
    });
    res.json(notes);
});

app.post('/api/notes', async (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    // We accept 'authorName' from the frontend now
    const newNote = new Note(req.body);
    await newNote.save();
    res.json({ message: "Note submitted for review!" });
});

// ==========================================
// 👮‍♂️ ADMIN ROUTES
// ==========================================
app.get('/api/admin/pending', async (req, res) => {
    const notes = await Note.find({
        $or: [ { status: 'pending' }, { status: { $exists: false } } ]
    });
    res.json(notes);
});

app.get('/api/admin/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

app.put('/api/admin/approve/:id', async (req, res) => {
    await Note.findByIdAndUpdate(req.params.id, { status: 'approved' });
    res.json({ message: "Approved" });
});

app.delete('/api/admin/reject/:id', async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

app.delete('/api/admin/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User Deleted" });
});

// ==========================================
// 🔐 AUTH ROUTES (Updated Register)
// ==========================================

app.post('/api/register', async (req, res) => {
    // 📥 Receive all the new details
    const { name, email, password, mobile, college, role, course, year } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "User exists" });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 💾 Save everything to DB
        const newUser = new User({ 
            name, email, password: hashedPassword, 
            mobile, college, role, course, year 
        });
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
        // Send back the Name so we can use it as 'Author Name' later
        res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
    } catch (err) { res.status(500).json({ error: "Login Failed" }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 ScholarMed Server running on Port ${PORT}`));