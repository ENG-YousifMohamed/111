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
      // الماوس هيتمدد ويظهر كلمة VIEW "فقط" لو العنصر أو الأب بتاعه بيحتوي على data-cursor="view"
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
    <>
      {/* النقطة المركزية (تختفي عند التمدد) */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-amber-500 rounded-full pointer-events-none z-[100] mix-blend-difference"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />
      {/* الهالة الخارجية المتفاعلة (تظهر كلمة VIEW) */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-amber-500 rounded-full pointer-events-none z-[100] mix-blend-difference flex items-center justify-center"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? "rgba(245, 158, 11, 1)" : "rgba(245, 158, 11, 0)",
          borderWidth: isHovering ? "0px" : "1px"
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
      >
        {isHovering && <span className="text-[10px] text-zinc-950 font-black tracking-widest absolute">VIEW</span>}
      </motion.div>
    </>
  );
}