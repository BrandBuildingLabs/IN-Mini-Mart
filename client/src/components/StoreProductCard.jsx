import React from 'react'
import { FaCheck, FaPlus } from 'react-icons/fa6'
import { useStoreCatalog } from '../provider/StoreCatalogProvider'

const formatRupees = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

const StoreProductCard = ({ product }) => {
  const { cart, addToCart, setQuantity } = useStoreCatalog()
  const quantity = cart.find(item => item.id === product.id)?.quantity || 0
  return (
    <article className="catalog-product-card group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e9e8df] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative flex h-40 items-center justify-center bg-[#f7f7f1] p-3 sm:h-48">
        <img loading="lazy" src={product.image} alt={product.name} className="h-full w-full object-contain mix-blend-multiply transition group-hover:scale-105" />
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[9px] font-semibold text-[#718076] shadow-sm">{product.id}</span>
        <span className="absolute bottom-2 left-2 rounded-full bg-[#f6edcc] px-2 py-1 text-[9px] font-semibold text-[#7e6c2c]">Demo rate</span>
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#78867b]">{product.category}</p>
        <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-[#2d4134]">{product.name}</h3>
        <p className="mt-1 text-xs text-[#8b938b]">{product.unit}</p>
        <div className="mt-auto flex flex-col items-stretch gap-2 pt-4 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-sm font-extrabold text-[#224d35] sm:text-base">{formatRupees(product.price)}<span className="ml-1 text-[9px] font-medium text-[#8b938b]">sample</span></p>
          {quantity === 0 ? (
            <button onClick={() => addToCart(product)} className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-[#2d7048] px-2 text-xs font-bold text-[#2d7048] transition hover:bg-[#2d7048] hover:text-white sm:w-auto sm:px-3" aria-label={`Add ${product.name} to cart`}><FaPlus size={10} /> Add</button>
          ) : (
            <div className="flex h-9 w-full items-center justify-center overflow-hidden rounded-xl bg-[#2d7048] text-white sm:w-auto">
              <button onClick={() => setQuantity(product.id, quantity - 1)} className="h-full px-3 text-lg" aria-label={`Remove one ${product.name}`}>−</button>
              <span className="min-w-5 text-center text-xs font-bold">{quantity}</span>
              <button onClick={() => setQuantity(product.id, quantity + 1)} className="h-full px-3 text-lg" aria-label={`Add one ${product.name}`}><FaCheck size={10} /></button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default StoreProductCard
