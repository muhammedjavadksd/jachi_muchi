/**
 * Product Routes
 */
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/**
 * GET /api/products/:id/similar
 * Returns products from the same category as the given product, excluding itself.
 * Response: { success, data: { products: [...] } }
 */
router.get('/:id/similar', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const categorySlug = product.category?.slug;
    if (!categorySlug) {
      return res.json({ success: true, data: { products: [] } });
    }

    const similar = await Product.find({
      _id: { $ne: product._id },
      'category.slug': categorySlug,
      isActive: true,
    })
      .limit(4)
      .select('name price mrp images rating reviewCount description')
      .lean();

    res.json({ success: true, data: { products: similar } });
  } catch (error) {
    console.error('Error fetching similar products:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
