'use client';

import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface BentoItemProps {
  children: ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'tall' | 'wide' | 'square';
  depth?: 1 | 2 | 3;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const BentoGrid = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}
    >
      {children}
    </div>
  );
};

export const BentoItem = ({
  children,
  className = '',
  size = 'medium',
  depth = 1,
  hoverEffect = true,
  onClick
}: BentoItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: 'md:col-span-1',
    medium: 'md:col-span-1',
    large: 'lg:col-span-2 lg:row-span-1',
    tall: 'lg:row-span-2',
    wide: 'lg:col-span-2',
    square: ''
  };

  const depthClasses = {
    1: 'z-10',
    2: 'z-20',
    3: 'z-30'
  };

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
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={hoverEffect ? hoverVariants : undefined}
      animate={isHovered && hoverEffect ? "hover" : "rest"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`
        relative rounded-2xl border backdrop-blur-xl overflow-hidden
        ${sizeClasses[size]}
        ${depthClasses[depth]}
        ${className}
        bg-gradient-to-br from-white/5 to-white/10
        border-white/20
        cursor-pointer
      `}
      style={{
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10 p-6 h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
};