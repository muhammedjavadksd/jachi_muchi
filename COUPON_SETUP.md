# Coupon System Setup Guide

## Overview
Complete coupon system with frontend and backend integration for your eCommerce application.

## Backend Setup

### 1. Install Required Dependencies
```bash
npm install mongoose dotenv
```

### 2. Add Coupon Model
Copy `docs/backend/models/Coupon.js` to your backend `models/` directory.

### 3. Add Coupon Routes
Copy `docs/backend/routes/coupon.js` to your backend `routes/` directory.

### 4. Register Routes in Main Server File
Add to your `app.js` or `server.js`:
```javascript
const couponRoutes = require('./routes/coupon');
app.use('/api/coupon', couponRoutes);
```

### 5. Create `.env` File (if not exists)
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
```

### 6. Seed Initial Coupons
```bash
cd docs/backend
node seedCoupons.js
```

This creates these sample coupons:
| Code | Type | Value | Min Order | Max Discount | Expires |
|------|------|-------|-----------|--------------|---------|
| WELCOME100 | Fixed | ₹100 | ₹500 | - | Dec 31, 2026 |
| GET60 | Fixed | ₹2340 | ₹5000 | - | Dec 31, 2026 |
| SAVE20 | Percentage | 20% | ₹1000 | ₹500 | Dec 31, 2026 |
| FIRST50 | Percentage | 50% | ₹800 | ₹300 | Dec 31, 2026 |
| SUMMER25 | Percentage | 25% | ₹1500 | ₹750 | Aug 31, 2026 |

## Frontend Integration

### Files Already Updated:
1. **`src/lib/couponApi.ts`** - API service with:
   - `applyCoupon(code, orderAmount)` - Apply coupon via API
   - `removeCoupon(code)` - Remove applied coupon
   - `validateCoupon(code, orderAmount)` - Validate without applying

2. **`src/pages/CheckoutPage/CheckoutPage.tsx`** - Updated with:
   - Coupon input field
   - Loading spinner during API call
   - Green success state
   - Red error state
   - Remove coupon button
   - LocalStorage persistence
   - Updates discount and total automatically

### API Endpoints Expected:

#### POST `/api/coupon/apply`
**Request:**
```json
{
  "code": "WELCOME100",
  "orderAmount": 1200
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Coupon applied successfully",
  "discount": 100,
  "finalAmount": 1100,
  "couponCode": "WELCOME100"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Coupon expired"
}
```

## Features Implemented

### Frontend Features:
✅ User enters coupon code in checkout page
✅ Apply coupon using Axios API call
✅ Loading state with spinner while validating
✅ Success message in green color with checkmark
✅ Error message in red color with icon
✅ Updates discount amount and final total
✅ Updates applied coupon section
✅ Prevents applying multiple coupons (must remove first)
✅ Remove coupon button with API call
✅ Persists in localStorage during page refresh
✅ Disables apply button after successful apply
✅ Handles backend responses properly
✅ Modern clean UI with fade-in animations
✅ Responsive design
✅ Enter key support
✅ Disables button during request

### Backend Features:
✅ Create new coupons (admin)
✅ Apply coupon with validation
✅ Check expiry date
✅ Check usage limits
✅ Check minimum order amount
✅ Fixed or percentage discount types
✅ Optional max discount cap
✅ Category-specific coupons
✅ Usage tracking

## Testing the Coupon System

1. **Start your backend server**
   ```bash
   npm run dev
   ```

2. **Start your frontend**
   ```bash
   npm run dev
   ```

3. **Add items to cart** and proceed to checkout

4. **Apply a coupon**:
   - Enter `WELCOME100` (gives ₹100 off on orders above ₹500)
   - Enter `GET60` (gives ₹2340 off on orders above ₹5000)
   - Try invalid code to see error handling

5. **Verify**:
   - Green success message appears
   - Discount amount updates in bill summary
   - Final total updates
   - Refresh page - coupon persists
   - Remove coupon - discount disappears

## Creating New Coupons (Admin API)

### Using curl:
```bash
curl -X POST http://localhost:5000/api/coupon/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "code": "NEWYEAR500",
    "discountType": "fixed",
    "discountValue": 500,
    "minOrderAmount": 2000,
    "expiresAt": "2026-12-31",
    "usageLimit": 100
  }'
```

### Using Postman:
1. Method: POST
2. URL: `http://localhost:5000/api/coupon/create`
3. Headers: `Authorization: Bearer <token>`
4. Body (JSON):
```json
{
  "code": "DIWALI1000",
  "discountType": "fixed",
  "discountValue": 1000,
  "minOrderAmount": 5000,
  "expiresAt": "2026-11-15",
  "usageLimit": 500
}
```

## Troubleshooting

### Coupon not applying:
- Check backend is running on correct port
- Verify `axiosInstance` baseURL in `src/cors/axiosInstance.ts`
- Check browser console for API errors

### Coupon not persisting after refresh:
- Check if localStorage has `coupon` key
- Verify `loadCoupon` useEffect in CheckoutPage

### Backend errors:
- Ensure MongoDB is running
- Check coupon model is properly imported
- Verify routes are registered

## File Structure
```
frontend/
├── src/
│   ├── lib/
│   │   └── couponApi.ts          # API service
│   └── pages/
│       └── CheckoutPage/
│           └── CheckoutPage.tsx   # Updated with coupon UI
└── docs/
    └── backend/
        ├── models/
        │   └── Coupon.js         # MongoDB schema
        ├── routes/
        │   └── coupon.js          # API routes
        └── seedCoupons.js         # Seed sample coupons
```
