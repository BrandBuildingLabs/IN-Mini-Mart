import crypto from 'node:crypto'
import StoreCatalogProduct from '../models/storeCatalogProduct.model.js'
import StoreOrder from '../models/storeOrder.model.js'

export async function createStoreOrder(request, response) {
  try {
    const name = String(request.body?.customer?.name || '').trim()
    const phone = String(request.body?.customer?.phone || '').trim()
    const address = String(request.body?.customer?.address || '').trim()
    const requestedItems = Array.isArray(request.body?.items) ? request.body.items : []
    if (!name || !/^\+?[0-9 ()-]{8,20}$/.test(phone)) return response.status(400).json({ success: false, message: 'Enter your name and a valid phone number.' })
    if (!requestedItems.length || requestedItems.length > 100) return response.status(400).json({ success: false, message: 'Your basket is empty or has too many items.' })
    const quantities = new Map()
    for (const line of requestedItems) {
      const id = String(line?.id || '').trim()
      const quantity = Number(line?.quantity)
      if (!id || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) return response.status(400).json({ success: false, message: 'Each product needs a valid ID and quantity from 1 to 99.' })
      quantities.set(id, (quantities.get(id) || 0) + quantity)
    }
    const products = await StoreCatalogProduct.find({ id: { $in: [...quantities.keys()] }, active: true }).lean()
    if (products.length !== quantities.size) return response.status(409).json({ success: false, message: 'A product is no longer available. Refresh and try again.' })
    const items = products.map(product => ({ productId: product.id, name: product.name, category: product.category, unit: product.unit, price: product.price, quantity: quantities.get(product.id), lineTotal: product.price * quantities.get(product.id) }))
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const total = items.reduce((sum, item) => sum + item.lineTotal, 0)
    const orderNumber = `IM-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
    const order = await StoreOrder.create({ orderNumber, customer: { name, phone, address }, items, itemCount, total, paymentMethod: 'pay-on-delivery' })
    return response.status(201).json({ success: true, data: { id: order._id, orderNumber, items: order.items, itemCount, total, status: order.status } })
  } catch (error) {
    return response.status(500).json({ success: false, message: error.message })
  }
}

export async function getStoreOrders(_request, response) {
  try {
    const orders = await StoreOrder.find().sort({ createdAt: -1 }).limit(100).lean()
    return response.json({ success: true, data: orders })
  } catch (error) { return response.status(500).json({ success: false, message: error.message }) }
}

export async function updateStoreOrderStatus(request, response) {
  const allowed = ['pending', 'confirmed', 'preparing', 'completed', 'cancelled']
  if (!allowed.includes(request.body?.status)) return response.status(400).json({ success: false, message: 'Invalid order status.' })
  try {
    const order = await StoreOrder.findByIdAndUpdate(request.params.id, { status: request.body.status }, { new: true, runValidators: true }).lean()
    if (!order) return response.status(404).json({ success: false, message: 'Order not found.' })
    return response.json({ success: true, data: order })
  } catch (error) { return response.status(500).json({ success: false, message: error.message }) }
}
