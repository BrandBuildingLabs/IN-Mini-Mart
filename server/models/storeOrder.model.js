import mongoose from 'mongoose'

const storeOrderLineSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  lineTotal: { type: Number, required: true, min: 0 },
}, { _id: false })

const storeOrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, index: true },
  customer: {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, default: '', trim: true },
  },
  items: { type: [storeOrderLineSchema], required: true },
  itemCount: { type: Number, required: true, min: 1 },
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'completed', 'cancelled'], default: 'pending', index: true },
  paymentMethod: { type: String, enum: ['pay-on-delivery'], default: 'pay-on-delivery' },
}, { timestamps: true })

export default mongoose.model('StoreOrder', storeOrderSchema)
