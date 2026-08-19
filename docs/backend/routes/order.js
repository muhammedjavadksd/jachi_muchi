const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

/**
 * POST /api/orders
 * Create a new order.  The frontend already sends name/image/price per item,
 * but if any are missing we backfill from the Product collection so the order
 * always carries a complete snapshot.
 */
router.post('/', auth, async (req, res) => {
  try {
    const { items, addressId, totalAmount, paymentMethod } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'No items provided' });
    }

    // Collect productIds that need snapshot backfill
    const idsToLookup = items
      .filter(item => !item.name || !item.image || item.price == null)
      .map(item => item.productId)
      .filter(Boolean);

    let productMap = {};
    if (idsToLookup.length > 0) {
      const products = await Product.find({ _id: { $in: idsToLookup } }).lean();
      products.forEach(p => { productMap[p._id.toString()] = p; });
    }

    const snapshotItems = items.map(item => {
      const product = item.productId ? productMap[item.productId.toString()] : null;
      return {
        productId: item.productId,
        name: item.name || product?.name || 'Product unavailable',
        image: item.image || product?.images?.[0] || '',
        price: item.price ?? product?.price ?? 0,
        quantity: item.quantity || 1,
        variantId: item.variantId,
        color: item.color,
        lens: item.lens,
        powerDetails: item.powerDetails,
      };
    });

    const order = await Order.create({
      userId: req.user.id || req.user._id,
      items: snapshotItems,
      totalAmount,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'pending',
      status: 'pending',
      statusTimeline: [{ status: 'pending', date: new Date() }],
    });

    return res.status(201).json({
      success: true,
      data: { orderId: order._id.toString(), order },
    });
  } catch (error) {
    console.error('[Order Create] error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create order' });
  }
});

/**
 * GET /api/orders/my
 * Returns all orders for the authenticated user.
 * Items include name/image/price snapshot fields — no populate needed.
 */
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id || req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, data: orders });
  } catch (error) {
    console.error('[Order List] error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

/**
 * GET /api/orders/:id
 * Returns a single order by _id for the authenticated user.
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id || req.user._id,
    }).lean();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    console.error('[Order Get] error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
});

/**
 * PUT /api/orders/:id/cancel
 * Cancels a pending order.
 */
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id || req.user._id,
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled' });
    }

    order.status = 'cancelled';
    order.statusTimeline.push({ status: 'cancelled', date: new Date() });
    await order.save();

    return res.json({ success: true, data: order });
  } catch (error) {
    console.error('[Order Cancel] error:', error);
    return res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
});

/**
 * GET /api/track/:orderId
 * Public endpoint — no auth required.
 * Returns order info for the tracking page using snapshot fields.
 */
router.get('/track/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({
      $or: [{ _id: orderId }, { orderId }],
    }).lean();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    console.error('[Track Order] error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
});

module.exports = router;
