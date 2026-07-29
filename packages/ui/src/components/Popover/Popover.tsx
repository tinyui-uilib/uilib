'use client';

import * as React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import {
  popoverContentClass,
  popoverArrowClass,
  popoverHeaderClass,
  popoverTitleClass,
  popoverCloseClass,
} from './Popover.css';

export type PopoverSide  = 'top' | 'right' | 'bottom' | 'left';
export type PopoverAlign = 'start' | 'center' | 'end';

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface PopoverRootProps extends RadixPopover.PopoverProps {}

function PopoverRoot({ children, ...props }: PopoverRootProps) {
  return <RadixPopover.Root {...props}>{children}</RadixPopover.Root>;
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

export interface PopoverTriggerProps
  extends React.ComponentPropsWithoutRef<typeof RadixPopover.Trigger> {}

function PopoverTrigger({ children, ...props }: PopoverTriggerProps) {
  return (
    <RadixPopover.Trigger asChild {...props}>
      {children}
    </RadixPopover.Trigger>
  );
}

// ─── Content ──────────────────────────────────────────────────────────────────

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixPopover.Content> {
  showArrow?: boolean;
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof RadixPopover.Content>,
  PopoverContentProps
>(function PopoverContent(
  { showArrow = false, className, children, sideOffset = 8, ...props },
  ref,
) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        ref={ref}
        sideOffset={sideOffset}
        className={[popoverContentClass, className].filter(Boolean).join(' ')}
        {...props}
      >
        {children}
        {showArrow && <RadixPopover.Arrow className={popoverArrowClass} />}
      </RadixPopover.Content>
    </RadixPopover.Portal>
  );
});

PopoverContent.displayName = 'Popover.Content';

// ─── Header ───────────────────────────────────────────────────────────────────

export interface PopoverHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title:           string;
  showCloseButton?: boolean;
}

function PopoverHeader({
  title,
  showCloseButton = true,
  className,
  ...props
}: PopoverHeaderProps) {
  return (
    <div
      className={[popoverHeaderClass, className].filter(Boolean).join(' ')}
      {...props}
    >
      <p className={popoverTitleClass}>{title}</p>
      {showCloseButton && (
        <RadixPopover.Close className={popoverCloseClass} aria-label="Close">
          <CloseIcon />
        </RadixPopover.Close>
      )}
    </div>
  );
}

// ─── Close ────────────────────────────────────────────────────────────────────

export interface PopoverCloseProps
  extends React.ComponentPropsWithoutRef<typeof RadixPopover.Close> {}

function PopoverClose({ children, ...props }: PopoverCloseProps) {
  return (
    <RadixPopover.Close asChild {...props}>
      {children}
    </RadixPopover.Close>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Compound export ──────────────────────────────────────────────────────────

export const Popover = {
  Root:    PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Header:  PopoverHeader,
  Close:   PopoverClose,
};