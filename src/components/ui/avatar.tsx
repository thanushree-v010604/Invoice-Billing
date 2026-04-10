import React from 'react';
import { twMerge } from 'tailwind-merge';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Avatar({ className, ...props }: AvatarProps) {
  return <div className={twMerge('inline-flex overflow-hidden rounded-full bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white', className)} {...props} />;
}

export function AvatarImage({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img className={twMerge('h-full w-full object-cover', className)} {...props} />;
}

export function AvatarFallback({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={twMerge('flex h-full w-full items-center justify-center bg-slate-200 text-sm font-semibold text-slate-800 dark:bg-slate-700 dark:text-slate-100', className)} {...props} />;
}
