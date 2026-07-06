'use client';

import { useEffect, useState } from 'react';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const updateStatus = () => setIsOffline(!navigator.onLine);
    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[9999] -translate-x-1/2 rounded-full border border-amber-500/30 bg-amber-500 px-5 py-3 text-xs font-black uppercase tracking-widest text-zinc-950 shadow-2xl">
      Offline mode
    </div>
  );
}
