const jwt = require('jsonwebtoken');
const { userRepo } = require('../config/db');

/**
 * Protect routes – requires a valid Bearer token.
 * Attaches req.user = { id, email, name, role }
 */
function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please provide a valid Bearer token.',
    });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = userRepo.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.',
      });
    }
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
}

/**
 * Optional: restrict to admin role only
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required.',
    });
  }
  next();
}

module.exports = { authenticate, requireAdmin };
