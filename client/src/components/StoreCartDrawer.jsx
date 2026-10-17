import React, { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { useStoreCatalog } from '../provider/StoreCatalogProvider'

const formatRupees = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
const ADMIN_WHATSAPP = String(import.meta.env.VITE_ADMIN_WHATSAPP || '918501075395').replace(/[^0-9]/g, '')

const StoreCartDrawer = ({ close }) => {
  const { cartItems, total, totalQty, setQuantity, createOrder } = useStoreCatalog()
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' })
  const [sending, setSending] = useState(false)
  const [orderError, setOrderError] = useState('')

  const sendOrder = async () => {
    if (!customer.name.trim() || !customer.phone.trim()) { setOrderError('Enter your name and phone number to place an order.'); return }
    setSending(true); setOrderError('')
    const whatsappTab = window.open('about:blank', '_blank')
    try {
      const order = await createOrder(customer)
      const lines = order.items.map(item => `${item.productId} | ${item.name} (${item.category}) | ${item.quantity} x ${item.unit} @ ${formatRupees(item.price)} = ${formatRupees(item.lineTotal)}`)
    const details = [
      'Hello IN MINI MART, I would like to place this order:',
      '',
      ...lines,
      '',
      `Order reference: ${order.orderNumber}`,
      `Items: ${order.itemCount}`,
      `Estimated total: ${formatRupees(order.total)}`,
      'Payment: Pay on delivery (confirm with shop)',
      customer.name.trim() ? `Customer: ${customer.name.trim()}` : '',
      customer.phone.trim() ? `Phone: ${customer.phone.trim()}` : '',
      customer.address.trim() ? `Delivery address: ${customer.address.trim()}` : '',
      '',
      'Please confirm availability and delivery details with the shop.',
    ].filter(Boolean).join(String.fromCharCode(10))
      const target = whatsappTab || window.open('', '_blank')
      if (target) target.location.href = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(details)}`
      else window.location.href = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(details)}`
    } catch (error) {
      if (whatsappTab) whatsappTab.close()
      setOrderError(error.response?.data?.message || error.message || 'Could not place your order. Please retry.')
    } finally { setSending(false) }
  }

  return (
    <div className="fixed inset-0 z-[70] bg-[#14251b]/55" onClick={close}>
      <aside className="ml-auto flex h-full w-full max-w-md flex-col bg-[#fbfaf5] shadow-2xl" onClick={event => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#e9e8df] bg-white px-5 py-4">
          <div><p className="text-lg font-extrabold text-[#244a34]">Your basket</p><p className="text-xs text-[#7c877d]">{totalQty} {totalQty === 1 ? 'item' : 'items'} · IN MINI MART</p></div>
          <button onClick={close} aria-label="Close basket" className="rounded-full p-2 hover:bg-[#f1f2eb]"><IoClose size={22} /></button>
        </div>
        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center"><span className="text-5xl">🧺</span><h2 className="mt-4 text-lg font-bold text-[#314438]">Your basket is empty</h2><p className="mt-2 text-sm text-[#7c877d]">Add a few essentials and send your order to the shop on WhatsApp.</p></div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {cartItems.map(({ product, quantity }) => (
                <article key={product.id} className="flex gap-3 rounded-2xl border border-[#e9e8df] bg-white p-3">
                  <img src={product.image} alt="" className="h-16 w-16 rounded-xl bg-[#f7f7f1] object-contain" />
                  <div className="min-w-0 flex-1"><p className="text-[10px] font-semibold text-[#809084]">{product.id} · {product.category}</p><p className="mt-1 truncate text-sm font-bold text-[#2d4134]">{product.name}</p><p className="mt-1 text-xs text-[#78867b]">{formatRupees(product.price)} / {product.unit}</p></div>
                  <div className="flex h-8 shrink-0 items-center rounded-lg bg-[#edf2eb] text-[#2d7048]"><button onClick={() => setQuantity(product.id, quantity - 1)} className="px-2">−</button><span className="min-w-4 text-center text-xs font-bold">{quantity}</span><button onClick={() => setQuantity(product.id, quantity + 1)} className="px-2">+</button></div>
                </article>
              ))}
              <div className="space-y-2 rounded-2xl bg-white p-4">
                <p className="mb-3 text-sm font-bold text-[#314438]">Contact details <span className="font-normal text-[#8b938b]">(needed for order)</span></p>
                <input value={customer.name} onChange={event => setCustomer({ ...customer, name: event.target.value })} placeholder="Your name" required className="w-full rounded-xl border border-[#e7e8df] bg-[#fbfaf5] px-3 py-2.5 text-sm outline-none focus:border-[#76a17e]" />
                <input value={customer.phone} onChange={event => setCustomer({ ...customer, phone: event.target.value })} placeholder="Your phone number" inputMode="tel" required className="w-full rounded-xl border border-[#e7e8df] bg-[#fbfaf5] px-3 py-2.5 text-sm outline-none focus:border-[#76a17e]" />
                <textarea value={customer.address} onChange={event => setCustomer({ ...customer, address: event.target.value })} placeholder="Delivery address or pickup note" rows={2} className="w-full resize-none rounded-xl border border-[#e7e8df] bg-[#fbfaf5] px-3 py-2.5 text-sm outline-none focus:border-[#76a17e]" />
              </div>
            </div>
            <div className="border-t border-[#e9e8df] bg-white p-4">
              <div className="mb-3 flex items-center justify-between"><span className="text-sm text-[#66756a]">Estimated total</span><strong className="text-lg text-[#244a34]">{formatRupees(total)}</strong></div>
              {orderError && <p role="alert" className="mb-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">{orderError}</p>}
              <button onClick={sendOrder} disabled={sending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#18864b] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#126c3c]"><FaWhatsapp size={19} /> {sending ? 'Saving order…' : 'Place order on WhatsApp'}</button>
              <p className="mt-2 text-center text-[10px] text-[#899188]">The shop receives a pending order record, then WhatsApp opens so you can confirm it.</p>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

export default StoreCartDrawer
