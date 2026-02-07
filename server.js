const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = express();

// --- 1. ENABLE CORS (Allow Frontend to Talk to Backend) ---
app.use(cors({
    origin: '*', // Allow all connections (easier for testing)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ⚠️⚠️ PASTE YOUR REAL APP PASSWORD HERE LOCALLY ⚠️⚠️
// (Do NOT share this code with anyone if it has your real password)
cconst MY_EMAIL = process.env.MY_EMAIL;     
const MY_PASSWORD = process.env.MY_PASSWORD;// 👈 Remove spaces if any!

// --- 2. DATABASE CONNECTION ---
mongoose.connect('mongodb+srv://medx:kazi123@medx.h103uhn.mongodb.net/medxDB?retryWrites=true&w=majority&appName=medx')
    .then(() => console.log('✅ MongoDB Connected!'))
    .catch(err => console.error('❌ DB Connection Error:', err));

// --- 3. SCHEMAS ---
const userSchema = new mongoose.Schema({
    name: String, email: { type: String, unique: true }, password: String,
    mobile: String, college: String, role: String, course: String, year: String
});
const User = mongoose.model('User', userSchema);

const noteSchema = new mongoose.Schema({
    title: String, category: String, price: Number, fileUrl: String, authorName: String,
    upiId: String, status: { type: String, default: 'pending' }, createdAt: { type: Date, default: Date.now }
});
const Note = mongoose.model('Note', noteSchema);

const JWT_SECRET = 'scholar_med_secret_key_123';
let otpStore = {}; 

// --- 4. EMAIL TRANSPORTER ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: MY_EMAIL, pass: MY_PASSWORD }
});

// --- 🎨 EMAIL TEMPLATE ---
const getWelcomeTemplate = (name) => `
<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f7f6;">
  <div style="background-color: white; padding: 30px; border-radius: 10px; text-align: center; max-width: 500px; margin: 0 auto;">
    <h1 style="color: #0077b6;">Welcome to ScholarMed! 🎓</h1>
    <p>Hello <b>${name}</b>, you have successfully joined the community.</p>
    <a href="https://scholarmed-api.onrender.com" style="background: #0077b6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a>
  </div>
</div>
`;

// ==========================================
// 🚀 ROUTES
// ==========================================

// 1. SEND OTP 📨
app.post('/api/send-otp', async (req, res) => {
    const { email } = req.body;
    console.log(`📩 Attempting to send OTP to: ${email}`); // LOGGING

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("❌ User already exists");
            return res.status(400).json({ error: "Email already registered!" });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        otpStore[email] = otp;

        const mailOptions = {
            from: `"ScholarMed Security" <${MY_EMAIL}>`,
            to: email,
            subject: '🔐 Your Verification Code',
            text: `Your ScholarMed OTP is: ${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("❌ Email Transporter Error:", error);
                return res.status(500).json({ error: "Failed to send email. Check server logs." });
            }
            console.log(`✅ Email sent successfully: ${info.response}`);
            res.json({ message: "OTP Sent!" });
        });

    } catch (err) {
        console.error("❌ Server Error inside /send-otp:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 2. VERIFY OTP
app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    console.log(`🔍 Verifying OTP for ${email}: Input=${otp}, Stored=${otpStore[email]}`);
    
    if (otpStore[email] === otp) {
        delete otpStore[email];
        res.json({ message: "Verified!" });
    } else {
        res.status(400).json({ error: "Invalid OTP" });
    }
});

// 3. REGISTER
app.post('/api/register', async (req, res) => {
    const { name, email, password, mobile, college, role, course, year } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, mobile, college, role, course, year });
        await newUser.save();

        // Send Welcome Email (Background)
        transporter.sendMail({
            from: `"ScholarMed Team" <${MY_EMAIL}>`,
            to: email,
            subject: '🎉 Welcome to the Community!',
            html: getWelcomeTemplate(name)
        });

        res.json({ message: "Registered Successfully!" });
    } catch (err) { 
        console.error("❌ Registration Error:", err);
        res.status(500).json({ error: "Registration Failed" }); 
    }
});

// 4. LOGIN
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET);
        res.json({ token, user: { name: user.name, email: user.email, role: user.role, course: user.course } });
    } catch (err) { res.status(500).json({ error: "Login Failed" }); }
});

// 5. NOTES ROUTES
app.get('/api/notes', async (req, res) => {
    const { category } = req.query;
    let filter = { $or: [{ status: 'approved' }, { status: { $exists: false } }] };
    if (category) filter.category = category;
    const notes = await Note.find(filter);
    res.json(notes);
});

app.post('/api/notes', async (req, res) => {
    const newNote = new Note(req.body);
    await newNote.save();
    res.json({ message: "Note submitted!" });
});

// 6. ADMIN ROUTES
app.get('/api/admin/pending', async (req, res) => { const notes = await Note.find({ $or: [ { status: 'pending' }, { status: { $exists: false } } ] }); res.json(notes); });
app.get('/api/admin/users', async (req, res) => { const users = await User.find(); res.json(users); });
app.put('/api/admin/approve/:id', async (req, res) => { await Note.findByIdAndUpdate(req.params.id, { status: 'approved' }); res.json({ message: "Approved" }); });
app.delete('/api/admin/reject/:id', async (req, res) => { await Note.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); });
app.delete('/api/admin/users/:id', async (req, res) => { await User.findByIdAndDelete(req.params.id); res.json({ message: "User Deleted" }); });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on Port ${PORT}`));