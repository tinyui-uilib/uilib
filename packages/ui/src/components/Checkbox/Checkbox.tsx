'use client';

import * as React from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import {
  checkboxRootRecipe,
  checkboxIndicatorClass,
  checkboxWrapperClass,
  checkboxLabelClass,
  type CheckboxSize,
} from './Checkbox.css';

export type { CheckboxSize };
export type CheckedState = boolean | 'indeterminate';

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadixCheckbox.Root>, 'children'> {
  size?:        CheckboxSize;
  label?:       string;
  description?: string;
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof RadixCheckbox.Root>,
  CheckboxProps
>(function Checkbox({ size = 'md', label, description, className, id, ...props }, ref) {
  const generatedId = React.useId();
  const checkboxId  = id ?? generatedId;
  const descId      = `${checkboxId}-desc`;
  const iconSize    = size === 'sm' ? 10 : size === 'md' ? 12 : 14;

  const root = (
    <RadixCheckbox.Root
      ref={ref}
      id={checkboxId}
      aria-describedby={description != null ? descId : undefined}
      className={[checkboxRootRecipe({ size }), className].filter(Boolean).join(' ')}
      {...props}
    >
      {/*
        Radix.Indicator renders only when checked or indeterminate.
        We render two SVGs — check for checked, dash for indeterminate.
        Radix passes `data-state` to the Indicator; we use that to
        show the correct icon via CSS display.
      */}
      <RadixCheckbox.Indicator className={checkboxIndicatorClass}>
        <CheckIcon size={iconSize} />
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );

  if (label == null && description == null) return root;

  return (
    <div className={checkboxWrapperClass}>
      {root}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {label != null && (
          <label className={checkboxLabelClass} htmlFor={checkboxId}>
            {label}
          </label>
        )}
        {description != null && (
          <p
            id={descId}
            style={{
              margin:     0,
              fontSize:   '0.75rem',
              color:      'var(--color-text-secondary)',
              fontFamily: 'var(--typography-font-family-sans)',
            }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

// ─── Icons ────────────────────────────────────────────────────────────────────
// Radix.Indicator already handles show/hide — we just render the icon.
// The Indicator itself only renders when checked OR indeterminate,
// so we pass the correct icon based on the checked prop.

function CheckIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2 6l3 3 5-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Indeterminate-aware wrapper ──────────────────────────────────────────────
// Convenience component that picks check vs dash automatically.

export interface CheckboxGroupProps {
  label:    string;
  items:    Array<{ id: string; label: string; checked: boolean }>;
  onChange: (id: string, checked: boolean) => void;
}

/**
 * Checkbox group with automatic indeterminate "select all" state.
 * The header checkbox is checked when all are checked,
 * indeterminate when some are checked, unchecked when none are.
 */
export function CheckboxGroup({ label, items, onChange }: CheckboxGroupProps) {
  const allChecked  = items.every((i) => i.checked);
  const someChecked = items.some((i) => i.checked);
  const headerState: CheckedState = allChecked
    ? true
    : someChecked
    ? 'indeterminate'
    : false;

  function handleHeaderChange(checked: CheckedState) {
    const value = checked === 'indeterminate' ? true : !!checked;
    items.forEach((item) => onChange(item.id, value));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Header — indeterminate when some but not all are checked */}
      <Checkbox
        checked={headerState}
        onCheckedChange={handleHeaderChange}
        label={label}
      />
      <div style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((item) => (
          <Checkbox
            key={item.id}
            checked={item.checked}
            onCheckedChange={(c) => onChange(item.id, !!c)}
            label={item.label}
          />
        ))}
      </div>
    </div>
  );
}