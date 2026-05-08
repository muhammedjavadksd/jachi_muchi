/**
 * Coupon Seeder Script
 * Run this to create sample coupons in your database
 *
 * Usage: node seedCoupons.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const sampleCoupons = [
  {
    code: 'WELCOME100',
    discountType: 'fixed',
    discountValue: 100,
    minOrderAmount: 500,
    maxDiscount: null,
    expiresAt: new Date('2026-12-31'),
    isActive: true,
    usageLimit: 1000,
    description: 'Welcome coupon - ₹100 off on orders above ₹500',
    applicableCategories: [],
  },
  {
    code: 'GET60',
    discountType: 'fixed',
    discountValue: 2340,
    minOrderAmount: 5000,
    maxDiscount: null,
    expiresAt: new Date('2026-12-31'),
    isActive: true,
    usageLimit: 500,
    description: 'Flat ₹2340 off on orders above ₹5000',
    applicableCategories: [],
  },
  {
    code: 'SAVE20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 1000,
    maxDiscount: 500,
    expiresAt: new Date('2026-12-31'),
    isActive: true,
    usageLimit: 2000,
    description: '20% off up to ₹500 on orders above ₹1000',
    applicableCategories: [],
  },
  {
    code: 'FIRST50',
    discountType: 'percentage',
    discountValue: 50,
    minOrderAmount: 800,
    maxDiscount: 300,
    expiresAt: new Date('2026-12-31'),
    isActive: true,
    usageLimit: 100,
    description: '50% off up to ₹300 for first-time users',
    applicableCategories: [],
  },
  {
    code: 'SUMMER25',
    discountType: 'percentage',
    discountValue: 25,
    minOrderAmount: 1500,
    maxDiscount: 750,
    expiresAt: new Date('2026-08-31'),
    isActive: true,
    usageLimit: null,
    description: 'Summer special 25% off up to ₹750',
    applicableCategories: ['sunglass'],
  },
];

const seedCoupons = async () => {
  try {
    console.log('Seeding coupons...');

    for (const couponData of sampleCoupons) {
      const existing = await Coupon.findOne({ code: couponData.code });

      if (existing) {
        console.log(`Coupon ${couponData.code} already exists, skipping...`);
      } else {
        const coupon = new Coupon(couponData);
        await coupon.save();
        console.log(`Created coupon: ${couponData.code} - ${couponData.description}`);
      }
    }

    console.log('Coupon seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding coupons:', error);
    process.exit(1);
  }
};

seedCoupons();
