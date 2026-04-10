import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'secondary' | 'outline' | 'default';
  size?: 'icon' | 'sm' | 'default';
  className?: string;
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700',
  outline: 'border border-slate-200 text-slate-900 bg-transparent hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800',
  ghost: 'bg-transparent text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800',
};

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  default: 'h-11 px-5',
  sm: 'h-10 px-4',
  icon: 'h-10 w-10 p-0',
};

export function Button({
  variant = 'default',
  size = 'default',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={twMerge(
        'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-60 disabled:pointer-events-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}
