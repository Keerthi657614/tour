const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Test route
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Auth route is active!' });
});
console.log('Auth routes loaded');

// Register route
router.post('/register', async (req, res) => {
  console.log('Register endpoint hit');
  const { userName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ userName, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Temporary GET route for testing login and register paths
router.get('/login', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/register', (req, res) => {
  res.status(200).json({ message: 'Register route is reachable with GET for testing only' });
});


module.exports = router;