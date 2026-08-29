/**
 * In-memory data store for Task 1.
 * Swap this for Mongoose / Prisma / TypeORM when connecting a real database.
 * The rest of the app only talks to the exported functions below.
 */

// --- Seed data (matches the frontend mock products) ---
let products = [
  {
    id: '1',
    name: 'Wireless Mechanical Keyboard',
    price: 45000,
    description: 'Hot-swappable switches, USB-C, RGB backlight.',
    stockQuantity: 12,
    category: 'Electronics',
    image: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Ceramic Pour-Over Set',
    price: 18500,
    description: 'Hand-glazed dripper and matching mug.',
    stockQuantity: 0,
    category: 'Home',
    image: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Canvas Weekender Bag',
    price: 32000,
    description: 'Water-resistant canvas, leather straps.',
    stockQuantity: 4,
    category: 'Bags',
    image: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Users start empty; seedAdmin() in server.js creates the default admin
let users = [];

// Product repository
const productRepo = {
  findAll() {
    return [...products];
  },

  findById(id) {
    return products.find((p) => p.id === id) || null;
  },

  create(data) {
    const now = new Date().toISOString();
    const product = {
      id: String(Date.now()) + Math.random().toString(36).slice(2, 6),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    products.unshift(product);
    return product;
  },

  update(id, data) {
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    products[idx] = {
      ...products[idx],
      ...data,
      id: products[idx].id, // never overwrite id
      updatedAt: new Date().toISOString(),
    };
    return products[idx];
  },

  delete(id) {
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    products.splice(idx, 1);
    return true;
  },
};

// User repository
const userRepo = {
  findByEmail(email) {
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  findById(id) {
    return users.find((u) => u.id === id) || null;
  },

  create(data) {
    const user = {
      id: 'user-' + Date.now(),
      ...data,
    };
    users.push(user);
    return user;
  },
};

module.exports = { productRepo, userRepo, products, users };
