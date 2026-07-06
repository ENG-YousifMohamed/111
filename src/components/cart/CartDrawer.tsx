'use client';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal, shipping, tax, total, applyCoupon, discount } = useApp();
  const [couponInput, setCouponInput] = useState('');

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* غطاء الخلفية الشفاف الفخم */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[999]"
          />

          {/* لوحة العربة الزجاجية المنسدلة */}
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-zinc-950/95 backdrop-blur-2xl border-l border-white/5 z-[1000] flex flex-col shadow-2xl text-white"
          >
            {/* الهيدر الأنيق الهادئ */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
              <div>
                <h3 className="text-lg font-black uppercase tracking-widest">Your Cart</h3>
                <p className="text-xs text-zinc-500 uppercase mt-0.5 tracking-wider">{cart.length} Premium items</p>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors">&times;</button>
            </div>

            {/* قائمة المنتجات الفخمة */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                  <svg className="w-12 h-12 mb-4 text-zinc-800" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                  <p className="text-sm uppercase tracking-widest font-medium">Cart is pristine & empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-5 bg-zinc-900/20 p-4 rounded-2xl border border-white/5 items-center transition-all hover:bg-zinc-900/40">
                    <img src={item.product.image} alt={item.product.title} className="w-16 h-16 object-cover rounded-xl bg-zinc-950 border border-white/5 shadow-md" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate text-zinc-100">{item.product.title}</h4>
                      <p className="text-cyan-400 font-black text-xs mt-1">{item.product.price}</p>
                      
                      {/* وحدة التحكم المصغرة بالكمية */}
                      <div className="flex items-center gap-3 mt-3 w-max bg-zinc-950 px-3 py-1 rounded-full border border-white/5">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="text-zinc-500 hover:text-white text-xs transition-colors">&minus;</button>
                        <span className="text-xs font-black px-1 min-w-[12px] text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="text-zinc-500 hover:text-white text-xs transition-colors">+</button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-950 border border-white/5 text-zinc-500 hover:text-red-400 hover:border-red-400/20 text-xs transition-all">
                      &times;
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* منطقة الحسابات الفاخرة (Summary & Voucher) */}
            {cart.length > 0 && (
              <div className="p-8 border-t border-white/5 bg-black/40 space-y-6">
                
                {/* كود القسيمة الأنيق جداً */}
                <div className="flex bg-zinc-950 border border-white/5 rounded-full p-1 focus-within:border-cyan-500/50 transition-colors">
                  <input 
                    type="text" placeholder="PROMO CODE" value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-transparent px-5 text-xs focus:outline-none placeholder:text-zinc-700 font-bold uppercase tracking-wider"
                  />
                  <button onClick={() => applyCoupon(couponInput)} className="bg-white text-zinc-950 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 hover:text-zinc-950 transition-colors">Apply</button>
                </div>

                {/* تفاصيل الفاتورة النظيفة */}
                <div className="space-y-2.5 text-xs text-zinc-400 tracking-wide font-medium">
                  <div className="flex justify-between"><span>SUBTOTAL</span><span className="text-white font-bold">${subtotal.toFixed(2)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-green-400"><span>DISCOUNT (30%)</span><span>-${(subtotal * discount).toFixed(2)}</span></div>}
                  <div className="flex justify-between"><span>ESTIMATED TAX (14%)</span><span className="text-white font-bold">${tax.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>SHIPPING</span><span className="text-white font-bold">{shipping === 0 ? 'COMPLIMENTARY' : `$${shipping}`}</span></div>
                  <div className="flex justify-between text-base font-black text-white border-t border-white/5 pt-4 mt-2"><span>TOTAL PRICE</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">${total.toFixed(2)}</span></div>
                </div>

                {/* زر تأكيد الطلب والدفع المتوهج */}
                <Link href="/checkout" onClick={() => setIsCartOpen(false)} className="flex w-full items-center justify-center py-4.5 bg-cyan-500 text-zinc-950 font-black uppercase tracking-widest rounded-full text-xs hover:bg-cyan-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] transition-all transform hover:-translate-y-0.5">
                  Proceed To Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
