// export {} makes this a module so the declare below is an augmentation
// (additive), not an ambient declaration (replacement). Without it, all
// real reka-ui exports would be wiped out.
export {}

// Re-export internal reka-ui types through the public module so that
// vite-plugin-dts can reference them in generated .d.ts files.
// Without this, TS2883 fires for DateInput.vue and DateRangeField.vue because
// Volar infers __VLS_template types that reference reka-ui/dist/index2|3.
declare module 'reka-ui' {
  export type { DateStep, Direction, Granularity, HourCycle } from 'reka-ui/dist/index3'
  export type { Matcher } from 'reka-ui/dist/index2'
}
