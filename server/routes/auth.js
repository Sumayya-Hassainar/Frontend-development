const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
const { validate, registerSchema, loginSchema } = require('../utils/validattors');

/**
 * @route   POST /auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    // ✅ Validate input using Joi
    const { valid, errors, value } = validate(registerSchema, req.body);
    if (!valid) return res.status(400).json({ message: errors });

    const { name, email, password } = value;

    // ✅ Check existing user
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // ✅ Create user
    const user = await User.create({ name, email, passwordHash });

    // ✅ Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    // ✅ Validate input
    const { valid, errors, value } = validate(loginSchema, req.body);
    if (!valid) return res.status(400).json({ message: errors });

    const { email, password } = value;

    // ✅ Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // ✅ Compare password
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    // ✅ Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
