const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: (v) => /^\d{8}$/.test(v) && Number(v) >= 25304200 && Number(v) <= 25304260,
      message: 'Roll number must be between 25304200 and 25304260'
    }
  },
  email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
  age: { type: Number },
  course: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);