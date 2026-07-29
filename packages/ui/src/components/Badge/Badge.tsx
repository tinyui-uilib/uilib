import * as React from 'react';
import { badgeRecipe, type BadgeVariant, type BadgeIntent, type BadgeSize } from './Badge.css';

export type { BadgeVariant, BadgeIntent, BadgeSize };

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  intent?:  BadgeIntent;
  size?:    BadgeSize;
  /** Icon before the label */
  leftIcon?: React.ReactNode;
  /** Icon after the label */
  rightIcon?: React.ReactNode;
}

export function Badge({
  variant,
  intent,
  size,
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={[badgeRecipe({ variant, intent, size }), className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {leftIcon != null && (
        <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center' }}>
          {leftIcon}
        </span>
      )}
      {children}
      {rightIcon != null && (
        <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center' }}>
          {rightIcon}
        </span>
      )}
    </span>
  );
}

Badge.displayName = 'Badge';