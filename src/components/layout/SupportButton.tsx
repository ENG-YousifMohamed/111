'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function SupportButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="fixed bottom-8 right-8 z-50 flex items-center justify-end"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', delay: 1 }}
    >
      <motion.button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-zinc-950 p-4 rounded-full shadow-[0_10px_30px_rgba(245,158,11,0.3)] hover:shadow-[0_10px_40px_rgba(245,158,11,0.5)] transition-shadow"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        {isHovered && (
          <motion.span 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            className="font-bold whitespace-nowrap overflow-hidden pr-2"
          >
            تحدث معنا
          </motion.span>
        )}
      </motion.button>
    </motion.div>
  );
}