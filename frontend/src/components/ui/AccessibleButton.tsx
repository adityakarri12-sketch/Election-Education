'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

/**
 * Expert-Grade Accessible Button Component
 * - WCAG 2.1 Compliant
 * - Explicit ARIA Labels
 * - Focus Visibility Enforced
 * - Keyboard Navigation Support (Native)
 */
export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  label,
  variant = 'primary',
  isLoading = false,
  className,
  children,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/40',
    secondary: 'bg-white/10 text-white hover:bg-white/20 focus:ring-white/20',
    outline: 'bg-transparent border border-white/20 text-white hover:border-primary/50 focus:ring-primary/20',
  };

  return (
    <button
      aria-label={label}
      aria-busy={isLoading}
      disabled={isLoading || props.disabled}
      className={cn(
        "relative px-6 py-3 rounded-2xl font-bold transition-all outline-none",
        "focus:ring-4 focus:outline-none",
        variants[variant],
        isLoading && "opacity-70 cursor-not-allowed",
        className
      )}
      {...props}
    >
      <span className={cn(isLoading ? "opacity-0" : "opacity-100")}>
        {children || label}
      </span>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
};
