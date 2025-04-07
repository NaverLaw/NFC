import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50',
          {
            'default': 'bg-white text-black shadow hover:bg-white/90',
            'outline': 'border border-white/20 bg-black/50 backdrop-blur-sm text-white shadow-sm hover:bg-white/10',
            'ghost': 'hover:bg-white/10 text-white',
          }[variant],
          {
            'default': 'h-9 px-4 py-2',
            'sm': 'h-8 rounded-full px-3 text-xs',
            'lg': 'h-10 rounded-full px-8',
          }[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };