import pkg from "./package.json";

/**
 * Every runtime and peer dependency stays external, subpaths included. A
 * bundled dependency is emitted under `dist/node_modules/.pnpm/<pkg>@<ver>…/`
 * and imported by relative path, which Nitro/Nuxt/Next production file tracing
 * does not follow — the published package then breaks there.
 */
const externalPackages = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
];

export function isExternal(id: string): boolean {
  return externalPackages.some((name) => id === name || id.startsWith(`${name}/`));
}
