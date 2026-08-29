// Optional dotenv – works even if the package is missing
try { require('dotenv').config(); } catch (_) {}

// Defaults so the server runs without a .env file
process.env.PORT           = process.env.PORT           || '8000';
process.env.JWT_SECRET     = process.env.JWT_SECRET     || 'stockroom-dev-secret-change-me-in-production';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
process.env.NODE_ENV       = process.env.NODE_ENV       || 'development';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const { userRepo } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 8000;

// --- Middleware ---
app.use(cors({ origin: true, credentials: true })); // allow frontend (Vite on 5173)
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// --- Health check ---
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Stockroom Product Management API is running',
    version: '1.0.0',
    endpoints: {
      auth: 'POST /api/auth/login',
      products: 'GET|POST /api/products, GET|PUT|DELETE /api/products/:id',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// --- 404 ---
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});

// --- Seed default admin on startup ---
async function seedAdmin() {
  const existing = userRepo.findByEmail('admin@stockroom.com');
  if (!existing) {
    const hashed = await bcrypt.hash('admin123', 10);
    userRepo.create({
      name: 'Admin',
      email: 'admin@stockroom.com',
      password: hashed,
      role: 'admin',
    });
    console.log('✅ Default admin seeded: admin@stockroom.com / admin123');
  } else {
    // Ensure the password hash is correct (in case of previous broken seed)
    const hashed = await bcrypt.hash('admin123', 10);
    existing.password = hashed;
    console.log('✅ Admin password reset to: admin123');
  }
}

// --- Start ---
seedAdmin()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 Stockroom API running on http://localhost:${PORT}`);
      console.log(`   API base:  http://localhost:${PORT}/api`);
      console.log(`   Health:    http://localhost:${PORT}/api/health`);
      console.log(`\n   Default login:`);
      console.log(`     email:    admin@stockroom.com`);
      console.log(`     password: admin123\n`);
    });
  })
  .catch((err) => {
    console.error('Failed to seed admin:', err);
    process.exit(1);
  });
