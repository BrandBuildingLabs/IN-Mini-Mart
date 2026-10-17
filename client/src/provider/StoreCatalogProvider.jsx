import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const CatalogContext = createContext(null)
const CART_KEY = 'inMiniMartCart'
const readJSON = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback } catch { return fallback }
}

export const StoreCatalogProvider = ({ children }) => {
  const [catalog, setCatalog] = useState({ categories: [], products: [] })
  const [cart, setCart] = useState(() => readJSON(CART_KEY, []))
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('static')

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const response = await fetch('/catalog.json')
        if (response.ok) {
          const data = await response.json()
          if (active) setCatalog(data)
        }
      } catch (error) { console.error('Unable to load the sample catalog', error) }
      const apiBase = String(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
      try {
        const response = await fetch(`${apiBase}/api/catalog`, { signal: AbortSignal.timeout(2500) })
        const result = await response.json()
        if (response.ok && result.success && Array.isArray(result.data?.products) && active) {
          setCatalog(result.data)
          setSource('api')
        }
      } catch { /* Static sample products stay visible while MongoDB is offline. */ }
      if (active) setLoading(false)
    }
    load()
    return () => { active = false }
  }, [])

  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(cart)) }, [cart])

  const addToCart = useCallback(product => {
    setCart(current => {
      const existing = current.find(item => item.id === product.id)
      return existing ? current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { id: product.id, quantity: 1 }]
    })
  }, [])
  const setQuantity = useCallback((id, quantity) => setCart(current => quantity <= 0 ? current.filter(item => item.id !== id) : current.map(item => item.id === id ? { ...item, quantity } : item)), [])
  const removeFromCart = useCallback(id => setCart(current => current.filter(item => item.id !== id)), [])

  const saveProduct = useCallback(async changes => {
    if (source !== 'api') throw new Error('Start the API and connect MongoDB before saving product changes.')
    const updated = { ...changes, id: String(changes.id).trim(), name: String(changes.name).trim(), price: Number(changes.price) }
    if (!updated.id || !updated.name || !updated.categoryId || !updated.category || !updated.image || !updated.unit || !Number.isFinite(updated.price) || updated.price < 0) throw new Error('Enter a name, category, image, unit, and valid non-negative rate.')
    const response = await Axios({ ...SummaryApi.updateStoreProduct, url: `/api/catalog/products/${encodeURIComponent(updated.id)}`, data: updated })
    if (!response.data.success) throw new Error(response.data.message || 'Product update failed.')
    const saved = response.data.data
    setCatalog(current => ({ ...current, products: current.products.map(product => product.id === saved.id ? saved : product) }))
    return saved
  }, [source])

  const createProduct = useCallback(async changes => {
    if (source !== 'api') throw new Error('Start the API and connect MongoDB before adding products.')
    const response = await Axios({ url: '/api/catalog/products', method: 'post', data: { ...changes, price: Number(changes.price) } })
    if (!response.data.success) throw new Error(response.data.message || 'Product creation failed.')
    const created = response.data.data
    setCatalog(current => ({ ...current, products: [...current.products, created] }))
    return created
  }, [source])

  const productsById = useMemo(() => Object.fromEntries(catalog.products.map(product => [product.id, product])), [catalog.products])
  const cartItems = useMemo(() => cart.map(item => ({ ...item, product: productsById[item.id] })).filter(item => item.product), [cart, productsById])
  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const createOrder = useCallback(async customer => {
    const response = await Axios({ ...SummaryApi.createOrder, data: { customer, items: cart.map(({ id, quantity }) => ({ id, quantity })) } })
    if (!response.data.success) throw new Error(response.data.message || 'Could not place the order.')
    return response.data.data
  }, [cart])
  const value = { catalog, loading, source, cart, cartItems, totalQty, total, addToCart, setQuantity, removeFromCart, saveProduct, createProduct, createOrder }
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export const useStoreCatalog = () => {
  const context = useContext(CatalogContext)
  if (!context) throw new Error('useStoreCatalog must be used inside StoreCatalogProvider')
  return context
}
