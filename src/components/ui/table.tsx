import React from 'react';
import { twMerge } from 'tailwind-merge';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  className?: string;
}

export function Table({ className, ...props }: TableProps) {
  return <table className={twMerge('min-w-full divide-y divide-slate-200 dark:divide-slate-800', className)} {...props} />;
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={twMerge(className)} {...props} />;
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={twMerge(className)} {...props} />;
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={twMerge('border-b border-slate-200 dark:border-slate-800', className)} {...props} />;
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={twMerge('text-left text-sm font-semibold text-slate-900 dark:text-slate-100', className)} {...props} />;
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={twMerge('text-sm text-slate-700 dark:text-slate-300', className)} {...props} />;
}
