const { productRepo } = require('../config/db');

/**
 * GET /api/products
 */
function getAllProducts(req, res) {
  try {
    const products = productRepo.findAll();
    // Frontend expects a plain array
    return res.status(200).json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
}

/**
 * GET /api/products/:id
 */
function getProductById(req, res) {
  try {
    const product = productRepo.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }
    return res.status(200).json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed to fetch product.' });
  }
}

/**
 * POST /api/products
 */
function createProduct(req, res) {
  try {
    const { name, price, description, stockQuantity, category, image } = req.body;

    const product = productRepo.create({
      name: name.trim(),
      price: Number(price),
      description: description.trim(),
      stockQuantity: Number(stockQuantity),
      category: category ? category.trim() : '',
      image: image || '',
    });

    return res.status(201).json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
}

/**
 * PUT /api/products/:id
 */
function updateProduct(req, res) {
  try {
    const existing = productRepo.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const { name, price, description, stockQuantity, category, image } = req.body;

    const updated = productRepo.update(req.params.id, {
      name: name.trim(),
      price: Number(price),
      description: description.trim(),
      stockQuantity: Number(stockQuantity),
      category: category !== undefined ? (category || '').trim() : existing.category,
      image: image !== undefined ? (image || '') : existing.image,
    });

    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
}

/**
 * DELETE /api/products/:id
 */
function deleteProduct(req, res) {
  try {
    const deleted = productRepo.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }
    return res.status(200).json({ success: true, message: 'Product deleted successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
