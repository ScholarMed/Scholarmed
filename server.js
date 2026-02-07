const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // New Security Tool
const jwt = require('jsonwebtoken'); // New Key Maker

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
// (Your real connection string)
mongoose.connect('mongodb+srv://medx:kazi123@medx.h103uhn.mongodb.net/medxDB?retryWrites=true&w=majority&appName=medx')
    .then(() => console.log('✅ Connected to MongoDB Atlas!'))
    .catch(err => console.error('❌ Connection Error:', err));

// --- MODELS ---
// 1. Note Model (Old)
const noteSchema = new mongoose.Schema({
    title: String,
    category: String,
    price: Number
});
const Note = mongoose.model('Note', noteSchema);

// 2. User Model (New - Imported from the file you just created)
const User = require('./models/User'); 

// --- SECRET KEY (For Digital ID Cards) ---
const JWT_SECRET = 'scholar_med_secret_key_123'; // In real life, hide this!

// ==========================================
// 🔐 AUTH ROUTES (Register & Login)
// ==========================================

// 1. REGISTER (Sign Up)
app.post('/api/register', async (req, res) => {
    const { name, email, password, course, year } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists with this email!" });
        }

        // Scramble the password (Security Step)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            course, 
            year 
        });
        
        await newUser.save();
        res.json({ message: "Registration Successful! Please Login." });

    } catch (err) {
        res.status(500).json({ error: "Registration Failed" });
    }
});

// 2. LOGIN (Sign In)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found!" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid Password!" });
        }

        // Generate Digital Key (Token)
        const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET);
        
        res.json({ token, user: { name: user.name, email: user.email } });

    } catch (err) {
        res.status(500).json({ error: "Login Failed" });
    }
});

// ==========================================
// 📝 NOTE ROUTES (Your Old Code)
// ==========================================
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 ScholarMed Server running on Port ${PORT}`);
});