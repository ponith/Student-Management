require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Student = require('./models/Student');

const app = express();
const PORT = process.env.PORT || 5000;
const MAX_STUDENTS = 60;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch students', error: err.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const count = await Student.countDocuments();
    if (count >= MAX_STUDENTS) {
      return res.status(400).json({ message: `Limit reached: only ${MAX_STUDENTS} students allowed` });
    }

    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0];
      if (field === 'email') {
        return res.status(400).json({ message: 'This email is already registered' });
      }
      return res.status(400).json({ message: 'Roll number already exists' });
    }
    if (err.name === 'ValidationError') {
      const first = Object.values(err.errors)[0];
      return res.status(400).json({ message: first.message });
    }
    res.status(400).json({ message: err.message });
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });