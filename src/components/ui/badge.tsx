import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span className={twMerge('inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200', className)} {...props} />
  );
}
