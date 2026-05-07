/// <reference types="vite/client" />

// Vue SFC shim — allows TypeScript to resolve *.vue imports
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>;
  export default component;
}

// @chialab/vitest-axe custom matcher type augmentation.
// Vitest re-exports Matchers from @vitest/expect; augmenting both is sufficient.
import 'vitest'

declare module 'vitest' {
  interface Matchers<T = unknown> {
    toHaveNoViolations(): T
  }
}

declare module "@vitest/expect" {
  interface Assertion<T = unknown> {
    toHaveNoViolations(): T;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}

export {}
