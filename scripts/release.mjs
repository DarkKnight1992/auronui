#!/usr/bin/env node
// Usage: node scripts/release.mjs patch|minor|major

import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readdirSync } from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const bump = process.argv[2]
if (!['patch', 'minor', 'major'].includes(bump)) {
  console.error('Usage: node scripts/release.mjs patch|minor|major')
  process.exit(1)
}

// Collect all non-private packages under packages/
const packagesDir = resolve(root, 'packages')
const publicPkgs = readdirSync(packagesDir)
  .map(name => resolve(packagesDir, name, 'package.json'))
  .filter(pkgPath => {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
      return pkg.private !== true
    } catch {
      return false
    }
  })

if (publicPkgs.length === 0) {
  console.error('No public packages found.')
  process.exit(1)
}

// Derive next version from the first public package
const firstPkg = JSON.parse(readFileSync(publicPkgs[0], 'utf8'))
const [major, minor, patch] = firstPkg.version.split('.').map(Number)
const next =
  bump === 'major' ? `${major + 1}.0.0`
  : bump === 'minor' ? `${major}.${minor + 1}.0`
  : `${major}.${minor}.${patch + 1}`

// Bump all public packages
for (const pkgPath of publicPkgs) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  const prev = pkg.version
  pkg.version = next
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
  console.log(`  ${pkg.name}: ${prev} → ${next}`)
}

// Commit and tag
const changedPaths = publicPkgs.map(p => p.replace(root + '/', '')).join(' ')
execSync(`git add ${changedPaths}`, { cwd: root, stdio: 'inherit' })
execSync(`git commit -m "chore: version bump ${next}"`, { cwd: root, stdio: 'inherit' })

const tag = `v${next}`
execSync(`git tag ${tag}`, { cwd: root, stdio: 'inherit' })

console.log(`\n✓ Released ${tag}`)
console.log(`  Push with: git push && git push origin ${tag}`)
