import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { AspectRatio } from '@auronui/vue'

const meta: Meta<typeof AspectRatio> = {
  title: 'Extended/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  argTypes: {
    ratio: { control: { type: 'number', min: 0.1, max: 4, step: 0.1 } },
  },
  args: {
    ratio: 16 / 9,
  },
  decorators: [
    () => ({
      template: `<div style="padding: 32px; max-width: 600px;"><story /></div>`,
    }),
  ],
}

export default meta
type Story = StoryObj<typeof AspectRatio>

export const Default: Story = {
  render: (args) => ({
    components: { AspectRatio },
    setup: () => ({ args }),
    template: `
      <AspectRatio v-bind="args">
        <img
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=600"
          alt="Landscape"
          style="width:100%;height:100%;object-fit:cover;border-radius:8px;"
        />
      </AspectRatio>
    `,
  }),
}

export const Widescreen: Story = {
  args: { ratio: 16 / 9 },
  render: (args) => ({
    components: { AspectRatio },
    setup: () => ({ args }),
    template: `
      <AspectRatio v-bind="args">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
          alt="Mountain"
          style="width:100%;height:100%;object-fit:cover;border-radius:8px;"
        />
      </AspectRatio>
    `,
  }),
}

export const Square: Story = {
  args: { ratio: 1 },
  render: (args) => ({
    components: { AspectRatio },
    setup: () => ({ args }),
    template: `
      <AspectRatio v-bind="args" style="max-width:300px;">
        <img
          src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400"
          alt="Portrait"
          style="width:100%;height:100%;object-fit:cover;border-radius:50%;"
        />
      </AspectRatio>
    `,
  }),
}

export const Portrait: Story = {
  args: { ratio: 3 / 4 },
  render: (args) => ({
    components: { AspectRatio },
    setup: () => ({ args }),
    template: `
      <AspectRatio v-bind="args" style="max-width:280px;">
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400"
          alt="Portrait"
          style="width:100%;height:100%;object-fit:cover;border-radius:12px;"
        />
      </AspectRatio>
    `,
  }),
}

export const WithVideo: Story = {
  args: { ratio: 16 / 9 },
  render: (args) => ({
    components: { AspectRatio },
    setup: () => ({ args }),
    template: `
      <AspectRatio v-bind="args">
        <div style="width:100%;height:100%;background:#0f172a;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-family:sans-serif;font-size:14px;">
          Video placeholder (16:9)
        </div>
      </AspectRatio>
    `,
  }),
}

export const Ratios: Story = {
  render: () => ({
    components: { AspectRatio },
    template: `
      <div style="display:flex;flex-direction:column;gap:24px;">
        <div>
          <p style="font-size:12px;color:#64748b;margin-bottom:6px;font-family:sans-serif;">21:9 Ultrawide</p>
          <AspectRatio :ratio="21/9">
            <div style="width:100%;height:100%;background:#1e293b;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-family:sans-serif;font-size:12px;">21:9</div>
          </AspectRatio>
        </div>
        <div>
          <p style="font-size:12px;color:#64748b;margin-bottom:6px;font-family:sans-serif;">16:9 Widescreen</p>
          <AspectRatio :ratio="16/9">
            <div style="width:100%;height:100%;background:#1e293b;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-family:sans-serif;font-size:12px;">16:9</div>
          </AspectRatio>
        </div>
        <div>
          <p style="font-size:12px;color:#64748b;margin-bottom:6px;font-family:sans-serif;">4:3 Classic</p>
          <AspectRatio :ratio="4/3">
            <div style="width:100%;height:100%;background:#1e293b;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-family:sans-serif;font-size:12px;">4:3</div>
          </AspectRatio>
        </div>
        <div>
          <p style="font-size:12px;color:#64748b;margin-bottom:6px;font-family:sans-serif;">1:1 Square</p>
          <AspectRatio :ratio="1" style="max-width:200px;">
            <div style="width:100%;height:100%;background:#1e293b;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-family:sans-serif;font-size:12px;">1:1</div>
          </AspectRatio>
        </div>
      </div>
    `,
  }),
}
