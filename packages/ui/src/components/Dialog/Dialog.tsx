'use client';

import * as React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import {
  dialogOverlayClass,
  dialogContentRecipe,
  dialogHeaderClass,
  dialogBodyClass,
  dialogFooterClass,
  dialogTitleClass,
  dialogDescriptionClass,
  dialogCloseButtonClass,
  visuallyHiddenClass,
  type DialogSize,
} from './Dialog.css';

export type { DialogSize };

// ─── Install ──────────────────────────────────────────────────────────────────
// pnpm --filter @uilib/ui add @radix-ui/react-dialog

// ─── Context ──────────────────────────────────────────────────────────────────
// Size cascades from Root → Content so consumers set it once.

interface DialogContextValue {
  size: DialogSize;
}

const DialogContext = React.createContext<DialogContextValue>({ size: 'md' });

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface DialogRootProps extends RadixDialog.DialogProps {
  size?: DialogSize;
}

function DialogRoot({ size = 'md', children, ...props }: DialogRootProps) {
  const ctx = React.useMemo(() => ({ size }), [size]);

  return (
    <DialogContext.Provider value={ctx}>
      <RadixDialog.Root {...props}>
        {children}
      </RadixDialog.Root>
    </DialogContext.Provider>
  );
}

// ─── Trigger ──────────────────────────────────────────────────────────────────
// Always use asChild — the trigger should be a Button, not a bare div.
// Radix wires aria-haspopup, aria-expanded, and aria-controls automatically.

export interface DialogTriggerProps
  extends React.ComponentPropsWithoutRef<typeof RadixDialog.Trigger> {}

function DialogTrigger({ children, ...props }: DialogTriggerProps) {
  return (
    <RadixDialog.Trigger asChild {...props}>
      {children}
    </RadixDialog.Trigger>
  );
}

// ─── Content ──────────────────────────────────────────────────────────────────
// Always rendered in a Portal.
// Radix adds: role="dialog", aria-modal="true", focus trap, scroll lock.

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixDialog.Content> {
  size?:              DialogSize;
  /** Show the default close button in the header. Default: true */
  showCloseButton?:   boolean;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Content>,
  DialogContentProps
>(function DialogContent(
  { size, showCloseButton = true, className, children, ...props },
  ref,
) {
  const ctx          = React.useContext(DialogContext);
  const resolvedSize = size ?? ctx.size;

  return (
    <RadixDialog.Portal>
      {/* Overlay is inside Portal — renders in document.body */}
      <RadixDialog.Overlay className={dialogOverlayClass} />

      <RadixDialog.Content
        ref={ref}
        className={[
          dialogContentRecipe({ size: resolvedSize }),
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
});

DialogContent.displayName = 'Dialog.Content';

// ─── Header ───────────────────────────────────────────────────────────────────
// Sticky container for title + close button.
// Consumers put Dialog.Title and optionally Dialog.Description here.

export interface DialogHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Show the X close button. Default: true */
  showCloseButton?: boolean;
}

function DialogHeader({
  showCloseButton = true,
  className,
  children,
  ...props
}: DialogHeaderProps) {
  return (
    <div
      className={[dialogHeaderClass, className].filter(Boolean).join(' ')}
      {...props}
    >
      <div style={{ flex: 1 }}>{children}</div>

      {showCloseButton && (
        <RadixDialog.Close
          className={dialogCloseButtonClass}
          aria-label="Close dialog"
        >
          <CloseIcon />
        </RadixDialog.Close>
      )}
    </div>
  );
}

// ─── Body ─────────────────────────────────────────────────────────────────────
// Scrollable content area between header and footer.

export interface DialogBodyProps
  extends React.HTMLAttributes<HTMLDivElement> {}

function DialogBody({ className, children, ...props }: DialogBodyProps) {
  return (
    <div
      className={[dialogBodyClass, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
// Sticky action area at the bottom.

export interface DialogFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

function DialogFooter({ className, children, ...props }: DialogFooterProps) {
  return (
    <div
      className={[dialogFooterClass, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Title ────────────────────────────────────────────────────────────────────
// Required for accessibility — every dialog must have a title.
// Radix wires aria-labelledby from Content → Title automatically.

export interface DialogTitleProps
  extends React.ComponentPropsWithoutRef<typeof RadixDialog.Title> {
  /** Hides the title visually while keeping it accessible to AT */
  srOnly?: boolean;
}

function DialogTitle({ srOnly = false, className, children, ...props }: DialogTitleProps) {
  return (
    <RadixDialog.Title
      className={[
        dialogTitleClass,
        srOnly ? visuallyHiddenClass : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </RadixDialog.Title>
  );
}

// ─── Description ──────────────────────────────────────────────────────────────
// Optional. Radix wires aria-describedby from Content → Description.

export interface DialogDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof RadixDialog.Description> {
  srOnly?: boolean;
}

function DialogDescription({
  srOnly = false,
  className,
  children,
  ...props
}: DialogDescriptionProps) {
  return (
    <RadixDialog.Description
      className={[
        dialogDescriptionClass,
        srOnly ? visuallyHiddenClass : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </RadixDialog.Description>
  );
}

// ─── Close ────────────────────────────────────────────────────────────────────
// Wraps any element to make it close the dialog.
// Use asChild to avoid a wrapping element.

export interface DialogCloseProps
  extends React.ComponentPropsWithoutRef<typeof RadixDialog.Close> {}

function DialogClose({ children, ...props }: DialogCloseProps) {
  return (
    <RadixDialog.Close asChild {...props}>
      {children}
    </RadixDialog.Close>
  );
}

// ─── Simple convenience component ─────────────────────────────────────────────
// Covers 80% of use cases: a trigger, title, description, children, actions.
// Use Dialog.Root + Dialog.Content for full control.

export interface DialogSimpleProps {
  /** The element that opens the dialog — typically a Button */
  trigger:         React.ReactNode;
  title:           string;
  description?:    string;
  /** Hide the title visually (still announced by AT) */
  titleSrOnly?:    boolean;
  size?:           DialogSize;
  children?:       React.ReactNode;
  /** Buttons in the footer — typically Cancel + Confirm */
  actions?:        React.ReactNode;
  /** Controlled open state */
  open?:           boolean;
  onOpenChange?:   (open: boolean) => void;
  /** Show header close button. Default: true */
  showCloseButton?: boolean;
}

function DialogSimple({
  trigger,
  title,
  description,
  titleSrOnly    = false,
  size           = 'md',
  children,
  actions,
  open,
  onOpenChange,
  showCloseButton = true,
}: DialogSimpleProps) {
  return (
    <DialogRoot size={size} {...(open !== undefined && { open })}
      {...(onOpenChange !== undefined && { onOpenChange })}>
      <DialogTrigger>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader showCloseButton={showCloseButton}>
          <DialogTitle srOnly={titleSrOnly}>{title}</DialogTitle>
          {description != null && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        {children != null && (
          <DialogBody>{children}</DialogBody>
        )}

        {actions != null && (
          <DialogFooter>{actions}</DialogFooter>
        )}
      </DialogContent>
    </DialogRoot>
  );
}

// ─── Close icon ───────────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 1l12 12M13 1L1 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Compound export ──────────────────────────────────────────────────────────

export const Dialog = {
  Root:        DialogRoot,
  Trigger:     DialogTrigger,
  Content:     DialogContent,
  Header:      DialogHeader,
  Body:        DialogBody,
  Footer:      DialogFooter,
  Title:       DialogTitle,
  Description: DialogDescription,
  Close:       DialogClose,
  Simple:      DialogSimple,
};