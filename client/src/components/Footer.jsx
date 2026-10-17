import React from 'react'
import { FaBasketShopping, FaLocationDot, FaStar } from 'react-icons/fa6'

const Footer = () => (
  <footer className="border-t border-[#e9e8df] bg-[#174a35] text-white">
    <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f6c945] text-[#174a35]"><FaBasketShopping size={19} /></span>
        <div><p className="font-extrabold tracking-tight">IN MINI MART</p><p className="mt-0.5 text-xs text-white/65">Your neighborhood store in Kakarlapahad</p></div>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/75">
        <span className="inline-flex items-center gap-2"><FaLocationDot className="text-[#f6c945]" /> Nawabpet Rd, Kakarlapahad</span>
        <span className="inline-flex items-center gap-2"><FaStar className="text-[#f6c945]" /> 4.1 · 31 reviews</span>
        <span>© {new Date().getFullYear()} IN MINI MART</span>
      </div>
    </div>
  </footer>
)

export default Footer
