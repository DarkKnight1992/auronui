import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
  NavigationMenuIndicator,
} from '@auronui/vue'

const meta: Meta = {
  title: 'Components/NavigationMenu',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => ({
    components: { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink, NavigationMenuViewport },
    template: `
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/products/one">Product One</NavigationMenuLink>
              <NavigationMenuLink href="/products/two">Product Two</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="docs">
            <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger,
  NavigationMenuContent, NavigationMenuLink, NavigationMenuViewport,
} from '@auronui/vue'
</script>

<template>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem value="products">
        <NavigationMenuTrigger>Products</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink href="/products/one">Product One</NavigationMenuLink>
          <NavigationMenuLink href="/products/two">Product Two</NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem value="docs">
        <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
    <NavigationMenuViewport />
  </NavigationMenu>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
}

export const WithIndicator: Story = {
  render: () => ({
    components: { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink, NavigationMenuViewport, NavigationMenuIndicator },
    template: `
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/products/one">Product One</NavigationMenuLink>
              <NavigationMenuLink href="/products/two">Product Two</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="company">
            <NavigationMenuTrigger>Company</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/about">About</NavigationMenuLink>
              <NavigationMenuLink href="/careers">Careers</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuIndicator />
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger,
  NavigationMenuContent, NavigationMenuLink, NavigationMenuViewport, NavigationMenuIndicator,
} from '@auronui/vue'
</script>

<template>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem value="products">
        <NavigationMenuTrigger>Products</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink href="/products/one">Product One</NavigationMenuLink>
          <NavigationMenuLink href="/products/two">Product Two</NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem value="company">
        <NavigationMenuTrigger>Company</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink href="/about">About</NavigationMenuLink>
          <NavigationMenuLink href="/careers">Careers</NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuIndicator />
    </NavigationMenuList>
    <NavigationMenuViewport />
  </NavigationMenu>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const ActiveLink: Story = {
  render: () => ({
    components: { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, NavigationMenuViewport },
    template: `
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem value="home">
            <NavigationMenuLink href="/" :active="true">Home</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem value="docs">
            <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, NavigationMenuViewport } from '@auronui/vue'
</script>

<template>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem value="home">
        <NavigationMenuLink href="/" :active="true">Home</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem value="docs">
        <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
    <NavigationMenuViewport />
  </NavigationMenu>
</template>`,
        language: 'vue',
      },
    },
  },
}
