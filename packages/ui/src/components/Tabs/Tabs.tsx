'use client';

import * as React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import {
  tabsListRecipe,
  tabsTriggerRecipe,
  tabsContentClass,
  type TabsVariant,
} from './Tabs.css';

export type { TabsVariant };

// ─── Context ──────────────────────────────────────────────────────────────────

interface TabsContextValue { variant: TabsVariant }
const TabsContext = React.createContext<TabsContextValue>({ variant: 'line' });

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface TabsRootProps extends RadixTabs.TabsProps {
  variant?: TabsVariant;
}

function TabsRoot({ variant = 'line', children, ...props }: TabsRootProps) {
  const ctx = React.useMemo(() => ({ variant }), [variant]);
  return (
    <TabsContext.Provider value={ctx}>
      <RadixTabs.Root {...props}>{children}</RadixTabs.Root>
    </TabsContext.Provider>
  );
}

// ─── List ─────────────────────────────────────────────────────────────────────

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.List> {}

function TabsList({ className, children, ...props }: TabsListProps) {
  const { variant } = React.useContext(TabsContext);
  return (
    <RadixTabs.List
      className={[tabsListRecipe({ variant }), className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </RadixTabs.List>
  );
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger> {
  icon?: React.ReactNode;
}

function TabsTrigger({ icon, className, children, ...props }: TabsTriggerProps) {
  const { variant } = React.useContext(TabsContext);
  return (
    <RadixTabs.Trigger
      className={[tabsTriggerRecipe({ variant }), className].filter(Boolean).join(' ')}
      {...props}
    >
      {icon != null && <span aria-hidden="true" style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
    </RadixTabs.Trigger>
  );
}

// ─── Content ──────────────────────────────────────────────────────────────────

export interface TabsContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.Content> {}

function TabsContent({ className, children, ...props }: TabsContentProps) {
  return (
    <RadixTabs.Content
      className={[tabsContentClass, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </RadixTabs.Content>
  );
}

// ─── Compound export ──────────────────────────────────────────────────────────

export const Tabs = {
  Root:    TabsRoot,
  List:    TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
};