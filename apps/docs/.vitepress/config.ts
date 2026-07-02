import { defineConfig } from 'vitepress';
import { resolve } from 'node:path';

export default defineConfig({
  title: 'Auron UI',
  description: 'Vue 3 component library — 85+ accessible components powered by Reka UI.',
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Components', link: '/components/' },
      { text: 'GitHub', link: 'https://github.com/DarkKnight1992/auronui' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Theming', link: '/guide/theming' },
          ],
        },
      ],
      '/components/': [
        {
          text: 'Components',
          items: [
            { text: 'Overview', link: '/components/' },
            { text: 'Badge', link: '/components/badge' },
            { text: 'Button', link: '/components/button' },
            { text: 'ButtonGroup', link: '/components/button-group' },
            { text: 'Card', link: '/components/card' },
            { text: 'Chip', link: '/components/chip' },
            { text: 'CloseButton', link: '/components/close-button' },
            { text: 'ContextMenu', link: '/components/context-menu' },
            { text: 'Description', link: '/components/description' },
            { text: 'Editable', link: '/components/editable' },
            { text: 'EmptyState', link: '/components/empty-state' },
            { text: 'Header', link: '/components/header' },
            { text: 'HoverCard', link: '/components/hover-card' },
            { text: 'Kbd', link: '/components/kbd' },
            { text: 'Label', link: '/components/label' },
            { text: 'Link', link: '/components/link' },
            { text: 'MonthPicker', link: '/components/month-picker' },
            { text: 'MonthRangePicker', link: '/components/month-range-picker' },
            { text: 'Separator', link: '/components/separator' },
            { text: 'Skeleton', link: '/components/skeleton' },
            { text: 'Spinner', link: '/components/spinner' },
            { text: 'Surface', link: '/components/surface' },
            { text: 'Text', link: '/components/text' },
            { text: 'TimeRangeField', link: '/components/time-range-field' },
            { text: 'YearRangePicker', link: '/components/year-range-picker' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/DarkKnight1992/auronui' },
    ],

    editLink: {
      pattern: 'https://github.com/DarkKnight1992/auron/edit/main/apps/docs/:path',
      text: 'Edit this page on GitHub',
    },

    search: {
      provider: 'local',
    },
  },

  vite: {
    resolve: {
      // Use array form so we can scope `@auronui/styles` to the bare specifier only.
      // Subpath imports like `@auronui/styles/components/popover` must fall through
      // to the package's `exports` map (./components/* → ./src/components/*/index.ts);
      // a string alias would intercept those subpaths and try to load them as files
      // under `packages/styles/components/popover`, which does not exist.
      alias: [
        {
          find: '@auronui/vue',
          replacement: resolve(__dirname, '../../../packages/vue/src/index.ts'),
        },
        {
          find: /^@auron\/styles$/,
          replacement: resolve(__dirname, '../../../packages/styles/src/index.ts'),
        },
        {
          find: /^@auron\/styles\/index\.css$/,
          replacement: resolve(__dirname, '../../../packages/styles/index.css'),
        },
      ],
    },
  },
});
