'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  icon,
  fullWidth = false
}: ButtonProps) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium
    rounded-xl transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/25 focus:ring-blue-500/50',
    secondary: 'bg-white/10 text-white hover:bg-white/20 focus:ring-white/50 border border-white/20',
    outline: 'border border-white/30 text-white bg-transparent hover:bg-white/10 focus:ring-white/50'
  };

  const hoverVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 }
  };

  return (
    <motion.button
      variants={hoverVariants}
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};