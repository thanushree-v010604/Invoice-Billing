import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold';
  
  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    secondary: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
    destructive: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    outline: 'border border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300'
  };

  return (
    <span className={twMerge(baseClasses, variantClasses[variant], className)} {...props} />
  );
}
