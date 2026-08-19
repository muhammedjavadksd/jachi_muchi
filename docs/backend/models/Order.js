const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  variantId: String,
  color: {
    id: String,
    name: String,
  },
  lens: {
    id: String,
    name: String,
    price: Number,
  },
  powerDetails: {
    leftSPH: String,
    rightSPH: String,
    leftCYL: String,
    rightCYL: String,
    isSamePower: Boolean,
    hasCylindrical: Boolean,
    customerName: String,
    customerPhone: String,
    knowPowerLater: Boolean,
  },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: { type: [orderItemSchema], required: true },
  totalAmount: { type: Number, required: true },
  subtotal: Number,
  discount: Number,
  shipping: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
  },
  paymentMethod: { type: String, default: 'COD' },
  paymentStatus: { type: String, default: 'pending' },
  shippingAddress: {
    name: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
  },
  deliveryDate: String,
  statusTimeline: [{
    status: String,
    date: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

orderSchema.index({ orderId: 1 });
orderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
