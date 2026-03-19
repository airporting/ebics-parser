import { readFileSync, writeFileSync } from 'node:fs';
import { join, parse, resolve } from 'node:path';

import parser from '@/src/index';

const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: yarn parse <filepath>');
  process.exit(1);
}

const resolvedPath = resolve(filePath);
const text = readFileSync(resolvedPath, 'utf-8');
const result = parser(text);

const { dir, name } = parse(resolvedPath);
const outputPath = join(dir, `${name}.parsed.json`);

writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
console.log(`Résultat écrit dans ${outputPath}`);
