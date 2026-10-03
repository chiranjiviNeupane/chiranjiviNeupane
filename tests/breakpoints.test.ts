import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { breakpoints } from '@/lib/breakpoints';

function cssFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return cssFiles(path);
    return path.endsWith('.css') ? [path] : [];
  });
}

const allowed = new Set(Object.values(breakpoints).flatMap((bp) => [`max-width: ${bp - 1}px`, `min-width: ${bp}px`]));

describe('responsive breakpoints', () => {
  it('only uses the shared breakpoints in stylesheets', () => {
    const offenders: string[] = [];
    for (const file of [...cssFiles('app'), ...cssFiles('components')]) {
      const css = readFileSync(file, 'utf8');
      for (const query of css.match(/@media[^{]+/g) ?? []) {
        for (const match of query.matchAll(/(max|min)-width:\s*\d+px/g)) {
          if (!allowed.has(match[0].replace(/\s+/, ' '))) offenders.push(`${file}: ${match[0]}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
