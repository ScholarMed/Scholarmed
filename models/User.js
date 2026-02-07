const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    course: { type: String, default: 'Not Selected' }, // e.g. B.Pharm, MBBS
    year: { type: String, default: '1st Year' },       // e.g. 1st Year, Intern
    role: { type: String, default: 'student' }         // 'student' or 'admin'
});

module.exports = mongoose.model('User', userSchema);