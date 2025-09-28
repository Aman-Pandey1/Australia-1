import * as React from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'default' | 'outline' | 'ghost';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

function classesFor(variant: ButtonVariant, size: ButtonSize) {
  const base = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50';
  const variants: Record<ButtonVariant, string> = {
    default: 'bg-black text-white hover:bg-black/90',
    outline: 'border border-input bg-transparent hover:bg-gray-50',
    ghost: 'hover:bg-gray-100',
  };
  const sizes: Record<ButtonSize, string> = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 rounded-md px-3',
    lg: 'h-10 rounded-md px-8',
    icon: 'h-9 w-9',
  };
  return cn(base, variants[variant], sizes[size]);
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return <button ref={ref} className={cn(classesFor(variant, size), className)} {...props} />;
  }
);
Button.displayName = 'Button';