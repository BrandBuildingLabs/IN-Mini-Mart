import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegCircleUser } from 'react-icons/fa6'
import { FaBasketShopping } from 'react-icons/fa6'
import { GoTriangleDown, GoTriangleUp } from 'react-icons/go'
import { useSelector } from 'react-redux'
import useMobile from '../hooks/useMobile'
import Search from './Search'
import UserMenu from './UserMenu'
import StoreCartDrawer from './StoreCartDrawer'
import { useStoreCatalog } from '../provider/StoreCatalogProvider'

const Header = () => {
  const [isMobile] = useMobile()
  const location = useLocation()
  const isSearchPage = location.pathname === '/search'
  const navigate = useNavigate()
  const user = useSelector(state => state?.user)
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const [openCartSection, setOpenCartSection] = useState(false)
  const { total, totalQty } = useStoreCatalog()
  const redirectToLoginPage = () => navigate('/login')
  const handleMobileUser = () => user?._id ? navigate('/user') : navigate('/login')

  return (
    <header className="sticky top-0 z-40 flex min-h-[74px] flex-col justify-center gap-1 bg-white shadow-sm">
      {!(isSearchPage && isMobile) && <div className="container mx-auto flex items-center justify-between gap-2 px-3 py-2 sm:px-4">
        <Link to="/" aria-label="IN MINI MART home" className="flex shrink-0 items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#174a35] text-[#f6c945] sm:h-11 sm:w-11"><FaBasketShopping size={21} /></span>
          <span className="leading-none"><span className="block text-[15px] font-extrabold tracking-tight text-[#174a35] sm:text-[20px]">IN MINI MART</span><span className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.18em] text-[#788279] sm:block">Your neighborhood store</span></span>
        </Link>
        <div className="hidden flex-1 justify-center px-5 lg:flex"><Search /></div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={() => setOpenCartSection(true)} className="relative inline-flex items-center gap-2 rounded-xl bg-[#174a35] px-3 py-2 text-white transition hover:bg-[#236041]" aria-label={`Open basket, ${totalQty} items`}><FaBasketShopping size={20} /><span className="hidden text-left text-xs font-bold sm:block">{totalQty ? `${totalQty} items · ₹${total}` : 'Basket'}</span>{totalQty > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#f6c945] px-1 text-[9px] font-extrabold text-[#174a35]">{totalQty}</span>}</button>
          <button className="text-neutral-600 lg:hidden" onClick={handleMobileUser} aria-label="Account"><FaRegCircleUser size={25} /></button>
          <div className="relative hidden lg:block">{user?._id ? <><button onClick={() => setOpenUserMenu(previous => !previous)} className="flex select-none items-center gap-1"><span>Account</span>{openUserMenu ? <GoTriangleUp size={22} /> : <GoTriangleDown size={22} />}</button>{openUserMenu && <div className="absolute right-0 top-12"><div className="min-w-52 rounded bg-white p-4 shadow-lg"><UserMenu close={() => setOpenUserMenu(false)} /></div></div>}</> : <button onClick={redirectToLoginPage} className="px-2 text-base">Login</button>}</div>
        </div>
      </div>}
      <div className="container mx-auto px-3 pb-2 lg:hidden"><Search /></div>
      {openCartSection && <StoreCartDrawer close={() => setOpenCartSection(false)} />}
    </header>
  )
}

export default Header
