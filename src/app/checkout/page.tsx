'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { useApp } from '@/context/AppContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, tax, clearCart } = useApp();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseShippingCost = deliveryMethod === 'express' ? 100 : 50;
  const shippingCost =
    (subtotal > 3000 && deliveryMethod === 'standard') || subtotal === 0
      ? 0
      : baseShippingCost;
  const total = subtotal + tax + shippingCost;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const executeOrder = async () => {
    if (cart.length === 0 || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart,
          paymentMethod,
          deliveryMethod,
          totals: {
            subtotal,
            tax,
            shipping: shippingCost,
            total,
          },
          shippingAddress: {
            mode: 'demo',
            firstName: 'Guest',
            lastName: 'Customer',
            address: 'Demo checkout address',
            billingSameAsShipping: sameAsShipping,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Order creation failed');
      }

      const order = (await response.json()) as { orderNumber?: string };
      clearCart();
      router.push(`/checkout/success${order.orderNumber ? `?order=${order.orderNumber}` : ''}`);
    } catch {
      router.push('/checkout/failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      <Navbar />
      <div className="h-32 flex-shrink-0" />

      <main className="flex-1 container mx-auto px-6 max-w-7xl pb-24">
        <header className="mb-12 border-b border-white/10 pb-6">
          <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-500 animate-pulse" />
            SECURE_CHECKOUT_NODE
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            Transaction <span className="text-zinc-600">Protocol</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-4 mb-10 font-mono text-xs uppercase tracking-widest text-zinc-500">
              <span className={step >= 1 ? 'text-cyan-400 font-bold' : ''}>01. Delivery</span>
              <div className={`h-px flex-1 ${step >= 2 ? 'bg-cyan-500' : 'bg-white/10'}`} />
              <span className={step >= 2 ? 'text-cyan-400 font-bold' : ''}>02. Payment</span>
              <div className={`h-px flex-1 ${step >= 3 ? 'bg-cyan-500' : 'bg-white/10'}`} />
              <span className={step >= 3 ? 'text-cyan-400 font-bold' : ''}>03. Review</span>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-widest border-l-4 border-cyan-500 pl-4 mb-6">
                      Shipping Coordinates
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input type="text" className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-4 text-white focus:border-cyan-500 outline-none" placeholder="First Name" />
                      <input type="text" className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-4 text-white focus:border-cyan-500 outline-none" placeholder="Last Name" />
                      <input type="text" className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-4 text-white focus:border-cyan-500 outline-none md:col-span-2" placeholder="Full Address" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-widest border-l-4 border-cyan-500 pl-4 mb-6">
                      Delivery Method
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button type="button" onClick={() => setDeliveryMethod('standard')} className={`text-left cursor-pointer border rounded-xl p-4 transition-all ${deliveryMethod === 'standard' ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 bg-zinc-900/30'}`}>
                        <h4 className="font-bold text-white mb-1">Standard Node</h4>
                        <p className="text-xs text-zinc-500">3-5 Business Days</p>
                        <div className="text-cyan-400 font-mono mt-2">$50.00 (Free over $3000)</div>
                      </button>
                      <button type="button" onClick={() => setDeliveryMethod('express')} className={`text-left cursor-pointer border rounded-xl p-4 transition-all ${deliveryMethod === 'express' ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 bg-zinc-900/30'}`}>
                        <h4 className="font-bold text-white mb-1">Express Override</h4>
                        <p className="text-xs text-zinc-500">1-2 Business Days</p>
                        <div className="text-cyan-400 font-mono mt-2">$100.00</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={sameAsShipping} onChange={(event) => setSameAsShipping(event.target.checked)} className="w-5 h-5 accent-cyan-500 rounded bg-zinc-900 border-white/10" />
                      <span className="text-sm text-zinc-300">Billing address is the same as shipping address</span>
                    </label>

                    {!sameAsShipping && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 p-6 border border-white/10 bg-zinc-900/20 rounded-xl space-y-4">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Billing Coordinates</h3>
                        <input type="text" className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-4 text-white focus:border-cyan-500 outline-none" placeholder="Billing Full Address" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-xl font-bold uppercase tracking-widest border-l-4 border-cyan-500 pl-4 mb-8">
                    Payment Protocol
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button type="button" onClick={() => setPaymentMethod('card')} className={`text-left cursor-pointer border-2 rounded-2xl p-6 transition-all ${paymentMethod === 'card' ? 'border-cyan-500 bg-cyan-500/5' : 'border-white/5 bg-zinc-900/30 hover:border-white/20'}`}>
                      <h3 className="font-bold text-white mb-2">Credit / Debit Card</h3>
                      <p className="text-xs text-zinc-500 font-mono">Demo secure card capture</p>
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('cod')} className={`text-left cursor-pointer border-2 rounded-2xl p-6 transition-all ${paymentMethod === 'cod' ? 'border-cyan-500 bg-cyan-500/5' : 'border-white/5 bg-zinc-900/30 hover:border-white/20'}`}>
                      <h3 className="font-bold text-white mb-2">Cash on Delivery</h3>
                      <p className="text-xs text-zinc-500 font-mono">Pay with cash upon arrival</p>
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-bold uppercase tracking-widest border-l-4 border-cyan-500 pl-4 mb-8">
                    Final Verification
                  </h2>
                  <p className="text-zinc-400 mb-6">Review your cargo before transmission.</p>
                  {cart.length === 0 && (
                    <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      Your cart is empty. Add products before executing an order.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
              {step > 1 ? (
                <button onClick={prevStep} className="text-zinc-400 uppercase text-xs font-bold hover:text-white">
                  Go Back
                </button>
              ) : (
                <div />
              )}
              {step < 3 ? (
                <button onClick={nextStep} className="px-8 py-3 bg-white text-black font-black uppercase text-xs rounded-xl hover:bg-cyan-400 transition-all">
                  Proceed
                </button>
              ) : (
                <button
                  onClick={executeOrder}
                  disabled={cart.length === 0 || isSubmitting}
                  className="px-8 py-3 bg-cyan-500 text-black font-black uppercase text-xs rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-pulse disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Executing...' : 'Execute Order'}
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 sticky top-32 shadow-2xl">
              <h3 className="font-mono text-xs text-zinc-500 tracking-[0.2em] uppercase border-b border-white/5 pb-4 mb-6">
                Order Manifest
              </h3>
              <div className="space-y-4 mb-6 pt-6 border-t border-white/5">
                <div className="flex justify-between font-mono text-sm"><span className="text-zinc-500">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between font-mono text-sm"><span className="text-zinc-500">Shipping</span><span className="text-cyan-400">${shippingCost.toFixed(2)}</span></div>
                <div className="flex justify-between font-mono text-sm"><span className="text-zinc-500">Tax</span><span>${tax.toFixed(2)}</span></div>
              </div>
              <div className="flex justify-between items-end border-t border-white/10 pt-6">
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Final Total</span>
                <span className="text-3xl font-black text-white">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
