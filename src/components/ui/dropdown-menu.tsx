import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface DropdownContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  close: () => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const value = {
    open,
    setOpen,
    close: () => setOpen(false),
  };

  return (
    <DropdownContext.Provider value={value}>
      <div ref={ref} className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({
  render,
  children,
}: {
  render?: React.ReactElement;
  children?: React.ReactNode;
}) {
  const context = useContext(DropdownContext);
  if (!context) return null;

  const handleClick = () => context.setOpen(!context.open);

  if (render && React.isValidElement(render)) {
    return React.cloneElement(render, {
      onClick: (event: React.MouseEvent) => {
        render.props.onClick?.(event);
        handleClick();
      },
    });
  }

  return (
    <button type="button" onClick={handleClick} className="inline-flex">
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  className,
  align,
  children,
}: {
  className?: string;
  align?: 'start' | 'end';
  children: React.ReactNode;
}) {
  const context = useContext(DropdownContext);
  if (!context || !context.open) return null;

  return (
    <div
      className={twMerge(
        'absolute z-50 mt-2 min-w-[220px] rounded-3xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950 dark:shadow-slate-950/40',
        align === 'end' ? 'right-0' : 'left-0',
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuGroup({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={twMerge('space-y-2 px-1', className)}>{children}</div>;
}

export function DropdownMenuLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={twMerge('px-3 py-2 text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400', className)} {...props} />;
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={twMerge('my-2 h-px bg-slate-200 dark:bg-slate-800', className)} />;
}

export function DropdownMenuItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const context = useContext(DropdownContext);
  return (
    <div
      className={twMerge(
        'flex cursor-pointer select-none items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-900',
        className
      )}
      onClick={(event) => {
        context?.close();
        props.onClick?.(event as any);
      }}
      {...props}
    />
  );
}
