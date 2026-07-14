/// <reference types="vite/client" />

// @chialab/vitest-axe custom matcher type augmentation.
// Vitest re-exports Matchers from @vitest/expect; augmenting both is sufficient.
import "vitest";

declare module "vitest" {
  interface Matchers<T = unknown> {
    toHaveNoViolations(): T;
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

export {};
