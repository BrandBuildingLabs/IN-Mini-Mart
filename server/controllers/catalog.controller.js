import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(here, '../..')
const catalogPaths = [
  path.join(projectRoot, 'Products', 'catalog.json'),
  path.join(projectRoot, 'client', 'public', 'catalog.json'),
]

const readCatalog = async () => JSON.parse(await fs.readFile(catalogPaths[0], 'utf8'))
const writeCatalog = async (catalog) => {
  const serialized = JSON.stringify(catalog, null, 2)
  for (const file of catalogPaths) await fs.writeFile(file, serialized, 'utf8')
}

export const getStoreCatalog = async (_request, response) => {
  try {
    const catalog = await readCatalog()
    return response.json({ success: true, error: false, data: catalog })
  } catch (error) {
    return response.status(500).json({ success: false, error: true, message: error.message })
  }
}

export const updateStoreProduct = async (request, response) => {
  try {
    const catalog = await readCatalog()
    const productIndex = catalog.products.findIndex(product => product.id === request.params.id)
    if (productIndex < 0) return response.status(404).json({ success: false, error: true, message: 'Product ID not found.' })

    const current = catalog.products[productIndex]
    const { name, categoryId, category, unit, price, description, image } = request.body
    const nextPrice = Number(price)
    if (!String(name || '').trim() || !String(categoryId || '').trim() || !String(unit || '').trim() || !Number.isFinite(nextPrice) || nextPrice < 0) {
      return response.status(400).json({ success: false, error: true, message: 'Name, category, unit and a valid rate are required.' })
    }
    if (image && (!image.startsWith('/catalog-assets/') || image.includes('..'))) {
      return response.status(400).json({ success: false, error: true, message: 'Choose an image from the supplied product catalog.' })
    }
    const categoryRecord = catalog.categories.find(item => item.id === categoryId)
    if (!categoryRecord) return response.status(400).json({ success: false, error: true, message: 'Choose a valid catalog category.' })

    catalog.products[productIndex] = {
      ...current,
      name: String(name).trim(),
      categoryId,
      category: category || categoryRecord.name,
      unit: String(unit).trim(),
      price: nextPrice,
      description: String(description || ''),
      image: image || current.image,
    }
    await writeCatalog(catalog)
    return response.json({ success: true, error: false, message: 'Catalog product updated.', data: catalog.products[productIndex] })
  } catch (error) {
    return response.status(500).json({ success: false, error: true, message: error.message })
  }
}
