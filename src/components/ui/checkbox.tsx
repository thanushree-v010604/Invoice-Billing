import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={twMerge(
        'peer h-4 w-4 rounded border-slate-300 text-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900',
        className
      )}
      {...props}
    />
  );
}
