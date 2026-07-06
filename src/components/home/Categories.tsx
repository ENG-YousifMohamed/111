'use client';
import Link from 'next/link';

const categories = [
  { title: "Pro Laptops", slug: "laptop", items: "24 Models", icon: "💻" },
  { title: "Smartphones", slug: "mobile", items: "19 Models", icon: "📱" },
  { title: "Gaming Gear", slug: "gaming", items: "56 Items", icon: "🎮" },
  { title: "Studio Audio", slug: "audio", items: "14 Items", icon: "🎧" },
  { title: "Wearables", slug: "wearables", items: "12 Models", icon: "⌚" },
];

export default function Categories() {
  return (
    <section className="py-12 bg-zinc-950" dir="ltr">
      <div className="container mx-auto px-6">
        
        {/* الهيدر والكلمة الزرقاء */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-white mb-2">
              Hardware <span className="text-zinc-600">Sectors</span>
            </h2>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
              Browse by technological category
            </p>
          </div>
          
          {/* 🔥 الكلمة الزرقاء اللي بتودي لصفحة كل المنتجات 🔥 */}
          <Link href="/products" className="group flex items-center gap-2 text-[10px] font-bold font-mono text-cyan-500 uppercase tracking-widest border border-cyan-500/30 px-4 py-2 rounded-full hover:bg-cyan-500 hover:text-black transition-all">
            View All Directory
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>

        {/* كروت الأقسام */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat) => (
            // 🔥 الكارت اللي بيودي لصفحة القسم الخاص بيه 🔥
            <Link 
              href={`/category/${cat.slug}`} 
              key={cat.slug}
              className="min-w-[240px] flex-1 bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 hover:border-cyan-500/50 hover:bg-zinc-900 transition-all duration-300 group cursor-pointer"
            >
              <div className="text-4xl mb-4 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                {cat.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                {cat.title}
              </h3>
              <p className="text-xs font-mono text-zinc-600">
                {cat.items}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}