# Jachi Muchi Backend Setup

## Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

## Quick Start

1. **Install dependencies:**
   ```bash
   cd docs/backend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Seed sample coupons:**
   ```bash
   npm run seed
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

Server runs on `http://localhost:5000`

## API Endpoints

### Coupon Endpoints
- `POST /api/coupons/apply` - Apply coupon to order
- `POST /api/coupons/remove` - Remove applied coupon
- `POST /api/coupons/validate` - Validate coupon without applying
- `GET /api/coupons/available` - List available coupons for user
- `GET /api/coupons/welcome` - Get welcome coupon for new users
- `POST /api/coupons/create` - Create new coupon (admin)
- `GET /api/coupons` - List all coupons (admin)

## Testing the Coupon Flow

1. Sign up a new user
2. After OTP verification, welcome coupon modal should appear
3. Navigate to homepage - "Offers For You" section should show available coupons
4. Click "Apply Now" on any coupon - redirects to checkout with coupon auto-applied
5. Or manually enter coupon code on checkout page

## Sample Coupons (after seed)
- `WELCOME100` - ₹100 OFF, min ₹999, new users only
- `SAVE20` - 20% OFF, max ₹500, min ₹999
- `FLAT150` - ₹150 OFF, min ₹1499
- `FIRST50` - ₹50 OFF, min ₹499
