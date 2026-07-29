'use client';

import * as React from 'react';
import * as RadixAvatar from '@radix-ui/react-avatar';
import {
  avatarRootRecipe,
  avatarImageClass,
  avatarFallbackClass,
  avatarStatusRecipe,
} from './Avatar.css';

// ─── Context ──────────────────────────────────────────────────────────────────
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type AvatarShape = "circle" | "square";
export type AvatarStatus = "online" | "offline" | "away" | "busy";

interface AvatarContextValue {
  size:  AvatarSize;
  shape: AvatarShape;
}

const AvatarContext = React.createContext<AvatarContextValue>({
  size:  'md',
  shape: 'circle',
});

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface AvatarRootProps
  extends React.ComponentPropsWithoutRef<typeof RadixAvatar.Root> {
  size?:    AvatarSize;
  shape?:   AvatarShape;
  status?:  AvatarStatus | undefined;
}

function AvatarRoot({
  size    = 'md',
  shape   = 'circle',
  status,
  className,
  children,
  ...props
}: AvatarRootProps) {
  const ctx = React.useMemo(() => ({ size, shape }), [size, shape]);

  return (
    <AvatarContext.Provider value={ctx}>
      <RadixAvatar.Root
        className={[avatarRootRecipe({ size, shape }), className]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {children}
        {status != null && (
          <span
            className={avatarStatusRecipe({ status, size })}
            aria-label={status}
            role="img"
          />
        )}
      </RadixAvatar.Root>
    </AvatarContext.Provider>
  );
}

// ─── Image ────────────────────────────────────────────────────────────────────
// Radix hides this automatically when the image fails to load —
// no onError handling needed. The Fallback appears in its place.

export interface AvatarImageProps
  extends React.ComponentPropsWithoutRef<typeof RadixAvatar.Image> {}

function AvatarImage({ className, ...props }: AvatarImageProps) {
  return (
    <RadixAvatar.Image
      className={[avatarImageClass, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}

// ─── Fallback ─────────────────────────────────────────────────────────────────
// delayMs prevents a flash of fallback when the image loads quickly.
// Default 300ms — image loads within that window, fallback never shows.

export interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof RadixAvatar.Fallback> {}

function AvatarFallback({ className, children, ...props }: AvatarFallbackProps) {
  return (
    <RadixAvatar.Fallback
      className={[avatarFallbackClass, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </RadixAvatar.Fallback>
  );
}

// ─── Compound export ──────────────────────────────────────────────────────────

export const AvatarParts = {
  Root:     AvatarRoot,
  Image:    AvatarImage,
  Fallback: AvatarFallback,
};

// ─── Utility ──────────────────────────────────────────────────────────────────

/**
 * Extracts up to 2 initials from a full name.
 * "Pradhumn Sharma" → "PS"
 * "Pradhumn"        → "P"
 */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

// ─── Convenience component ────────────────────────────────────────────────────
// Wraps all three parts. Use this for 90% of cases.
// Use AvatarParts.* directly only when you need custom fallback content.

export interface AvatarProps {
  /** Image URL */
  src?:      string;
  /** Alt text for the image — also used for single-letter fallback */
  alt?:      string;
  /** Full name — drives initials in fallback */
  name?:     string;
  size?:     AvatarSize;
  shape?:    AvatarShape;
  status?:   AvatarStatus;
  className?: string;
  /**
   * Milliseconds to wait before showing fallback.
   * Prevents flash when image loads quickly.
   * Set to 0 when there is no src.
   */
  delayMs?:  number;
}

export function Avatar({
  src,
  alt,
  name,
  size     = 'md',
  shape    = 'circle',
  status,
  className,
  delayMs  = 300,
}: AvatarProps) {
  const initials    = name != null ? getInitials(name) : null;
  const fallback    = initials ?? alt?.[0]?.toUpperCase() ?? '?';
  const resolvedAlt = alt ?? name ?? 'Avatar';

  return (
    <AvatarRoot size={size} shape={shape} status={status} className={className}>
      {src != null && (
        <AvatarImage src={src} alt={resolvedAlt} />
      )}
      <AvatarFallback delayMs={src != null ? delayMs : 0}>
        {fallback}
      </AvatarFallback>
    </AvatarRoot>
  );
}