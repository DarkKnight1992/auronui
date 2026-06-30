#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline'

const __dirname = dirname(fileURLToPath(import.meta.url))
// When installed via npm: node_modules/@auronui/vue/bin/ → node_modules/@auronui/vue/ai-rules.md
// When run locally from packages/vue/: packages/vue/bin/ → packages/vue/ai-rules.md
const rulesSource = resolve(__dirname, '../ai-rules.md')
const dest = resolve(process.cwd(), 'auronui-rules.md')

const args = process.argv.slice(2)
const isUpdate = args.includes('--update')
const isDryRun = args.includes('--dry-run')

function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close()
      resolve(answer.trim().toLowerCase() === 'y')
    })
  })
}

async function main() {
  if (!existsSync(rulesSource)) {
    console.error(`Error: could not find ai-rules.md at ${rulesSource}`)
    process.exit(1)
  }

  if (isDryRun) {
    console.log(`Would create: ${dest}`)
    console.log('(dry run — no files written)')
    return
  }

  if (existsSync(dest) && !isUpdate) {
    const ok = await prompt('auronui-rules.md already exists. Overwrite? (y/N) ')
    if (!ok) {
      console.log('Aborted. Run with --update to overwrite without prompting.')
      return
    }
  }

  const content = readFileSync(rulesSource, 'utf8')
  writeFileSync(dest, content, 'utf8')

  console.log('✔ Created auronui-rules.md\n')
  console.log('Add AuronUI rules to your AI tools:\n')
  console.log('  Claude Code / Gemini CLI')
  console.log('    Add to CLAUDE.md or GEMINI.md:')
  console.log('      @auronui-rules.md\n')
  console.log('  Cursor')
  console.log('    Create .cursor/rules/auronui.mdc:')
  console.log('      ---')
  console.log('      description: AuronUI component rules')
  console.log('      globs: "**/*.vue,**/*.ts"')
  console.log('      ---')
  console.log('      (paste content of auronui-rules.md here)\n')
  console.log('  GitHub Copilot')
  console.log('    Append to .github/copilot-instructions.md:')
  console.log('      (paste content of auronui-rules.md here)\n')
  console.log('  Windsurf')
  console.log('    Append to .windsurfrules:')
  console.log('      (paste content of auronui-rules.md here)\n')
  console.log('  Zed')
  console.log('    Add to .zed/rules (create if missing):')
  console.log('      (paste content of auronui-rules.md here)\n')
  console.log('Run `npx @auronui/vue setup-ai --update` to refresh after upgrading @auronui/vue.')
}

main()
