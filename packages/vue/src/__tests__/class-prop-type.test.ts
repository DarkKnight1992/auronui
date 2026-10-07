import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

// A component that declares `class` as a prop captures it from Vue's normal
// class fallthrough, so its type is the only thing that decides what callers
// may pass. Typed as `string`, the idiomatic `:class="{ active: x }"` and
// `:class="['a', 'b']"` bindings fail typecheck (TS2345). Use `ClassValue`.
describe('declared class props', () => {
  it('accept every Vue class binding form (ClassValue, never plain string)', () => {
    const offenders: string[] = []
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const p = join(dir, entry)
        if (statSync(p).isDirectory()) { if (entry !== '__tests__') walk(p); continue }
        if (entry.endsWith('.vue') && /^\s*class\?:\s*string\b/m.test(readFileSync(p, 'utf8'))) offenders.push(p)
      }
    }
    walk(resolve(__dirname, '../components'))
    expect(offenders).toEqual([])
  })
})
