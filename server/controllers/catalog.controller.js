import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import StoreCatalogProduct from '../models/storeCatalogProduct.model.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(here, '../..')
const catalogPath = path.join(projectRoot, 'Products', 'catalog.json')
const readCategories = async () => {
  const catalog = JSON.parse(await fs.readFile(catalogPath, 'utf8'))
  return catalog.categories || []
}

export async function seedStoreCatalog() {
  const catalog = JSON.parse(await fs.readFile(catalogPath, 'utf8'))
  let inserted = 0
  for (const product of catalog.products || []) {
    const result = await StoreCatalogProduct.updateOne({ id: product.id }, { $setOnInsert: { ...product, active: product.active !== false } }, { upsert: true })
    inserted += result.upsertedCount || 0
  }
  console.log(`Store catalog seeded: ${inserted} new product records.`)
}

export const getStoreCatalog = async (_request, response) => {
  try {
    const [categories, products] = await Promise.all([
      readCategories(),
      StoreCatalogProduct.find({ active: true }).select('-_id -__v -createdAt -updatedAt').lean(),
    ])
    response.set('Cache-Control', 'no-store')
    return response.json({ success: true, error: false, data: { categories, products } })
  } catch (error) {
    return response.status(500).json({ success: false, error: true, message: error.message })
  }
}

export const updateStoreProduct = async (request, response) => {
  try {
    const { name, categoryId, category, unit, price, description, image } = request.body || {}
    const nextPrice = Number(price)
    if (!String(name || '').trim() || !String(categoryId || '').trim() || !String(unit || '').trim() || !String(image || '').trim() || !Number.isFinite(nextPrice) || nextPrice < 0) {
      return response.status(400).json({ success: false, error: true, message: 'Name, category, image, unit and a valid rate are required.' })
    }
    const categories = await readCategories()
    const categoryRecord = categories.find(item => item.id === categoryId)
    if (!categoryRecord) return response.status(400).json({ success: false, error: true, message: 'Choose a valid catalog category.' })
    if (image.includes('..') || (!image.startsWith('/catalog-assets/') && !image.startsWith('/uploads/'))) return response.status(400).json({ success: false, error: true, message: 'Choose an existing catalog photo or upload an image.' })
    const product = await StoreCatalogProduct.findOneAndUpdate({ id: request.params.id }, { $set: {
      name: String(name).trim(), categoryId, category: category || categoryRecord.name, unit: String(unit).trim(), price: nextPrice,
      description: String(description || '').trim(), image,
    } }, { new: true, runValidators: true }).select('-_id -__v -createdAt -updatedAt').lean()
    if (!product) return response.status(404).json({ success: false, error: true, message: 'Product ID not found.' })
    return response.json({ success: true, error: false, message: 'Product saved to MongoDB.', data: product })
  } catch (error) {
    return response.status(500).json({ success: false, error: true, message: error.message })
  }
}

export const createStoreProduct = async (request, response) => {
  try {
    const { id, name, categoryId, category, unit, price, description, image } = request.body || {}
    const nextPrice = Number(price)
    if (!String(id || '').trim() || !String(name || '').trim() || !String(categoryId || '').trim() || !String(unit || '').trim() || !String(image || '').trim() || !Number.isFinite(nextPrice) || nextPrice < 0) return response.status(400).json({ success: false, message: 'ID, name, category, image, unit and a valid rate are required.' })
    const categories = await readCategories()
    const categoryRecord = categories.find(item => item.id === categoryId)
    if (!categoryRecord) return response.status(400).json({ success: false, message: 'Choose a valid catalog category.' })
    const product = await StoreCatalogProduct.create({ id: String(id).trim(), name: String(name).trim(), categoryId, category: category || categoryRecord.name, unit: String(unit).trim(), price: nextPrice, description: String(description || '').trim(), image, active: true })
    return response.status(201).json({ success: true, data: product.toObject() })
  } catch (error) {
    if (error.code === 11000) return response.status(409).json({ success: false, message: 'That product ID is already in use.' })
    return response.status(500).json({ success: false, message: error.message })
  }
}

export const saveStoreProductImage = async (request, response) => {
  if (!request.file) return response.status(400).json({ success: false, message: 'Choose a JPG, PNG, WEBP, or AVIF image under 5 MB.' })
  return response.status(201).json({ success: true, data: { image: `/uploads/${request.file.filename}` } })
}
