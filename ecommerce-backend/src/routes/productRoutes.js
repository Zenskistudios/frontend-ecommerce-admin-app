const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { productValidationRules, validate } = require('../middleware/validate');

const router = express.Router();

// All product routes require authentication
router.use(authenticate);

// Optional: enforce admin role (uncomment if you want stricter control)
// router.use(requireAdmin);

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', productValidationRules, validate, createProduct);
router.put('/:id', productValidationRules, validate, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
