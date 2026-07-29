'use client';

import * as React from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import {
  accordionRootClass,
  accordionItemClass,
  accordionTriggerClass,
  accordionChevronClass,
  accordionContentClass,
  accordionContentInnerClass,
} from './Accordion.css';

// ─── Root ─────────────────────────────────────────────────────────────────────

export type AccordionType = 'single' | 'multiple';

export type AccordionRootProps =
  | (RadixAccordion.AccordionSingleProps & { type: 'single' })
  | (RadixAccordion.AccordionMultipleProps & { type: 'multiple' });

function AccordionRoot({ className, children, ...props }: AccordionRootProps) {
  return (
    <RadixAccordion.Root
      className={[accordionRootClass, className].filter(Boolean).join(' ')}
      {...(props as RadixAccordion.AccordionSingleProps)}
    >
      {children}
    </RadixAccordion.Root>
  );
}

// ─── Item ─────────────────────────────────────────────────────────────────────

export interface AccordionItemProps
  extends React.ComponentPropsWithoutRef<typeof RadixAccordion.Item> {}

function AccordionItem({ className, children, ...props }: AccordionItemProps) {
  return (
    <RadixAccordion.Item
      className={[accordionItemClass, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </RadixAccordion.Item>
  );
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

export interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof RadixAccordion.Trigger> {}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof RadixAccordion.Trigger>,
  AccordionTriggerProps
>(function AccordionTrigger({ className, children, ...props }, ref) {
  return (
    <RadixAccordion.Header>
      <RadixAccordion.Trigger
        ref={ref}
        className={[accordionTriggerClass, className].filter(Boolean).join(' ')}
        {...props}
      >
        {children}
        <ChevronIcon />
      </RadixAccordion.Trigger>
    </RadixAccordion.Header>
  );
});

AccordionTrigger.displayName = 'Accordion.Trigger';

// ─── Content ──────────────────────────────────────────────────────────────────

export interface AccordionContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixAccordion.Content> {}

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof RadixAccordion.Content>,
  AccordionContentProps
>(function AccordionContent({ className, children, ...props }, ref) {
  return (
    <RadixAccordion.Content
      ref={ref}
      className={[accordionContentClass, className].filter(Boolean).join(' ')}
      {...props}
    >
      <div className={accordionContentInnerClass}>{children}</div>
    </RadixAccordion.Content>
  );
});

AccordionContent.displayName = 'Accordion.Content';

// ─── Chevron ──────────────────────────────────────────────────────────────────

function ChevronIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={accordionChevronClass}
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

// ─── Compound export ──────────────────────────────────────────────────────────

export const Accordion = {
  Root:    AccordionRoot,
  Item:    AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
};