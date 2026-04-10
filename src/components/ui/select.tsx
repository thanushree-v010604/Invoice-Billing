import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface SelectContextValue {
  value: string | number | undefined;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectContext = createContext<SelectContextValue | null>(null);

export function Select({
  value,
  onValueChange,
  children,
  className,
}: {
  value?: string | number;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const contextValue = useMemo(
    () => ({ value, onValueChange, open, setOpen }),
    [value, onValueChange, open, setOpen]
  );

  return (
    <SelectContext.Provider value={contextValue}>
      <div className={twMerge('relative inline-block', className)}>{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className, children }: { className?: string; children: React.ReactNode }) {
  const context = useContext(SelectContext);
  if (!context) return null;

  return (
    <div
      className={twMerge('cursor-pointer', className)}
      onClick={() => context.setOpen(!context.open)}
    >
      {children}
    </div>
  );
}

export function SelectValue({ className }: { className?: string }) {
  const context = useContext(SelectContext);
  return (
    <span className={twMerge('text-sm text-slate-900 dark:text-slate-100', className)}>
      {context?.value ?? ''}
    </span>
  );
}

export function SelectContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const context = useContext(SelectContext);
  if (!context || !context.open) return null;

  return (
    <div className={twMerge('absolute z-40 mt-2 min-w-full rounded-3xl border border-slate-200 bg-white py-2 shadow-lg dark:border-slate-800 dark:bg-slate-950', className)}>
      {children}
    </div>
  );
}

export function SelectItem({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const context = useContext(SelectContext);
  if (!context) return null;

  return (
    <div
      className={twMerge('cursor-pointer px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900', className)}
      onClick={() => {
        context.onValueChange?.(value);
        context.setOpen(false);
      }}
    >
      {children}
    </div>
  );
}
