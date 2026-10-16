import { Router } from 'express'
import auth from '../middleware/auth.js'
import { admin } from '../middleware/Admin.js'
import { getStoreCatalog, updateStoreProduct } from '../controllers/catalog.controller.js'

const catalogRouter = Router()
catalogRouter.get('/', getStoreCatalog)
catalogRouter.put('/products/:id', auth, admin, updateStoreProduct)

export default catalogRouter
