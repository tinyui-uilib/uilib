import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarParts, getInitials } from './Avatar';

describe('Avatar', () => {

  // ── getInitials ─────────────────────────────────────────────────────────────

  describe('getInitials', () => {
    it('returns two initials from a full name', () => {
      expect(getInitials('Pradhumn Sharma')).toBe('PS');
    });

    it('returns one initial from a single name', () => {
      expect(getInitials('Pradhumn')).toBe('P');
    });

    it('uses only the first two words', () => {
      expect(getInitials('Pradhumn Kumar Sharma')).toBe('PK');
    });

    it('handles extra whitespace', () => {
      expect(getInitials('  Pradhumn  Sharma  ')).toBe('PS');
    });

    it('uppercases initials', () => {
      expect(getInitials('john doe')).toBe('JD');
    });
  });

  // ── Convenience Avatar ───────────────────────────────────────────────────────

  describe('Avatar (convenience)', () => {
    it('renders fallback initials from name when no src', () => {
      render(<Avatar name="Pradhumn Sharma" />);
      expect(screen.getByText('PS')).toBeInTheDocument();
    });

    it('renders first letter of alt when no name or src', () => {
      render(<Avatar alt="Guest user" />);
      expect(screen.getByText('G')).toBeInTheDocument();
    });

    it('renders ? when no name, alt, or src', () => {
      render(<Avatar />);
      expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('renders status indicator with correct aria-label', () => {
      render(<Avatar name="Test User" status="online" />);
      expect(screen.getByRole('img', { name: 'online' })).toBeInTheDocument();
    });

    it('does not render status indicator when status is undefined', () => {
      render(<Avatar name="Test User" />);
      expect(screen.queryByRole('img', { name: /online|offline|away|busy/ }))
        .not.toBeInTheDocument();
    });
  });

  // ── AvatarParts compound ─────────────────────────────────────────────────────

  describe('AvatarParts (compound)', () => {
    it('renders custom fallback content', () => {
      render(
        <AvatarParts.Root>
          <AvatarParts.Fallback delayMs={0}>
            Custom
          </AvatarParts.Fallback>
        </AvatarParts.Root>,
      );
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('renders image with correct alt text', () => {
      render(
        <AvatarParts.Root>
          <AvatarParts.Image
            src="https://example.com/avatar.jpg"
            alt="Profile photo"
          />
          <AvatarParts.Fallback delayMs={0}>PS</AvatarParts.Fallback>
        </AvatarParts.Root>,
      );
      // Image element exists in DOM
      expect(screen.getByAltText('Profile photo')).toBeInTheDocument();
    });
  });

  // ── All statuses ─────────────────────────────────────────────────────────────

  describe('status variants', () => {
    it.each(['online', 'offline', 'away', 'busy'] as const)(
      'renders "%s" status with correct aria-label',
      (status) => {
        render(<Avatar name="Test" status={status} />);
        expect(screen.getByRole('img', { name: status })).toBeInTheDocument();
      },
    );
  });

});