'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  elevated?: boolean;
  onClick?: () => void;
}

export const GlassCard = ({
  children,
  className = '',
  hoverEffect = true,
  elevated = false,
  onClick
}: GlassCardProps) => {
  const hoverVariants = {
    rest: {
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    hover: {
      y: -4,
      scale: 1.01,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={hoverEffect ? hoverVariants : undefined}
      whileHover={hoverEffect ? "hover" : undefined}
      onClick={onClick}
      className={`
        relative rounded-2xl border backdrop-blur-xl overflow-hidden
        bg-gradient-to-br from-white/5 to-white/10
        border-white/20
        ${elevated ? 'shadow-2xl shadow-blue-500/10' : 'shadow-lg'}
        ${hoverEffect ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        boxShadow: elevated
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
};