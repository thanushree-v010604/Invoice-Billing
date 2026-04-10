import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Card({ className, ...props }: CardProps) {
  return (
    <div className={twMerge('rounded-3xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80', className)} {...props} />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={twMerge('space-y-2 p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: CardProps) {
  return <h2 className={twMerge('text-xl font-semibold text-slate-900 dark:text-white', className)} {...props} />;
}

export function CardDescription({ className, ...props }: CardProps) {
  return <p className={twMerge('text-sm text-slate-500 dark:text-slate-400', className)} {...props} />;
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={twMerge('p-6', className)} {...props} />;
}

export function CardFooter({ className, ...props }: CardProps) {
  return <div className={twMerge('flex items-center justify-end p-6', className)} {...props} />;
}
