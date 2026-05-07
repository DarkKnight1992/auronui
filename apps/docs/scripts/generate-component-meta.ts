import { parse } from 'vue-docgen-api';
import fg from 'fast-glob';
import { writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../../..');
const componentsGlob = 'packages/vue/src/components/**/*.vue';
const outFile = resolve(__dirname, '../.vitepress/data/components.json');

async function run() {
  const files = await fg(componentsGlob, { cwd: repoRoot, absolute: true });
  const result: Record<string, unknown> = {};
  for (const file of files) {
    try {
      const doc = await parse(file);
      if (doc.displayName) {
        result[doc.displayName] = doc;
      }
    } catch (err) {
      console.warn(`[docgen] failed to parse ${file}:`, (err as Error).message);
    }
  }
  await mkdir(dirname(outFile), { recursive: true });
  await writeFile(outFile, JSON.stringify(result, null, 2), 'utf8');
  console.log(`[docgen] wrote ${Object.keys(result).length} components to ${outFile}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
