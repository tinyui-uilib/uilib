'use client';

import * as React from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import {
  toastViewportClass,
  toastRootRecipe,
  toastContentClass,
  toastTitleClass,
  toastDescriptionClass,
  toastActionsClass,
  toastCloseClass,
  toastActionClass,
  type ToastVariant,
} from './Toast.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type { ToastVariant };

export interface ToastItem {
  id:           string;
  title:        string;
  description?: string;
  variant?:     ToastVariant;
  duration?:    number | undefined;
  action?: {
    label:   string;
    onClick: () => void;
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface ToastContextValue {
  toasts:  ToastItem[];
  show:    (toast: Omit<ToastItem, 'id'>) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface ToastProviderProps {
  children:     React.ReactNode;
  /** Default duration in ms before auto-dismiss. Default: 5000 */
  duration?:    number;
  /** Max toasts visible at once. Oldest dismissed when exceeded. Default: 5 */
  maxToasts?:   number;
  /** Swipe direction to dismiss. Default: right */
  swipeDirection?: RadixToast.ToastProviderProps['swipeDirection'];
}

export function ToastProvider({
  children,
  duration     = 5000,
  maxToasts    = 5,
  swipeDirection = 'right',
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const show = React.useCallback(
    (toast: Omit<ToastItem, 'id'>): string => {
      const id = crypto.randomUUID();

      setToasts((prev) => {
        const next = [...prev, { ...toast, id }];
        // Drop oldest if over limit
        return next.length > maxToasts ? next.slice(next.length - maxToasts) : next;
      });

      return id;
    },
    [maxToasts],
  );

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = React.useMemo<ToastContextValue>(
    () => ({ toasts, show, dismiss }),
    [toasts, show, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      <RadixToast.Provider
        swipeDirection={swipeDirection}
        duration={duration}
      >
        {children}

        {toasts.map((toast) => (
          <ToastRoot
            key={toast.id}
            toast={toast}
            onDismiss={() => dismiss(toast.id)}
          />
        ))}

        <RadixToast.Viewport className={toastViewportClass} />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

// ─── ToastRoot (internal) ─────────────────────────────────────────────────────
// Renders a single toast. Not exported — consumers use useToast().show()

interface ToastRootProps {
  toast:     ToastItem;
  onDismiss: () => void;
}

function ToastRoot({ toast, onDismiss }: ToastRootProps) {
  return (
    <RadixToast.Root
      className={toastRootRecipe({ variant: toast.variant })}
      onOpenChange={(open) => {
        if (!open) onDismiss();
      }}
      {...(toast.duration != null && { duration: toast.duration })}
    >
      <div className={toastContentClass}>
        <RadixToast.Title className={toastTitleClass}>
          {toast.title}
        </RadixToast.Title>

        {toast.description != null && (
          <RadixToast.Description className={toastDescriptionClass}>
            {toast.description}
          </RadixToast.Description>
        )}
      </div>

      <div className={toastActionsClass}>
        {/* Close button — always present */}
        <RadixToast.Close
          className={toastCloseClass}
          aria-label="Dismiss notification"
        >
          <CloseIcon />
        </RadixToast.Close>

        {/* Action button — optional */}
        {toast.action != null && (
          <RadixToast.Action
            className={toastActionClass}
            altText={toast.action.label}
            onClick={toast.action.onClick}
          >
            {toast.action.label}
          </RadixToast.Action>
        )}
      </div>
    </RadixToast.Root>
  );
}

// ─── useToast ─────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (ctx === null) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return ctx;
}

// ─── CloseIcon ────────────────────────────────────────────────────────────────

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