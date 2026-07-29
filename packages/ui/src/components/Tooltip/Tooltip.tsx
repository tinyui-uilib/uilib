'use client';

import * as React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { tooltipContentClass, tooltipArrowClass } from './Tooltip.css';

// ─── Provider ─────────────────────────────────────────────────────────────────
// Wrap your app root once. Controls the global delay before tooltips appear.

export interface TooltipProviderProps {
  children:    React.ReactNode;
  /** Delay before tooltip appears. Default: 400ms */
  delayDuration?: number;
  /** Delay before tooltip disappears on pointer leave. Default: 300ms */
  skipDelayDuration?: number;
}

export function TooltipProvider({
  children,
  delayDuration     = 400,
  skipDelayDuration = 300,
}: TooltipProviderProps) {
  return (
    <RadixTooltip.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
    >
      {children}
    </RadixTooltip.Provider>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

export type TooltipSide  = 'top' | 'right' | 'bottom' | 'left';
export type TooltipAlign = 'start' | 'center' | 'end';

export interface TooltipProps {
  /** The element that triggers the tooltip */
  children:    React.ReactNode;
  /** Tooltip text content */
  content:     React.ReactNode;
  side?:       TooltipSide;
  align?:      TooltipAlign;
  /** Gap between trigger and tooltip in px. Default: 6 */
  sideOffset?: number;
  /** Show a small arrow pointing to the trigger. Default: true */
  showArrow?:  boolean;
  /** Controlled open state */
  open?:       boolean;
  onOpenChange?: (open: boolean) => void;
  /** Override the global delay */
  delayDuration?: number;
}

export function Tooltip({
  children,
  content,
  side        = 'top',
  align       = 'center',
  sideOffset  = 6,
  showArrow   = true,
  open,
  onOpenChange,
  delayDuration,
}: TooltipProps) {
  return (
    <RadixTooltip.Root
      {...(open !== undefined ? { open } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange } : {})}
      {...(delayDuration !== undefined ? { delayDuration } : {})}
    >
      {/*
        asChild merges tooltip behaviour onto the child without
        adding an extra DOM element. The child must accept a ref
        and forward it — all our components do via forwardRef.
      */}
      <RadixTooltip.Trigger asChild>
        {children}
      </RadixTooltip.Trigger>

      <RadixTooltip.Portal>
        <RadixTooltip.Content
          className={tooltipContentClass}
          side={side}
          align={align}
          sideOffset={sideOffset}
        >
          {content}
          {showArrow && (
            <RadixTooltip.Arrow className={tooltipArrowClass} />
          )}
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}