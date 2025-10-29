const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = process.env;

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(payload.id).select('-passwordHash');
    if (!req.user) return res.status(401).json({ message: 'Invalid token (user not found)' });
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
