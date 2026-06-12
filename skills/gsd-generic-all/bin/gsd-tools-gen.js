#!/usr/bin/env node
/**
 * GSD Tools — Generic Version
 *
 * Drop-in replacement for the original gsd-tools.cjs.
 * Operates on the local .planning/ directory using standard Node.js fs.
 *
 * Usage: gsd-tools <command> [args]
 */

'use strict';

const fs = require('fs');
const path = require('path');

const EXIT_OK = 0;
const EXIT_ERR = 1;

function findProjectRoot(startDir) {
  let dir = path.resolve(startDir || process.cwd());
  const root = path.parse(dir).root;
  while (dir !== root) {
    if (fs.existsSync(path.join(dir, '.planning'))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
}

function planningDir(cwd) {
  return path.join(findProjectRoot(cwd), '.planning');
}

function loadConfig(cwd) {
  const cp = path.join(planningDir(cwd), 'config.json');
  try {
    return JSON.parse(fs.readFileSync(cp, 'utf-8'));
  } catch {
    return {};
  }
}

function setConfigValue(cwd, keyPath, value) {
  const cp = path.join(planningDir(cwd), 'config.json');
  const cfg = loadConfig(cwd);
  const parts = keyPath.split('.');
  let target = cfg;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (!(p in target) || typeof target[p] !== 'object') {
      target[p] = {};
    }
    target = target[p];
  }
  let parsed = value;
  try { parsed = JSON.parse(value); } catch {}
  target[parts[parts.length - 1]] = parsed;
  fs.writeFileSync(cp, JSON.stringify(cfg, null, 2) + '\n');
}

function cmdGraphify(args) {
  const cwd = process.cwd();
  const pd = planningDir(cwd);
  const outputFile = path.join(pd, 'CODEBASE-INDEX.md');

  // Build a simple file index of the project (excluding common noise)
  const exclude = ['node_modules', '.git', 'dist', 'build', '.planning', '.workbuddy', '.Codex', '.claude', '.cursor', '.aider', 'coverage', '.nyc_output', '__pycache__', '.pytest_cache'];
  const include = ['.js', '.ts', '.jsx', '.tsx', '.py', '.go', '.rs', '.java', '.c', '.cpp', '.h', '.swift', '.kt', '.rb', '.php', '.md', '.json', '.yaml', '.yml', '.toml', '.sh', '.ps1'];

  const results = [];
  function walk(dir, prefix) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (exclude.includes(entry.name)) continue;
        if (entry.name.startsWith('.')) continue;
        const fullPath = path.join(dir, entry.name);
        const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
          walk(fullPath, relPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (include.includes(ext) || include.some(i => entry.name.endsWith(i))) {
            try {
              const stat = fs.statSync(fullPath);
              results.push({ path: relPath.replace(/\\/g, '/'), size: stat.size });
            } catch {}
          }
        }
      }
    } catch {}
  }

  walk(cwd, '');

  const lines = [
    '# Codebase Index',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Total files: ${results.length}`,
    '',
    '## File Listing',
    '',
    '| File | Size (bytes) |',
    '|------|-------------|',
    ...results.map(r => `| ${r.path} | ${r.size} |`),
    '',
  ];

  fs.writeFileSync(outputFile, lines.join('\n'));
  console.log(`Codebase index written to: ${outputFile}`);
  return EXIT_OK;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
GSD Tools — Generic Version (drop-in replacement for gsd-tools.cjs)

Usage:
  gsd-tools <command> [args]

Commands:
  graphify                          Build CODEBASE-INDEX.md from source files
  config-set <key.path> <value>     Set a config value in .planning/config.json

Examples:
  gsd-tools graphify
  gsd-tools config-set model.default gpt-4
`.trim());
    return EXIT_OK;
  }

  if (args[0] === '--version' || args[0] === '-v') {
    console.log('gsd-tools-generic 1.0.0');
    return EXIT_OK;
  }

  const cmd = args[0];

  if (cmd === 'graphify') {
    return cmdGraphify(args.slice(1));
  }

  if (cmd === 'config-set') {
    const key = args[1];
    const val = args.slice(2).join(' ');
    if (!key) { console.error('config-set requires key and value'); return EXIT_ERR; }
    setConfigValue(process.cwd(), key, val);
    return EXIT_OK;
  }

  console.error(`Unknown command: ${cmd}`);
  return EXIT_ERR;
}

process.exit(main());
