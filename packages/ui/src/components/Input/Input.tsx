'use client';

import * as React from 'react';
import {
  inputRootClass,
  inputLabelClass,
  inputWrapperClass,
  inputAdornmentLeftClass,
  inputAdornmentRightClass,
  inputFieldRecipe,
  inputHelperClass,
  inputErrorClass,
} from './Input.css';

// ─── Size type ────────────────────────────────────────────────────────────────

export type InputSize = 'sm' | 'md' | 'lg';

// ─── Context ──────────────────────────────────────────────────────────────────
// Shared between all compound parts. Root generates IDs once,
// children read them. No prop-drilling, no manual ID management.

interface InputContextValue {
  /** id on the <input> element — what <label htmlFor> points to */
  fieldId:  string;
  /** id on the helper text element */
  helperId: string;
  /** id on the error element */
  errorId:  string;
  /** mirrors Root's invalid prop — Field uses it for aria-invalid */
  invalid:  boolean;
  /** mirrors Root's disabled prop */
  disabled: boolean;
  /** mirrors Root's required prop */
  required: boolean;
  /** size cascades to Field so consumers don't repeat it */
  size:     InputSize;
}

const InputContext = React.createContext<InputContextValue | null>(null);

function useInputContext(part: string): InputContextValue {
  const ctx = React.useContext(InputContext);
  if (ctx === null) {
    throw new Error(
      `<Input.${part}> must be rendered inside <Input.Root>`,
    );
  }
  return ctx;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface InputRootProps {
  children:  React.ReactNode;
  /** Puts input into error state — changes border, focus ring, aria-invalid */
  invalid?:  boolean;
  disabled?: boolean;
  required?: boolean;
  size?:     InputSize;
  className?: string;
}

function InputRoot({
  children,
  invalid  = false,
  disabled = false,
  required = false,
  size     = 'md',
  className,
}: InputRootProps) {
  // React.useId() generates a stable, SSR-safe unique ID.
  // The same component renders the same ID on server and client —
  // no hydration mismatch, no Math.random() hack.
  const baseId  = React.useId();
  const fieldId  = `${baseId}-field`;
  const helperId = `${baseId}-helper`;
  const errorId  = `${baseId}-error`;

  const value = React.useMemo<InputContextValue>(
    () => ({ fieldId, helperId, errorId, invalid, disabled, required, size }),
    [fieldId, helperId, errorId, invalid, disabled, required, size],
  );

  return (
    <InputContext.Provider value={value}>
      <div
        className={[inputRootClass, className].filter(Boolean).join(' ')}
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
      >
        {children}
      </div>
    </InputContext.Provider>
  );
}

// ─── Label ────────────────────────────────────────────────────────────────────

export interface InputLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

function InputLabel({ children, className, ...props }: InputLabelProps) {
  const { fieldId, required, disabled } = useInputContext('Label');

  return (
    <label
      // data-required drives the CSS ::after asterisk — no extra element
      data-required={required || undefined}
      data-disabled={disabled || undefined}
      className={[inputLabelClass, className].filter(Boolean).join(' ')}
      // htmlFor wires the label to the input for click-to-focus + AT
      {...props}
      htmlFor={fieldId}
    >
      {children}
    </label>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

export interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField(
    { leftIcon, rightIcon, className, ...props },
    ref,
  ) {
    const {
      fieldId,
      helperId,
      errorId,
      invalid,
      disabled,
      required,
      size,
    } = useInputContext('Field');

    const hasLeftIcon  = leftIcon  != null;
    const hasRightIcon = rightIcon != null;

    return (
      <div className={inputWrapperClass}>
        {hasLeftIcon && (
          <span className={inputAdornmentLeftClass} aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={fieldId}
          // aria-describedby links to BOTH helper and error.
          // Screen readers announce both when the field is focused.
          // Pointing to an empty element is harmless — AT ignores it.
          aria-describedby={`${helperId} ${errorId}`}
          // aria-invalid must be on the input itself — a red border
          // alone communicates nothing to screen readers
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          disabled={disabled}
          className={[
            inputFieldRecipe({ size, invalid, hasLeftIcon, hasRightIcon }),
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />

        {hasRightIcon && (
          <span className={inputAdornmentRightClass} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>
    );
  },
);

InputField.displayName = 'Input.Field';

// ─── Helper ───────────────────────────────────────────────────────────────────

export interface InputHelperProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

function InputHelper({ children, className, ...props }: InputHelperProps) {
  const { helperId, invalid } = useInputContext('Helper');

  // Hidden when invalid — error takes over the messaging role
  if (invalid || children == null) return null;

  return (
    <p
      id={helperId}
      className={[inputHelperClass, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </p>
  );
}

// ─── Error ────────────────────────────────────────────────────────────────────

export interface InputErrorProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

function InputError({ children, className, ...props }: InputErrorProps) {
  const { errorId, invalid } = useInputContext('Error');

  // Only renders when both invalid=true AND there's error content
  if (!invalid || children == null) return null;

  return (
    <p
      id={errorId}
      // role="alert" — screen readers announce this immediately when it
      // appears, without waiting for focus to move to it
      role="alert"
      aria-live="polite"
      className={[inputErrorClass, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </p>
  );
}

// ─── Compound export ──────────────────────────────────────────────────────────
// Single named export with dot notation — no barrel of named exports.
// Consumers import { Input } and get all parts co-located.

export const Input = {
  Root:   InputRoot,
  Label:  InputLabel,
  Field:  InputField,
  Helper: InputHelper,
  Error:  InputError,
};