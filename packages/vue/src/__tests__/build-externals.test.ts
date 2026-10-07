import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { isExternal } from '../../vite.external'

// Every runtime/peer dependency must stay external in the library build.
// A bundled dependency lands in dist/ under a relative pnpm-store path
// (`dist/node_modules/.pnpm/motion-v@…/`), which Nitro/Nuxt production builds
// do not trace, so the published package breaks there.
const pkg = JSON.parse(readFileSync(resolve(__dirname, '../../package.json'), 'utf8'))
const deps = [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})]

describe('library build externals', () => {
  it.each(deps)('externalizes %s and its subpaths', (dep) => {
    expect(isExternal(dep)).toBe(true)
    expect(isExternal(`${dep}/some/subpath`)).toBe(true)
  })

  it('bundles local source', () => {
    expect(isExternal('./Button.vue')).toBe(false)
    expect(isExternal('/abs/src/index.ts')).toBe(false)
    expect(isExternal('vue-input-otp-not-a-dep')).toBe(false)
  })

  it('imports @auronui/styles only through its package root', () => {
    // Deep `@auronui/styles/components/*` paths are not in the package's
    // `exports` map, so they cannot be externalized and get inlined instead.
    const offenders: string[] = []
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const p = join(dir, entry)
        if (statSync(p).isDirectory()) { if (entry !== '__tests__') walk(p); continue }
        if (!/\.(ts|vue)$/.test(entry)) continue
        if (/from ['"]@auronui\/styles\/[^'"]+['"]/.test(readFileSync(p, 'utf8'))) offenders.push(p)
      }
    }
    walk(resolve(__dirname, '..'))
    expect(offenders).toEqual([])
  })
})

describe('dev-only code in the library build', () => {
  it('never gates on import.meta.env.DEV', () => {
    // Vite replaces import.meta.env.* when building *this library*, so a
    // DEV-gated warning is compiled to a no-op before any consumer sees it.
    // Gate on process.env.NODE_ENV instead, which the consumer's bundler
    // replaces (Vue itself does the same in its esm-bundler build).
    const offenders: string[] = []
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const p = join(dir, entry)
        if (statSync(p).isDirectory()) { if (entry !== '__tests__') walk(p); continue }
        if (/\.(ts|vue)$/.test(entry) && readFileSync(p, 'utf8').includes('import.meta.env')) offenders.push(p)
      }
    }
    walk(resolve(__dirname, '..'))
    expect(offenders).toEqual([])
  })
})
