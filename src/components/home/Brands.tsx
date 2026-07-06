import React from 'react';

export default function Brands() {
  const brands = ["NIKE", "SUPREME", "STÜSSY", "OFF-WHITE", "PALACE", "BALENCIAGA"];

  return (
    <section className="bg-white py-10 border-b border-black/5 overflow-hidden flex items-center">
      <div className="max-w-[1400px] mx-auto px-6 w-full flex flex-wrap justify-center md:justify-between items-center gap-10 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
        {brands.map((brand, i) => (
          <span key={i} className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-black cursor-pointer hover:opacity-100 transition-opacity">
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
}