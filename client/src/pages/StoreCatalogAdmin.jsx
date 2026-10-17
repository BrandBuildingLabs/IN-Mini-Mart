import React, { useMemo, useState } from 'react'
import { FaMagnifyingGlass, FaPen, FaXmark } from 'react-icons/fa6'
import { useStoreCatalog } from '../provider/StoreCatalogProvider'

const formatRupees = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

const StoreCatalogAdmin = () => {
  const { catalog, loading, source, saveProduct, createProduct } = useStoreCatalog()
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState('all')
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isNew, setIsNew] = useState(false)
  const imageOptions = useMemo(() => catalog.products.map(product => ({ image: product.image, label: `${product.name} · ${product.category}` })), [catalog.products])
  const visibleProducts = useMemo(() => catalog.products.filter(product => {
    const matchesCategory = categoryId === 'all' || product.categoryId === categoryId
    const term = query.trim().toLowerCase()
    const matchesQuery = !term || `${product.id} ${product.name} ${product.category}`.toLowerCase().includes(term)
    return matchesCategory && matchesQuery
  }), [catalog.products, categoryId, query])

  const startEdit = product => { setIsNew(false); setEditing({ ...product }); setError(''); setNotice('') }
  const startCreate = () => { const first = catalog.categories[0]; setIsNew(true); setEditing({ id: `INM-${String(Date.now()).slice(-8)}`, name: '', categoryId: first?.id || '', category: first?.name || '', image: catalog.products[0]?.image || '', price: 0, unit: '1 pack', description: '' }); setError(''); setNotice('') }
  const change = event => setEditing(current => ({ ...current, [event.target.name]: event.target.value }))
  const uploadImage = async event => {
    const file = event.target.files?.[0]
    if (!file || !editing) return
    const body = new FormData()
    body.append('image', file)
    setUploadingImage(true); setError('')
    try {
      const response = await fetch(`/api/catalog/products/${encodeURIComponent(editing.id)}/image`, { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('accesstoken')}` }, body })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.message || 'Image upload failed.')
      setEditing(current => ({ ...current, image: result.data.image }))
    } catch (uploadError) { setError(uploadError.message || 'Image upload failed.') }
    finally { setUploadingImage(false); event.target.value = '' }
  }
  const save = async event => {
    event.preventDefault()
    setSaving(true); setError(''); setNotice('')
    try {
      if (isNew) await createProduct(editing)
      else await saveProduct(editing)
      setEditing(null)
      setNotice(isNew ? 'Product added to the storefront.' : 'Product saved to MongoDB and the storefront.')
    } catch (saveError) { setError(saveError.response?.data?.message || saveError.message || 'Could not save this product.') }
    finally { setSaving(false) }
  }

  return (
    <section className="min-h-[75vh] bg-[#fbfaf5] p-4 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-xs font-bold uppercase tracking-[.15em] text-[#6c8a70]">IN MINI MART · Admin</p><h1 className="mt-1 text-2xl font-extrabold text-[#244a34]">Store catalog</h1><p className="mt-1 text-sm text-[#78867b]">Search by product ID, name, or category, then select Edit to update its photo, details, pack size, or rate.</p></div>
        <div className="flex items-center gap-2"><span className="w-fit rounded-full bg-[#edf2eb] px-3 py-2 text-xs font-semibold text-[#416b4c]">{catalog.products.length} product cards</span><button onClick={startCreate} disabled={source !== 'api'} className="rounded-xl bg-[#24573a] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">Add product</button></div>
      </div>
      {source !== 'api' && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">API offline: you can browse sample products, but edits are disabled until MongoDB and the server are running.</p>}
      {notice && <p className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 items-center gap-2 rounded-xl border border-[#e7e8df] bg-white px-3"><FaMagnifyingGlass className="text-[#879287]" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Find by product name or ID" className="w-full bg-transparent py-3 text-sm outline-none" /></label>
        <select value={categoryId} onChange={event => setCategoryId(event.target.value)} className="rounded-xl border border-[#e7e8df] bg-white px-3 py-3 text-sm text-[#314438] outline-none"><option value="all">All categories</option>{catalog.categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
      </div>
      {loading ? <p className="py-12 text-center text-sm text-[#78867b]">Loading catalog…</p> : (
        <div className="mt-4 overflow-hidden rounded-2xl border border-[#e9e8df] bg-white">
          <div className="hidden grid-cols-[84px_105px_1fr_200px_110px_82px] items-center gap-3 border-b border-[#e9e8df] bg-[#f6f7f1] px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#7a877d] md:grid"><span>Photo</span><span>Product ID</span><span>Product</span><span>Category</span><span>Demo rate</span><span></span></div>
          <div className="divide-y divide-[#efeee8]">
            {visibleProducts.map(product => <div key={product.id} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 p-3 sm:p-4 md:grid-cols-[84px_105px_1fr_200px_110px_82px]">
              <img src={product.image} alt="" className="h-14 w-14 rounded-xl bg-[#f7f7f1] object-contain md:h-16 md:w-16" />
              <span className="text-[10px] font-bold text-[#738176] md:text-xs">{product.id}</span>
              <span className="min-w-0"><strong className="block truncate text-sm text-[#314438]">{product.name}</strong><small className="text-[10px] text-[#8b938b] md:hidden">{product.category} · {formatRupees(product.price)}</small></span>
              <span className="hidden truncate text-xs text-[#78867b] md:block">{product.category}</span>
              <span className="hidden text-sm font-bold text-[#244a34] md:block">{formatRupees(product.price)}</span>
              <button onClick={() => startEdit(product)} className="inline-flex items-center gap-2 rounded-xl border border-[#d8e5d7] px-3 py-2 text-xs font-bold text-[#356b48] hover:bg-[#edf2eb]"><FaPen size={10} /><span className="hidden sm:inline">Edit</span></button>
            </div>)}
            {visibleProducts.length === 0 && <p className="p-8 text-center text-sm text-[#78867b]">No products match that search.</p>}
          </div>
        </div>
      )}
      {editing && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-[#14251b]/55 p-3 sm:p-6" onClick={() => setEditing(null)}>
          <form onSubmit={save} onClick={event => event.stopPropagation()} className="my-auto w-full max-w-2xl rounded-3xl bg-white p-5 shadow-2xl sm:p-7">
            <div className="mb-5 flex items-start justify-between"><div>{isNew ? <label className="text-xs font-bold uppercase tracking-[.14em] text-[#6c8a70]">Product ID<input name="id" value={editing.id} onChange={change} required className="mt-1 block rounded-lg border px-2 py-1 text-xs normal-case tracking-normal text-[#24352b]" /></label> : <p className="text-xs font-bold uppercase tracking-[.14em] text-[#6c8a70]">{editing.id}</p>}<h2 className="mt-1 text-xl font-extrabold text-[#244a34]">{isNew ? 'Add product card' : 'Edit product card'}</h2></div><button type="button" onClick={() => setEditing(null)} className="rounded-full p-2 hover:bg-[#f1f2eb]"><FaXmark /></button></div>
            <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
              <img src={editing.image} alt="Selected product" className="h-36 w-full rounded-2xl bg-[#f7f7f1] object-contain p-2" />
              <div className="grid gap-3">
                <label className="grid gap-1 text-xs font-semibold text-[#617064]">Product name<input name="name" value={editing.name} onChange={change} required className="rounded-xl border border-[#e7e8df] px-3 py-2.5 text-sm text-[#24352b] outline-none focus:border-[#76a17e]" /></label>
                <label className="grid gap-1 text-xs font-semibold text-[#617064]">Category<select name="categoryId" value={editing.categoryId} onChange={event => { const category = catalog.categories.find(item => item.id === event.target.value); setEditing(current => ({ ...current, categoryId: category.id, category: category.name })) }} className="rounded-xl border border-[#e7e8df] px-3 py-2.5 text-sm text-[#24352b] outline-none">{catalog.categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
              </div>
            </div>
            <label className="mt-4 grid gap-1 text-xs font-semibold text-[#617064]">Product image<select name="image" value={editing.image} onChange={change} className="rounded-xl border border-[#e7e8df] px-3 py-2.5 text-sm text-[#24352b] outline-none">{imageOptions.map((option, index) => <option key={`${option.image}-${index}`} value={option.image}>{option.label}</option>)}</select><span className="font-normal text-[#899188]">Choose a supplied catalog photo or upload a JPG, PNG, WEBP, or AVIF image (max 5 MB).</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={uploadImage} disabled={uploadingImage} className="text-xs" />{uploadingImage && <span className="text-[#356b48]">Uploading image…</span>}</label>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-xs font-semibold text-[#617064]">Rate (₹)<input name="price" type="number" min="0" step="1" value={editing.price} onChange={change} required className="rounded-xl border border-[#e7e8df] px-3 py-2.5 text-sm text-[#24352b] outline-none focus:border-[#76a17e]" /></label>
              <label className="grid gap-1 text-xs font-semibold text-[#617064]">Pack / unit<input name="unit" value={editing.unit} onChange={change} required className="rounded-xl border border-[#e7e8df] px-3 py-2.5 text-sm text-[#24352b] outline-none focus:border-[#76a17e]" /></label>
            </div>
            <label className="mt-4 grid gap-1 text-xs font-semibold text-[#617064]">Product information<textarea name="description" value={editing.description} onChange={change} rows={3} className="resize-y rounded-xl border border-[#e7e8df] px-3 py-2.5 text-sm text-[#24352b] outline-none focus:border-[#76a17e]" /></label>
            {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setEditing(null)} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#6e796f] hover:bg-[#f6f7f1]">Cancel</button><button disabled={saving || source !== 'api' || uploadingImage} className="rounded-xl bg-[#24573a] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1b432d] disabled:opacity-60">{saving ? 'Saving…' : isNew ? 'Add product' : 'Save product'}</button></div>
          </form>
        </div>
      )}
    </section>
  )
}

export default StoreCatalogAdmin
