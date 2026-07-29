import React from 'react';
import type { Preview, Decorator, StoryContext } from '@storybook/react';
import { defaultTheme, darkTheme, brandTheme } from '@uilib/tokens';

const THEMES = {
  default: defaultTheme,
  dark:    darkTheme,
  brand:   brandTheme,
} as const;

type ThemeKey = keyof typeof THEMES;

const withTheme: Decorator = (
  Story: React.ComponentType,
  context: StoryContext,
) => {
  const themeKey   = (context.globals['theme'] ?? 'default') as ThemeKey;
  const themeClass = THEMES[themeKey] ?? defaultTheme;

  return (
    <div
      className={themeClass}
      style={{
        minHeight:       '100vh',
        padding:         '2rem',
        backgroundColor: 'var(--color-surface-default)',
        color:           'var(--color-text-primary)',
      }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date:  /date$/i,
      },
    },
  },

  globalTypes: {
    theme: {
      name:         'Theme',
      description:  'Switch the active design token theme',
      defaultValue: 'default',
      toolbar: {
        icon:  'paintbrush',
        items: [
          { value: 'default', title: 'Default' },
          { value: 'dark',    title: 'Dark'    },
          { value: 'brand',   title: 'Brand'   },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [withTheme],
};

export default preview;