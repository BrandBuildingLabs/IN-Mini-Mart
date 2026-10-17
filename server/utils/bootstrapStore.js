import bcryptjs from 'bcryptjs'
import UserModel from '../models/user.model.js'
import { seedStoreCatalog } from '../controllers/catalog.controller.js'

export default async function bootstrapStore() {
  await seedStoreCatalog()
  const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  const password = String(process.env.ADMIN_PASSWORD || '')
  if (!email || !password) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env to bootstrap the store administrator.')
  const existing = await UserModel.findOne({ email })
  if (!existing) {
    const hashedPassword = await bcryptjs.hash(password, 12)
    await UserModel.create({ name: 'IN MINI MART Admin', email, password: hashedPassword, role: 'ADMIN', verify_email: true })
    console.log(`Created initial admin account for ${email}.`)
  } else if (existing.role !== 'ADMIN') {
    existing.role = 'ADMIN'
    existing.verify_email = true
    await existing.save()
    console.log(`Granted ADMIN role to configured account ${email}. Existing password was kept.`)
  }
}
