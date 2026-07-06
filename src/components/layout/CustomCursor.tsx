'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // الماوس هيظهر ويتمدد بس لو العنصر واخد data-cursor="view"
      if (target.closest('[data-cursor="view"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      // هنا خلينا الـ z-[9999] عشان يكون فوق الصورة وفوق أي حاجة في المتصفح
      className="fixed top-0 left-0 w-20 h-20 bg-cyan-500 rounded-full pointer-events-none z-[9999] flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.5)] text-zinc-950 font-black tracking-widest text-xs"
      animate={{
        x: mousePosition.x - 40, // عشان نوسط الدائرة مع السنتر بتاع الماوس الطبيعي
        y: mousePosition.y - 40,
        scale: isHovering ? 1 : 0, // يكبر لما تقف على الصورة ويصغر ويختفي لما تبعد
        opacity: isHovering ? 1 : 0, 
      }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
    >
      VIEW
    </motion.div>
  );
}