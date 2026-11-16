import mongoose from 'mongoose'

const storeCatalogCategorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true, trim: true },
  name: { type: String, required: true, trim: true },
  image: { type: String, required: true, trim: true },
  active: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('StoreCatalogCategory', storeCatalogCategorySchema)
