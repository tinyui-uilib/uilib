'use client';

import * as React from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';
import {
  switchRootRecipe,
  switchThumbRecipe,
  switchWrapperClass,
  switchLabelClass,
  type SwitchSize,
} from './Switch.css';
import { vars } from '@uilib/tokens';

export type { SwitchSize };

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadixSwitch.Root>, 'children'> {
  size?:    SwitchSize;
  /** Label rendered next to the switch */
  label?:   string;
  /** Description below the label */
  description?: string;
}

export const Switch = React.forwardRef<
  React.ElementRef<typeof RadixSwitch.Root>,
  SwitchProps
>(function Switch({ size = 'md', label, description, className, id, ...props }, ref) {
  const generatedId = React.useId();
  const switchId    = id ?? generatedId;
  const descId      = `${switchId}-desc`;

  const root = (
    <RadixSwitch.Root
      ref={ref}
      id={switchId}
      aria-describedby={description != null ? descId : undefined}
      className={[switchRootRecipe({ size }), className].filter(Boolean).join(' ')}
      {...props}
    >
      <RadixSwitch.Thumb className={switchThumbRecipe({ size })} />
    </RadixSwitch.Root>
  );

  if (label == null && description == null) return root;

  return (
    <div className={switchWrapperClass}>
      {root}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {label != null && (
          <label className={switchLabelClass} htmlFor={switchId}>
            {label}
          </label>
        )}
        {description != null && (
          <p
            id={descId}
            style={{
              margin:     0,
              fontSize:   vars.typography.fontSize.xs,
              color:      vars.color.text.secondary,
              fontFamily: vars.typography.fontFamily.sans,
            }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
});

Switch.displayName = 'Switch';