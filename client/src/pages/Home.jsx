import React, { useMemo, useState } from 'react'
import { FaArrowRight, FaStar } from 'react-icons/fa6'
import { BsBasket2Fill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import StoreProductCard from '../components/StoreProductCard'
import StoreCartDrawer from '../components/StoreCartDrawer'
import { useStoreCatalog } from '../provider/StoreCatalogProvider'
import shopFront from '../../inMartPhoto/unnamed (3).jpg'
import { useSelector } from 'react-redux'

const customerReviews = [
  { quote: 'Kirana shop having all the items available under one roof. This is very small village.', name: 'Anand Tatepalli', detail: 'Local Guide · 190 reviews · 221 photos', age: '6 years ago' },
  { quote: 'Better quality products are available. This kiranam is of all round development.', name: 'Mudassir Khan', detail: '3 reviews · 5 photos', age: '7 years ago' },
  { quote: 'Nice place, all recharges available here.', name: 'Kotla Mani Kanta', detail: '3 reviews · 6 photos', age: '7 years ago' },
]

const Home = () => {
  const { catalog, loading, totalQty, total, source } = useStoreCatalog()
  const user = useSelector(state => state.user)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const countByCategory = useMemo(() => catalog.products.reduce((counts, product) => ({ ...counts, [product.categoryId]: (counts[product.categoryId] || 0) + 1 }), {}), [catalog.products])
  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()
    return catalog.products.filter(product => (selectedCategory === 'all' || product.categoryId === selectedCategory) && (!term || `${product.name} ${product.category} ${product.id}`.toLowerCase().includes(term)))
  }, [catalog.products, selectedCategory, search])
  const productGroups = selectedCategory === 'all'
    ? catalog.categories.map(category => ({ category, products: filteredProducts.filter(product => product.categoryId === category.id) })).filter(group => group.products.length)
    : [{ category: catalog.categories.find(category => category.id === selectedCategory), products: filteredProducts }].filter(group => group.category)

  const chooseCategory = id => {
    setSelectedCategory(id)
    document.getElementById('catalog-listings')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="min-h-screen bg-[#fbfaf5] pb-16 text-[#24352b]">
      <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8 lg:pt-8">
        <div className="store-hero overflow-hidden rounded-[2rem] bg-[#174a35] shadow-[0_24px_70px_-35px_rgba(23,74,53,.55)]">
          <div className="grid lg:min-h-[400px] lg:grid-cols-[1.04fr_.96fr]">
            <div className="flex flex-col justify-center px-6 py-9 sm:px-10 lg:px-14 lg:py-14">
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-white/90"><span className="h-2 w-2 rounded-full bg-[#f6c945]" /> Supermarket · Kakarlapahad</div>
              <h1 className="max-w-xl text-[2.55rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.6rem]">Your local stop for <span className="text-[#f6c945]">everyday essentials.</span></h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/75 sm:text-base">From daily groceries to gathering must-haves, shop the things your home needs at IN MINI MART.</p>
              <div className="mt-7 flex flex-wrap gap-3"><a href="#shop-categories" className="inline-flex items-center gap-2 rounded-full bg-[#f6c945] px-5 py-3 text-sm font-bold text-[#20382b] transition hover:bg-[#ffe17a]">Browse products <FaArrowRight size={13} /></a>{user.role === 'ADMIN' && <Link to="/dashboard/catalog" className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Admin catalog</Link>}</div>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-white/80"><span className="inline-flex items-center gap-2"><FaStar className="text-[#f6c945]" /><strong className="text-white">4.1</strong><span>(31 reviews)</span></span><span className="hidden h-4 border-l border-white/25 sm:block" /><span className="inline-flex items-center gap-2">Nawabpet Rd · Opens 6:30 am Friday</span></div>
            </div>
            <div className="relative min-h-[260px] lg:min-h-full"><img src={shopFront} alt="IN MINI MART neighborhood storefront" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#102d20]/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#174a35]/15 lg:via-transparent lg:to-transparent" /><div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 sm:bottom-7 sm:left-7 sm:right-7"><span className="rounded-2xl border border-white/25 bg-white/90 px-4 py-3 text-xs font-semibold leading-5 text-[#253a2d] shadow-lg backdrop-blur-sm sm:text-sm">Kakarlapahad’s neighborhood<br />grocery stop</span><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#f6c945] text-[#174a35] shadow-lg"><BsBasket2Fill size={22} /></span></div></div>
          </div>
        </div>

        <div id="our-store" className="grid gap-3 pt-5 sm:grid-cols-3">
          <div className="store-info-card flex items-start gap-4 rounded-2xl border border-[#e9e8df] bg-white p-4 shadow-sm"><span className="store-info-icon">⌖</span><div><p className="text-xs font-semibold uppercase tracking-[.13em] text-[#8a948b]">Find us</p><p className="mt-1 text-sm font-semibold leading-6">Nawabpet Rd, Kakarlapahad,<br />Telangana 509340</p><p className="mt-1 text-xs text-[#737e75]">R2J6+V7 Kakarlapahad</p></div></div>
          <div className="store-info-card flex items-start gap-4 rounded-2xl border border-[#e9e8df] bg-white p-4 shadow-sm"><span className="store-info-icon">◷</span><div><p className="text-xs font-semibold uppercase tracking-[.13em] text-[#8a948b]">Opening time</p><p className="mt-1 text-sm font-semibold">Opens 6:30 am Friday</p><p className="mt-1 text-xs text-[#737e75]">Drop by for daily essentials</p></div></div>
          <button onClick={() => setCartOpen(true)} className="store-info-card flex items-start gap-4 rounded-2xl border border-[#e9e8df] bg-white p-4 text-left shadow-sm transition hover:border-[#b9d1b8]"><span className="store-info-icon"><BsBasket2Fill /></span><div className="flex-1"><p className="text-xs font-semibold uppercase tracking-[.13em] text-[#8a948b]">Your basket · {totalQty} items</p><p className="mt-1 text-sm font-semibold">Estimated total ₹{total}</p><p className="mt-1 text-xs text-[#737e75]">Demo rates · Tap to review</p></div></button>
        </div>

        <div id="shop-categories" className="pt-12">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#6c8a70]">Shop what you need</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Browse our aisles</h2></div><span className="text-sm text-[#778178]">{catalog.categories.length} categories · {catalog.products.length} sample listings</span></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <button onClick={() => chooseCategory('all')} className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${selectedCategory === 'all' ? 'border-[#39724c] bg-[#edf2eb]' : 'border-[#ebe9df] bg-white hover:border-[#c9d9c5]'}`}><span className="grid h-14 w-14 place-items-center rounded-xl bg-[#174a35] text-2xl text-[#f6c945]">🧺</span><span><strong className="block text-sm text-[#314438]">All products</strong><small className="text-xs text-[#7e897f]">{catalog.products.length} listings</small></span></button>
            {catalog.categories.map(category => <button key={category.id} onClick={() => chooseCategory(category.id)} className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${selectedCategory === category.id ? 'border-[#39724c] bg-[#edf2eb]' : 'border-[#ebe9df] bg-white hover:border-[#c9d9c5]'}`}><img src={category.image} alt="" loading="lazy" className="h-14 w-14 rounded-xl bg-[#f7f7f1] object-contain" /><span className="min-w-0"><strong className="block line-clamp-2 text-xs leading-4 text-[#314438] sm:text-sm">{category.name}</strong><small className="text-xs text-[#7e897f]">{countByCategory[category.id] || 0} listings</small></span></button>)}
          </div>
        </div>

        <div id="catalog-listings" className="scroll-mt-24 pt-12">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#6c8a70]">Everyday picks · demo prices</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{selectedCategory === 'all' ? 'Shop the full catalog' : catalog.categories.find(category => category.id === selectedCategory)?.name}</h2><p className="mt-1 text-sm text-[#778178]">Prices are samples. Confirm the final rate with the shop on WhatsApp.</p></div><label className="flex h-11 w-full items-center rounded-xl border border-[#e5e6dc] bg-white px-3 sm:max-w-sm"><span className="mr-2 text-[#8a948b]">⌕</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search products or ID" className="w-full bg-transparent text-sm outline-none" /></label></div>
          {loading ? <div className="rounded-2xl bg-white p-10 text-center text-sm text-[#778178]">Loading the product shelf…</div> : filteredProducts.length === 0 ? <div className="rounded-2xl bg-white p-10 text-center text-sm text-[#778178]">No sample listings match. Try another category or search.</div> : productGroups.map(({ category, products }) => <section key={category.id} className="mb-10">
            {selectedCategory === 'all' && <div className="mb-4 flex items-center justify-between border-b border-[#e6e7dd] pb-3"><div className="flex items-center gap-3"><img src={category.image} alt="" loading="lazy" className="h-10 w-10 rounded-xl bg-white object-contain" /><div><h3 className="text-lg font-extrabold text-[#2b4835]">{category.name}</h3><p className="text-xs text-[#7e897f]">{products.length} listings</p></div></div><button onClick={() => chooseCategory(category.id)} className="text-xs font-bold text-[#39724c] hover:underline">See category ↓</button></div>}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">{products.map(product => <StoreProductCard product={product} key={product.id} />)}</div>
          </section>)}
        </div>

        <div className="mt-6 rounded-[1.75rem] border border-[#e9e8df] bg-white p-6 sm:p-8"><div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#6c8a70]">From our customers</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight">Good words travel.</h2></div><span className="text-sm font-bold text-[#8a7425]">★ 4.1 · 31 reviews</span></div><div className="grid gap-3 md:grid-cols-3">{customerReviews.map(review => <article key={review.name} className="rounded-2xl bg-[#fbfaf5] p-4"><div className="mb-2 flex gap-1 text-xs text-[#d5a927]">★★★★★</div><p className="text-xs leading-5 text-[#49574c]">“{review.quote}”</p><p className="mt-3 text-xs font-bold text-[#304438]">{review.name}</p><p className="mt-1 text-[10px] leading-4 text-[#899188]">{review.detail} · {review.age}</p></article>)}</div><p className="mt-4 text-xs text-[#869087]">“All groceries required for small to medium gatherings are available.”</p></div>
        {source === 'static' && <p className="mt-5 text-center text-[10px] text-[#9ba198]">Catalog edits are stored in this browser until the server catalog API is connected.</p>}
      </div>
      {cartOpen && <StoreCartDrawer close={() => setCartOpen(false)} />}
    </section>
  )
}

export default Home
