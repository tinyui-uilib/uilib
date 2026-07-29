import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox, CheckboxGroup } from './Checkbox';

describe('Checkbox', () => {
  it('renders a checkbox role', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('is unchecked by default', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
  });

  it('renders label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('label is associated via htmlFor', () => {
    render(<Checkbox label="Accept terms" />);
    const label    = screen.getByText('Accept terms');
    const checkbox = screen.getByRole('checkbox');
    expect(label.getAttribute('for')).toBe(checkbox.getAttribute('id'));
  });

  it('fires onCheckedChange on click', async () => {
    const user            = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('does not fire when disabled', async () => {
    const user            = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox disabled onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('reflects indeterminate state', () => {
    render(<Checkbox checked="indeterminate" onCheckedChange={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Checkbox ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has correct displayName', () => {
    expect(Checkbox.displayName).toBe('Checkbox');
  });
});

describe('CheckboxGroup', () => {
  const items = [
    { id: '1', label: 'Apple',  checked: false },
    { id: '2', label: 'Banana', checked: false },
    { id: '3', label: 'Cherry', checked: false },
  ];

  it('header is unchecked when no items are checked', () => {
    render(<CheckboxGroup label="Fruits" items={items} onChange={vi.fn()} />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toHaveAttribute('aria-checked', 'false');
  });

  it('header is indeterminate when some items are checked', () => {
    const partial = [
      { ...items[0]!, checked: true  },
      { ...items[1]!, checked: false },
      { ...items[2]!, checked: false },
    ];
    render(<CheckboxGroup label="Fruits" items={partial} onChange={vi.fn()} />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toHaveAttribute('aria-checked', 'mixed');
  });

  it('header is checked when all items are checked', () => {
    const allChecked = items.map((i) => ({ ...i, checked: true }));
    render(<CheckboxGroup label="Fruits" items={allChecked} onChange={vi.fn()} />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toHaveAttribute('aria-checked', 'true');
  });

  it('clicking header calls onChange for all items', async () => {
    const user     = userEvent.setup();
    const onChange = vi.fn();
    render(<CheckboxGroup label="Fruits" items={items} onChange={onChange} />);

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]!);

    expect(onChange).toHaveBeenCalledTimes(3);
  });
});