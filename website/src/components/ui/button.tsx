import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] hover:bg-[hsl(var(--color-primary))]/90',
      destructive: 'bg-[hsl(var(--color-destructive))] text-[hsl(var(--color-destructive-foreground))] hover:bg-[hsl(var(--color-destructive))]/90',
      outline: 'border border-[hsl(var(--color-border)] bg-[hsl(var(--color-background))] hover:bg-[hsl(var(--color-accent))] hover:text-[hsl(var(--color-accent-foreground))]',
      secondary: 'bg-[hsl(var(--color-secondary))] text-[hsl(var(--color-secondary-foreground))] hover:bg-[hsl(var(--color-secondary))]/80',
      ghost: 'hover:bg-[hsl(var(--color-accent))] hover:text-[hsl(var(--color-accent-foreground))]',
      link: 'text-[hsl(var(--color-primary))] underline-offset-4 hover:underline',
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    };

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--color-ring))] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
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
