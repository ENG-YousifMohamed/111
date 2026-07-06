export default function TrustFeatures() {
  const features = [
    { title: 'دعم فني 24/7', desc: 'نحن هنا لمساعدتك دائماً', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
    { title: 'جودة استثنائية', desc: 'خامات مختارة بعناية فائقة', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    { title: 'شحن سريع ومجاني', desc: 'لجميع الطلبات فوق $200', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
  ];

  return (
    <section className="py-20 bg-zinc-950 border-t border-white/5" dir="rtl">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-white/5">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center pt-8 md:pt-0 px-6 group">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mb-6 text-amber-500 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition-all duration-300">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d={f.icon}></path></svg>
              </div>
              <h3 className="text-lg font-bold text-zinc-100 mb-2">{f.title}</h3>
              <p className="text-zinc-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}