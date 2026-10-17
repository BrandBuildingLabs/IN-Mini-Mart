import { Router } from 'express'
import auth from '../middleware/auth.js'
import { admin } from '../middleware/Admin.js'
import storeImageUpload from '../middleware/storeImageUpload.js'
import { createStoreProduct, getStoreCatalog, saveStoreProductImage, seedStoreCatalog, updateStoreProduct } from '../controllers/catalog.controller.js'

const catalogRouter = Router()
catalogRouter.get('/', getStoreCatalog)
catalogRouter.post('/seed', auth, admin, async (_request, response) => {
  try { await seedStoreCatalog(); return response.json({ success: true, message: 'Catalog seed completed.' }) }
  catch (error) { return response.status(500).json({ success: false, message: error.message }) }
})
catalogRouter.post('/products', auth, admin, createStoreProduct)
catalogRouter.post('/products/:id/image', auth, admin, storeImageUpload.single('image'), saveStoreProductImage)
catalogRouter.put('/products/:id', auth, admin, updateStoreProduct)
export default catalogRouter
