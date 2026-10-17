import { Router } from 'express'
import auth from '../middleware/auth.js'
import { admin } from '../middleware/Admin.js'
import { createStoreOrder, getStoreOrders, updateStoreOrderStatus } from '../controllers/storeOrder.controller.js'

const storeOrderRouter = Router()
storeOrderRouter.post('/', createStoreOrder)
storeOrderRouter.get('/admin', auth, admin, getStoreOrders)
storeOrderRouter.patch('/:id/status', auth, admin, updateStoreOrderStatus)
export default storeOrderRouter
