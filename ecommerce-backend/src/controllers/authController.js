const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userRepo } = require('../config/db');

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Response: { token, user: { name, email, role } }
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = userRepo.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(200).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
}

module.exports = { login };
