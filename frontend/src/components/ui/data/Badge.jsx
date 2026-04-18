import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { X } from 'lucide-react';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export 

export const Badge: React.FC = ({
  children,
  variant = 'default',
  size = 'md',
  onRemove,
  dot,
  className,
}) => {
  const variants = {
    default:  'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-black/5 dark:border-white/5',
    primary:  'bg-primary-500/15 text-primary-300 border border-primary-500/20',
    success:  'bg-green-500/15 text-green-400 border border-green-500/20',
    warning:  'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
    danger:   'bg-red-500/15 text-red-400 border border-red-500/20',
    info:     'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20',
    outline:  'bg-transparent text-gray-600 dark:text-gray-400 border border-border',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const dotColors = {
    default: 'bg-gray-400',
    primary: 'bg-primary-400',
    success: 'bg-green-400',
    warning: 'bg-yellow-400',
    danger:  'bg-red-400',
    info:    'bg-cyan-400',
    outline: 'bg-gray-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium leading-none',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant])} />
      )}
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:opacity-80 focus:outline-none flex-shrink-0"
          aria-label="Remove"
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      )}
    </span>
  );
};
