/**
 * Coupon Routes
 * Create this file: routes/coupon.js
 */

const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const auth = require('../middleware/auth');

/**
 * POST /api/coupon/apply
 * Apply a coupon code to an order
 * Expects: { code } in body
 * Returns: { success, message, discount, finalAmount, couponCode }
 */
router.post('/apply', auth, async (req, res) => {
  try {
    const code = req.body.couponCode || req.body.code;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a coupon code',
      });
    }

    // Find the coupon
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    // Check if coupon exists
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code',
      });
    }

    // Check if coupon is valid
    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This coupon is no longer active',
      });
    }

    // Check if expired
    if (coupon.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Coupon has expired',
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has reached its usage limit',
      });
    }

    // Get order amount from request (you'll send this from frontend)
    const { orderAmount } = req.body;

    if (!orderAmount) {
      return res.status(400).json({
        success: false,
        message: 'Order amount is required',
      });
    }

    // Check minimum order amount
    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = Math.min(coupon.discountValue, orderAmount);
    }

    discount = Math.round(discount);

    // Calculate final amount
    const finalAmount = orderAmount - discount;

    // Increment usage count
    coupon.usedCount += 1;
    await coupon.save();

    res.json({
      success: true,
      message: 'Coupon applied successfully',
      discount: discount,
      finalAmount: finalAmount,
      couponCode: coupon.code,
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while applying coupon',
    });
  }
});

/**
 * POST /api/coupon/remove
 * Remove/Invalidate an applied coupon
 * Expects: { code } in body
 */
router.post('/remove', auth, async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a coupon code',
      });
    }

    // Find and decrement usage count (optional - depends on business logic)
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (coupon && coupon.usedCount > 0) {
      coupon.usedCount -= 1;
      await coupon.save();
    }

    res.json({
      success: true,
      message: 'Coupon removed successfully',
    });
  } catch (error) {
    console.error('Remove coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing coupon',
    });
  }
});

/**
 * POST /api/coupon/validate
 * Validate a coupon without applying it
 * Expects: { code, orderAmount } in body
 */
router.post('/validate', auth, async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a coupon code',
      });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code',
      });
    }

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This coupon is no longer active',
      });
    }

    if (coupon.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Coupon has expired',
      });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has reached its usage limit',
      });
    }

    if (orderAmount && orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required`,
      });
    }

    let discount = 0;
    if (orderAmount) {
      if (coupon.discountType === 'percentage') {
        discount = (orderAmount * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = Math.min(coupon.discountValue, orderAmount);
      }
      discount = Math.round(discount);
    }

    res.json({
      success: true,
      message: 'Coupon is valid',
      discount: discount,
      finalAmount: orderAmount ? orderAmount - discount : undefined,
      couponCode: coupon.code,
      description: coupon.description,
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while validating coupon',
    });
  }
});

/**
 * POST /api/coupon/create
 * Create a new coupon (Admin only)
 * Expects: { code, discountType, discountValue, expiresAt, ... } in body
 */
router.post('/create', auth, async (req, res) => {
  try {
    // TODO: Add admin check middleware
    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      expiresAt,
      usageLimit,
      isActive,
      description,
      applicableCategories,
    } = req.body;

    if (!code || !discountValue || !expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Code, discount value, and expiry date are required',
      });
    }

    // Check if coupon already exists
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists',
      });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || 0,
      maxDiscount,
      expiresAt,
      usageLimit,
      isActive: isActive !== undefined ? isActive : true,
      description,
      applicableCategories: applicableCategories || [],
      createdBy: req.user.id,
    });

    await coupon.save();

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon,
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating coupon',
    });
  }
});

/**
 * GET /api/coupon/list
 * List all coupons (Admin only)
 */
router.get('/list', auth, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    console.error('List coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching coupons',
    });
  }
});

/**
 * GET /api/coupons/available
 * Get all available coupons for the user
 */
router.get('/available', async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      expiresAt: { $gt: now },
      $or: [
        { usageLimit: { $exists: false } },
        { $expr: { $lt: ['$usedCount', '$usageLimit'] } }
      ]
    }).sort({ createdAt: -1 });

    const mappedCoupons = coupons.map(c => ({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minPurchase: c.minOrderAmount || 0,
      maxDiscount: c.maxDiscount,
      description: c.description,
      expiresAt: c.expiresAt,
      isNewUserOnly: c.isNewUserOnly || false,
    }));

    res.json({
      success: true,
      data: mappedCoupons,
    });
  } catch (error) {
    console.error('Available coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching coupons',
    });
  }
});

/**
 * GET /api/coupons/welcome
 * Get welcome coupon for new users
 */
router.get('/welcome', auth, async (req, res) => {
  try {
    const welcomeCoupon = await Coupon.findOne({
      isActive: true,
      isNewUserOnly: true,
      expiresAt: { $gt: new Date() },
      code: { $regex: /welcome/i }
    }).sort({ createdAt: -1 });

    if (!welcomeCoupon) {
      return res.status(404).json({
        success: false,
        message: 'No welcome coupon available',
      });
    }

    res.json({
      success: true,
      data: {
        code: welcomeCoupon.code,
        discountType: welcomeCoupon.discountType,
        discountValue: welcomeCoupon.discountValue,
        minPurchase: welcomeCoupon.minOrderAmount || 0,
        maxDiscount: welcomeCoupon.maxDiscount,
        description: welcomeCoupon.description,
        validDays: Math.ceil((welcomeCoupon.expiresAt - new Date()) / (1000 * 60 * 60 * 24)),
      },
    });
  } catch (error) {
    console.error('Welcome coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching welcome coupon',
    });
  }
});

module.exports = router;
