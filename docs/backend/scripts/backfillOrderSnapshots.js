/**
 * One-time migration script: backfill productName / productImage / price
 * on existing order items that only have a productId reference.
 *
 * Usage:
 *   cd docs/backend && node scripts/backfillOrderSnapshots.js
 *
 * What it does:
 *   1. Finds all orders whose items are missing snapshot fields.
 *   2. Collects unique productIds from those items.
 *   3. Looks up each product in the Product collection.
 *   4. Backfills name, image, and price from the live product where it exists.
 *   5. Falls back to "Product no longer available" / "" / 0 where the product
 *      has been hard-deleted.
 *
 * Safe to run multiple times — it skips items that already have a snapshot.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jachi_muchi';

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.\n');

  // Find orders that have at least one item missing a name or image
  const orders = await Order.find({
    items: { $elemMatch: { $or: [{ name: { $exists: false } }, { name: null }, { name: '' }, { image: { $exists: false } }, { image: null }] } },
  }).lean();

  console.log(`Found ${orders.length} order(s) with items needing backfill.\n`);

  if (orders.length === 0) {
    console.log('Nothing to do.');
    await mongoose.disconnect();
    return;
  }

  // Collect unique productIds across all items that need backfill
  const productIds = new Set();
  for (const order of orders) {
    for (const item of order.items || []) {
      if ((!item.name || !item.image || item.price == null) && item.productId) {
        productIds.add(item.productId.toString());
      }
    }
  }

  console.log(`Looking up ${productIds.size} unique product(s)...\n`);

  // Batch-fetch products
  const products = await Product.find({ _id: { $in: [...productIds] } }).lean();
  const productMap = {};
  for (const p of products) {
    productMap[p._id.toString()] = p;
  }

  let updated = 0;
  let backfilled = 0;
  let fallback = 0;

  for (const order of orders) {
    let changed = false;
    const patchedItems = order.items.map(item => {
      if (item.name && item.image && item.price != null) return item; // already has snapshot

      const pid = item.productId?.toString();
      const product = pid ? productMap[pid] : null;

      changed = true;
      if (product) {
        backfilled++;
        return {
          ...item,
          name: item.name || product.name || 'Product',
          image: item.image || product.images?.[0] || '',
          price: item.price ?? product.price ?? 0,
        };
      }

      // Product no longer exists
      fallback++;
      return {
        ...item,
        name: item.name || 'Product no longer available',
        image: item.image || '',
        price: item.price ?? 0,
      };
    });

    if (changed) {
      await Order.updateOne(
        { _id: order._id },
        { $set: { items: patchedItems } }
      );
      updated++;
    }
  }

  console.log('Migration complete.');
  console.log(`  Orders updated:  ${updated}`);
  console.log(`  Items backfilled: ${backfilled} (from live products)`);
  console.log(`  Items fallback:   ${fallback} (product deleted — using placeholder)`);

  await mongoose.disconnect();
  console.log('\nDone.');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
