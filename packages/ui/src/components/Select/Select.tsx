'use client';

import * as React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import {
  selectTriggerRecipe,
  selectIconClass,
  selectContentClass,
  selectViewportClass,
  selectItemClass,
  selectItemIndicatorClass,
  selectLabelClass,
  selectSeparatorClass,
  type SelectSize,
} from './Select.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type { SelectSize };

// ─── Context ──────────────────────────────────────────────────────────────────
// Size and invalid state cascade from Root → Trigger.
// Consumer sets it once on Root, Trigger reads it automatically.
// Same pattern as Input.

interface SelectContextValue {
  size:    SelectSize;
  invalid: boolean;
}

const SelectContext = React.createContext<SelectContextValue>({
  size:    'md',
  invalid: false,
});

// ─── Root ─────────────────────────────────────────────────────────────────────
// Thin wrapper around Radix Root + context provider.
// All Radix Root props (value, onValueChange, disabled, etc.) pass through.

export interface SelectRootProps
  extends RadixSelect.SelectProps {
  size?:    SelectSize;
  invalid?: boolean;
}

function SelectRoot({
  size    = 'md',
  invalid = false,
  children,
  ...props
}: SelectRootProps) {
  const value = React.useMemo(
    () => ({ size, invalid }),
    [size, invalid],
  );

  return (
    <SelectContext.Provider value={value}>
      <RadixSelect.Root {...props}>
        {children}
      </RadixSelect.Root>
    </SelectContext.Provider>
  );
}

// ─── Trigger ──────────────────────────────────────────────────────────────────
// The visible button. Reads size + invalid from context.
// Radix handles: keyboard open/close, aria-expanded, aria-haspopup.

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof RadixSelect.Trigger> {
  /** Accessible label shown before any value is selected */
  placeholder?: string;
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof RadixSelect.Trigger>,
  SelectTriggerProps
>(function SelectTrigger({ placeholder, className, children, ...props }, ref) {
  const { size, invalid } = React.useContext(SelectContext);

  return (
    <RadixSelect.Trigger
      ref={ref}
      className={[
        selectTriggerRecipe({ size, invalid }),
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {/* Value displays selected option — placeholder shows when empty */}
      <RadixSelect.Value placeholder={placeholder} />

      {/* Icon slot — chevron SVG, rotates via CSS on data-state="open" */}
      <RadixSelect.Icon className={selectIconClass}>
        <ChevronDown />
      </RadixSelect.Icon>
    </RadixSelect.Trigger>
  );
});

SelectTrigger.displayName = 'Select.Trigger';

// ─── Content ──────────────────────────────────────────────────────────────────
// Always rendered inside a Portal so it escapes overflow:hidden parents.
// position="popper" tells Radix to use floating positioning (like a tooltip).
// sideOffset=4 adds a small gap between trigger and dropdown.

export interface SelectContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixSelect.Content> {}

const SelectContent = React.forwardRef<
  React.ElementRef<typeof RadixSelect.Content>,
  SelectContentProps
>(function SelectContent({ className, children, ...props }, ref) {
  return (
    <RadixSelect.Portal>
      <RadixSelect.Content
        ref={ref}
        position="popper"
        sideOffset={4}
        className={[selectContentClass, className].filter(Boolean).join(' ')}
        {...props}
      >
        <RadixSelect.Viewport className={selectViewportClass}>
          {children}
        </RadixSelect.Viewport>
      </RadixSelect.Content>
    </RadixSelect.Portal>
  );
});

SelectContent.displayName = 'Select.Content';

// ─── Item ─────────────────────────────────────────────────────────────────────
// One option. Radix handles:
//   - aria-selected
//   - data-highlighted (hover + keyboard focus unified)
//   - data-disabled
//   - data-state="checked" when this item is the current value

export interface SelectItemProps
  extends React.ComponentPropsWithoutRef<typeof RadixSelect.Item> {}

const SelectItem = React.forwardRef<
  React.ElementRef<typeof RadixSelect.Item>,
  SelectItemProps
>(function SelectItem({ className, children, ...props }, ref) {
  return (
    <RadixSelect.Item
      ref={ref}
      className={[selectItemClass, className].filter(Boolean).join(' ')}
      {...props}
    >
      {/* ItemIndicator only renders when this item is selected */}
      <RadixSelect.ItemIndicator className={selectItemIndicatorClass}>
        <CheckIcon />
      </RadixSelect.ItemIndicator>

      {/* ItemText is what Radix reads for the trigger's displayed value */}
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  );
});

SelectItem.displayName = 'Select.Item';

// ─── Group ────────────────────────────────────────────────────────────────────
// Semantic grouping of related items.
// Radix adds role="group" and wires aria-labelledby to the Label.

export interface SelectGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadixSelect.Group> {}

function SelectGroup({ children, ...props }: SelectGroupProps) {
  return (
    <RadixSelect.Group {...props}>
      {children}
    </RadixSelect.Group>
  );
}

// ─── Label ────────────────────────────────────────────────────────────────────
// Group header. Radix wires this to the Group via aria-labelledby.
// Not interactive — screen readers announce it when entering the group.

export interface SelectLabelProps
  extends React.ComponentPropsWithoutRef<typeof RadixSelect.Label> {}

function SelectLabel({ className, children, ...props }: SelectLabelProps) {
  return (
    <RadixSelect.Label
      className={[selectLabelClass, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </RadixSelect.Label>
  );
}

// ─── Separator ────────────────────────────────────────────────────────────────
// Visual divider between groups. Radix adds role="separator".

export interface SelectSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof RadixSelect.Separator> {}

function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return (
    <RadixSelect.Separator
      className={[selectSeparatorClass, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}

// ─── Inline SVG icons ─────────────────────────────────────────────────────────
// Kept local — no icon library dependency.
// aria-hidden on both — they're decorative, the trigger has its own label.

function ChevronDown() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 7l3.5 3.5 5.5-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Compound export ──────────────────────────────────────────────────────────

export const Select = {
  Root:      SelectRoot,
  Trigger:   SelectTrigger,
  Content:   SelectContent,
  Item:      SelectItem,
  Group:     SelectGroup,
  Label:     SelectLabel,
  Separator: SelectSeparator,
};