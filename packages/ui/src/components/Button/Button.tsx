'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { buttonRecipe, spinnerClass, iconClass } from './Button.css';

// ─── Variant types defined explicitly ────────────────────────────────────────
// We do NOT derive these from RecipeVariants<typeof buttonRecipe>.
// RecipeVariants can resolve to VariantShape | undefined depending on
// the @vanilla-extract/recipes version — Omit<T | undefined, K> drops
// all variant keys silently. Explicit types are the safer pattern.

export type ButtonIntent = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'link';
export type ButtonSize   = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Merges button props and className onto the child element via Radix Slot.
   * Use when you need a link that looks like a button:
   *   <Button asChild><a href="/signup">Sign up</a></Button>
   */
  asChild?:   boolean;
  intent?:    ButtonIntent;
  size?:      ButtonSize;
  iconOnly?:  boolean;
  loading?:   boolean;
  fullWidth?: boolean;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      asChild    = false,
      intent,
      size,
      iconOnly,
      fullWidth  = false,
      loading    = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      type       = 'button',
      ...props
    },
    ref,
  ) {
    const Comp       = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        className={[
          buttonRecipe({ intent, size, iconOnly, fullWidth, loading }),
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {loading ? (
          <>
            <span className={spinnerClass} aria-hidden="true" />
            <span
              style={{
                position:    'absolute',
                width:       '1px',
                height:      '1px',
                padding:     '0',
                margin:      '-1px',
                overflow:    'hidden',
                clip:        'rect(0,0,0,0)',
                whiteSpace:  'nowrap',
                borderWidth: '0',
              }}
            >
              {children}
            </span>
          </>
        ) : (
          <>
            {leftIcon != null && (
              <span className={iconClass} aria-hidden="true">
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon != null && (
              <span className={iconClass} aria-hidden="true">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </Comp>
    );
  },
);

Button.displayName = 'Button';