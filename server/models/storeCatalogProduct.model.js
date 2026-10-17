import mongoose from 'mongoose'

const storeCatalogProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true, trim: true },
  name: { type: String, required: true, trim: true },
  categoryId: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  image: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  active: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('StoreCatalogProduct', storeCatalogProductSchema)
