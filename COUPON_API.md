# Coupon System API Documentation

## Frontend API Integration

### 1. Fetch Available Coupons (Homepage)
**File:** `src/lib/couponApi.ts`

```typescript
GET /available-coupons
```

**Success Response:**
```json
[
  {
    "code": "WELCOME20",
    "discountType": "percentage",
    "discountValue": 20,
    "minimumPurchase": 999,
    "maxDiscount": 500,
    "description": "20% OFF on first purchase",
    "expiresAt": "2026-12-31T23:59:59.999Z",
    "isNewUserOnly": true
  },
  {
    "code": "GET60",
    "discountType": "fixed",
    "discountValue": 2340,
    "minimumPurchase": 5000,
    "maxDiscount": null,
    "description": "Flat ₹2340 OFF",
    "expiresAt": "2026-10-31T23:59:59.999Z",
    "isNewUserOnly": false
  }
]
```

### 2. Fetch Welcome Coupon (After Signup)
**File:** `src/lib/couponApi.ts`

```typescript
GET /welcome-coupon
```

**Success Response:**
```json
{
  "code": "WELCOME100",
  "discountType": "fixed",
  "discountValue": 100,
  "minPurchase": 999,
  "maxDiscount": null,
  "validDays": 7,
  "description": "₹100 OFF on your first order"
}
```

### 3. Apply Coupon (Checkout Page)
**File:** `src/lib/couponApi.ts`

```typescript
POST /apply-coupon
Body: { couponCode: "WELCOME100", orderAmount: 5000 }
```

**Success Response:**
```json
{
  "success": true,
  "message": "Coupon applied successfully",
  "discount": 100,
  "finalAmount": 4900
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Coupon expired"
}
```

### 4. Validate Coupon (Optional)
```typescript
POST /coupon/validate
Body: { code: "WELCOME100", orderAmount: 5000 }
```

## Backend Routes to Implement

### `routes/coupon.js` (Update existing)

```javascript
// Add these new routes to your existing coupon.js

/**
 * GET /api/available-coupons
 * Fetch all active coupons for homepage
 */
router.get('/available-coupons', async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      expiresAt: { $gt: now }
    }).sort({ createdAt: -1 });

    const sanitized = coupons.map(c => ({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minimumPurchase: c.minOrderAmount || 0,
      maxDiscount: c.maxDiscount,
      description: c.description,
      expiresAt: c.expiresAt,
      isNewUserOnly: c.isNewUserOnly || false,
    }));

    res.json({
      success: true,
      data: sanitized,
    });
  } catch (error) {
    console.error('Fetch available coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

/**
 * GET /api/welcome-coupon
 * Get welcome coupon for new users
 */
router.get('/welcome-coupon', auth, async (req, res) => {
  try {
    const now = new Date();
    const welcomeCoupon = await Coupon.findOne({
      isActive: true,
      isNewUserOnly: true,
      expiresAt: { $gt: now }
    }).sort({ discountValue: -1 }); // Highest discount first

    if (!welcomeCoupon) {
      return res.json({
        success: false,
        message: 'No welcome coupon available',
      });
    }

    // Calculate valid days
    const validDays = Math.ceil(
      (welcomeCoupon.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    res.json({
      success: true,
      data: {
        code: welcomeCoupon.code,
        discountType: welcomeCoupon.discountType,
        discountValue: welcomeCoupon.discountValue,
        minPurchase: welcomeCoupon.minOrderAmount || 0,
        maxDiscount: welcomeCoupon.maxDiscount,
        validDays: Math.max(1, validDays),
        description: welcomeCoupon.description,
      },
    });
  } catch (error) {
    console.error('Fetch welcome coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});
```

## Components Created/Updated

### 1. `src/components/WelcomeCouponModal/WelcomeCouponModal.tsx`
- Shows after OTP verification
- Fetches welcome coupon from `/api/welcome-coupon`
- Displays: code, discount, min purchase, valid days
- Copy button with clipboard functionality
- "Shop Now" and "Maybe Later" buttons

### 2. `src/components/CouponCard/CouponCard.tsx`
- Reusable coupon card component
- Shows: code, discount, min purchase, max discount, expiry
- "Copy Code" and "Apply Now" buttons
- New user badge, expiring soon badge
- Responsive design

### 3. `src/components/OffersSection/OffersSection.tsx`
- Homepage "Offers For You" section
- Fetches from `/api/available-coupons`
- Shows loading skeleton, error state, empty state
- Grid layout with CouponCards
- Shows "Signup to unlock offers" for logged out users
- Toast notification on copy

### 4. `src/pages/CheckoutPage/CheckoutPage.tsx` (Updated)
- Coupon input field
- Calls `/apply-coupon` API
- Shows green success / red error messages
- Updates discount and total dynamically
- Loading spinner during API call
- Prevents multiple coupons

## File Structure
```
src/
├── lib/
│   └── couponApi.ts          # API functions
├── components/
│   ├── WelcomeCouponModal/
│   │   └── WelcomeCouponModal.tsx
│   ├── CouponCard/
│   │   └── CouponCard.tsx
│   └── OffersSection/
│       └── OffersSection.tsx
└── pages/
    └── CheckoutPage/
        └── CheckoutPage.tsx  # Updated with coupon UI
```

## Testing Checklist

- [ ] Signup → OTP → WelcomeCouponModal appears
- [ ] Welcome coupon displays correct data
- [ ] "Copy" button copies to clipboard
- [ ] "Shop Now" navigates to home
- [ ] Homepage shows "Offers For You" section
- [ ] Coupon cards render in responsive grid
- [ ] "Copy Code" works on coupon cards
- [ ] "Apply Now" redirects to checkout with coupon
- [ ] Checkout page applies coupon successfully
- [ ] Discount updates in bill summary
- [ ] Remove coupon works
- [ ] Loading states show properly
- [ ] Error messages display correctly
