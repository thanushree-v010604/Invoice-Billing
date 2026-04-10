import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={twMerge('text-sm font-medium text-slate-700 dark:text-slate-300', className)}
      {...props}
    />
  );
}
