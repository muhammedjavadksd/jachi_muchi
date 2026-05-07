# Wishlist API Endpoints

## Base URL
`http://localhost:5000/api/wishlist`

## Endpoints

### 1. Get Wishlist Items
**GET** `/wishlist`

Returns all wishlist items for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Wishlist fetched successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "productId": "/product/1",
      "name": "Classic Aviator Sunglasses",
      "image": "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
      "link": "/product/1",
      "price": 1999,
      "addedAt": "2026-05-06T10:30:00.000Z"
    }
  ]
}
```

### 2. Add Item to Wishlist
**POST** `/wishlist/add`

Adds a product to the user's wishlist.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": "/product/1",
  "name": "Classic Aviator Sunglasses",
  "image": "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
  "link": "/product/1",
  "price": 1999
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to wishlist",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "productId": "/product/1",
    "name": "Classic Aviator Sunglasses",
    "image": "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
    "link": "/product/1",
    "price": 1999,
    "addedAt": "2026-05-06T10:30:00.000Z"
  }
}
```

### 3. Remove Item from Wishlist
**DELETE** `/wishlist/remove/:productId`

Removes a product from the user's wishlist.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Item removed from wishlist"
}
```

### 4. Check if Item is in Wishlist
**GET** `/wishlist/check/:productId`

Checks if a specific product is in the user's wishlist.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Check completed",
  "data": {
    "isInWishlist": true
  }
}
```

## Backend Implementation (Node.js/Express Example)

```javascript
// routes/wishlist.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Wishlist = require('../models/Wishlist');

// GET /api/wishlist - Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user.id }).sort({ addedAt: -1 });
    res.json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/wishlist/add - Add item to wishlist
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, name, image, link, price } = req.body;

    // Check if already in wishlist
    const existing = await Wishlist.findOne({ userId: req.user.id, productId });
    if (existing) {
      return res.json({ success: true, message: 'Already in wishlist', data: existing });
    }

    const item = new Wishlist({
      userId: req.user.id,
      productId,
      name,
      image,
      link,
      price,
    });

    await item.save();
    res.status(201).json({ success: true, message: 'Item added to wishlist', data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/wishlist/remove/:productId - Remove item from wishlist
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ userId: req.user.id, productId: req.params.productId });
    res.json({ success: true, message: 'Item removed from wishlist' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/wishlist/check/:productId - Check if item is in wishlist
router.get('/check/:productId', auth, async (req, res) => {
  try {
    const item = await Wishlist.findOne({ userId: req.user.id, productId: req.params.productId });
    res.json({ success: true, data: { isInWishlist: !!item } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
```

## MongoDB Schema Example

```javascript
// models/Wishlist.js
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String, required: true },
  price: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now },
});

// Compound index to prevent duplicates
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
```
