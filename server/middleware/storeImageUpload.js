import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import multer from 'multer'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const uploadDirectory = path.resolve(here, '../uploads')
fs.mkdirSync(uploadDirectory, { recursive: true })
const extensions = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/avif': '.avif' }
const storage = multer.diskStorage({
  destination: (_request, _file, callback) => callback(null, uploadDirectory),
  filename: (_request, file, callback) => callback(null, `${Date.now()}-${crypto.randomUUID()}${extensions[file.mimetype] || '.img'}`),
})
export default multer({ storage, limits: { fileSize: 5 * 1024 * 1024, files: 1 }, fileFilter: (_request, file, callback) => {
  if (!extensions[file.mimetype]) return callback(new Error('Only JPG, PNG, WEBP, and AVIF images are accepted.'))
  callback(null, true)
})
