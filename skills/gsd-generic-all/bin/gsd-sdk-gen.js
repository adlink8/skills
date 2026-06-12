#!/usr/bin/env node
/**
 * GSD SDK — Generic Version (cross-platform)
 *
 * A drop-in replacement for the original Codex-specific gsd-sdk.
 * All commands operate on the local .planning/ directory using standard
 * Node.js fs operations. No Codex runtime dependencies.
 *
 * Usage: gsd-sdk query <command> [args]
 *        gsd-sdk query commit "message"
 *        gsd-sdk query state.load
 *        gsd-sdk query config-get workflow.tdd_mode
 *        gsd-sdk query frontmatter.get <file> [--field status]
 *        gsd-sdk query resolve-model <agent-type>
 *        gsd-sdk query generate-slug "text"
 *        gsd-sdk query <namespace>.<subcommand> [args]
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ─── Constants ──────────────────────────────────────────────────────────────

const EXIT_OK = 0;
const EXIT_ERR = 1;

// ─── Path helpers ───────────────────────────────────────────────────────────

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

// ─── Frontmatter ────────────────────────────────────────────────────────────

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    const idx = line.indexOf(':');
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      let val = line.slice(idx + 1).trim();
      // Unquote simple string values
      if ((val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      result[key] = val;
    }
  }
  return result;
}

function setFrontmatter(content, key, value) {
  const fm = extractFrontmatter(content);
  fm[key] = value;
  const fmLines = Object.entries(fm).map(([k, v]) => `${k}: ${v}`);
  const body = content.replace(/^---\n[\s\S]*?\n---/, '').trimStart();
  return `---\n${fmLines.join('\n')}\n---\n${body}`;
}

// ─── Config ─────────────────────────────────────────────────────────────────

function loadConfig(cwd) {
  const cp = path.join(planningDir(cwd), 'config.json');
  try {
    return JSON.parse(fs.readFileSync(cp, 'utf-8'));
  } catch {
    return {};
  }
}

function getConfigValue(cwd, keyPath) {
  const cfg = loadConfig(cwd);
  const parts = keyPath.split('.');
  let val = cfg;
  for (const p of parts) {
    if (val && typeof val === 'object' && p in val) {
      val = val[p];
    } else {
      return undefined;
    }
  }
  return val;
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
  // Try to parse as JSON, fall back to string
  let parsed = value;
  try { parsed = JSON.parse(value); } catch {}
  target[parts[parts.length - 1]] = parsed;
  fs.writeFileSync(cp, JSON.stringify(cfg, null, 2) + '\n');
}

// ─── STATE.md ───────────────────────────────────────────────────────────────

function loadState(cwd) {
  const sp = path.join(planningDir(cwd), 'STATE.md');
  try {
    return fs.readFileSync(sp, 'utf-8');
  } catch {
    return '';
  }
}

// ─── Git helpers ────────────────────────────────────────────────────────────

function gitCommit(message, files) {
  const args = files && files.length ? [...files, '-m', message] : ['-m', message];
  try {
    const out = execSync(`git commit ${args.map(a => `"${a.replace(/"/g, '\\"')}"`).join(' ')}`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    console.log(out.trim());
    return EXIT_OK;
  } catch (e) {
    console.error('git commit failed:', e.stderr?.toString() || e.message);
    return EXIT_ERR;
  }
}

// ─── Model resolution ───────────────────────────────────────────────────────

function resolveModel(agentType) {
  const cfg = loadConfig(process.cwd());
  const profiles = cfg.model_profiles || {};
  const profile = profiles[agentType] || profiles.default || {};
  const model = profile.model || cfg.model || 'default';
  const reasoning_effort = profile.reasoning_effort || 'medium';
  console.log(JSON.stringify({ model, reasoning_effort }));
  return EXIT_OK;
}

// ─── Slug generation ────────────────────────────────────────────────────────

function generateSlug(text) {
  const slug = text.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
  console.log(JSON.stringify({ slug }));
  return EXIT_OK;
}

// ─── Namespace command router ───────────────────────────────────────────────

/**
 * Generic namespace command handler.
 * Commands like `health.status`, `todos.list`, etc. are mapped to
 * reading/writing the corresponding files in .planning/
 */
function handleNamespaceCommand(namespace, subcommand, args) {
  const pd = planningDir(process.cwd());
  const nsMap = {
    state: { file: 'STATE.md', type: 'markdown' },
    roadmap: { file: 'ROADMAP.md', type: 'markdown' },
    requirements: { file: 'REQUIREMENTS.md', type: 'markdown' },
    todos: { dir: 'todos/pending', type: 'directory' },
    backlog: { dir: 'backlog', type: 'directory' },
    thread: { dir: 'threads', type: 'directory' },
    intel: { dir: 'intel', type: 'directory' },
    settings: { file: 'config.json', type: 'json' },
    workspace: { file: 'WORKSPACE.md', type: 'markdown' },
    workstreams: { file: 'WORKSTREAMS.md', type: 'markdown' },
    progress: { file: 'PROGRESS.md', type: 'markdown' },
    stats: { file: 'STATS.md', type: 'markdown' },
    ship: { file: 'SHIP.md', type: 'markdown' },
    scan: { file: 'SCAN.md', type: 'markdown' },
    secure: { file: 'SECURITY.md', type: 'markdown' },
    session: { file: 'SESSION.md', type: 'markdown' },
    review: { file: 'REVIEW.md', type: 'markdown' },
    resume: { file: 'RESUME.md', type: 'markdown' },
    research: { file: 'RESEARCH.md', type: 'markdown' },
    plan: { dir: 'phases', type: 'phase-dir' },
    phase: { dir: 'phases', type: 'phase-dir' },
    milestone: { file: 'MILESTONE.md', type: 'markdown' },
    map: { file: 'MAP.md', type: 'markdown' },
    manager: { file: 'MANAGER.md', type: 'markdown' },
    list: { file: 'LIST.md', type: 'markdown' },
    inbox: { file: 'INBOX.md', type: 'markdown' },
    import: { file: 'IMPORT.md', type: 'markdown' },
    help: { file: 'HELP.md', type: 'markdown' },
    forensics: { file: 'FORENSICS.md', type: 'markdown' },
    extract: { file: 'EXTRACT.md', type: 'markdown' },
    explore: { file: 'EXPLORE.md', type: 'markdown' },
    execute: { file: 'EXECUTE.md', type: 'markdown' },
    eval: { file: 'EVAL.md', type: 'markdown' },
    docs: { file: 'DOCS.md', type: 'markdown' },
    do: { file: 'DO.md', type: 'markdown' },
    discuss: { file: 'DISCUSS.md', type: 'markdown' },
    debug: { file: 'DEBUG.md', type: 'markdown' },
    complete: { file: 'COMPLETE.md', type: 'markdown' },
    code: { file: 'CODE.md', type: 'markdown' },
    cleanup: { file: 'CLEANUP.md', type: 'markdown' },
    check: { file: 'CHECK.md', type: 'markdown' },
    autonomous: { file: 'AUTONOMOUS.md', type: 'markdown' },
    audit: { file: 'AUDIT.md', type: 'markdown' },
    analyze: { file: 'ANALYZE.md', type: 'markdown' },
    ai: { file: 'AI.md', type: 'markdown' },
    add: { file: 'ADD.md', type: 'markdown' },
    note: { dir: 'notes', type: 'directory' },
    next: { file: 'NEXT.md', type: 'markdown' },
    new: { file: 'NEW.md', type: 'markdown' },
    pr: { file: 'PR.md', type: 'markdown' },
    plant: { file: 'PLANT.md', type: 'markdown' },
    profile: { file: 'PROFILE.md', type: 'markdown' },
    'set-profile': { file: 'PROFILE.md', type: 'markdown' },
    spec: { file: 'SPEC.md', type: 'markdown' },
    spike: { file: 'SPIKE.md', type: 'markdown' },
    pause: { file: 'PAUSE.md', type: 'markdown' },
    undo: { file: 'UNDO.md', type: 'markdown' },
    ui: { file: 'UI.md', type: 'markdown' },
    sync: { file: 'SYNC.md', type: 'markdown' },
    remove: { file: 'REMOVE.md', type: 'markdown' },
    insert: { file: 'INSERT.md', type: 'markdown' },
    init: { file: 'INIT.md', type: 'markdown' },
    ingest: { file: 'INGEST.md', type: 'markdown' },
    fast: { file: 'FAST.md', type: 'markdown' },
    verify: { file: 'VERIFY.md', type: 'markdown' },
  };

  const mapped = nsMap[namespace];
  if (!mapped) {
    // Unknown namespace: try to find a file with that name
    const tryFile = path.join(pd, `${namespace.toUpperCase()}.md`);
    if (fs.existsSync(tryFile)) {
      if (subcommand === 'get' || subcommand === 'load' || subcommand === 'status') {
        console.log(fs.readFileSync(tryFile, 'utf-8'));
        return EXIT_OK;
      }
    }
    console.error(`Unknown namespace: ${namespace}`);
    return EXIT_ERR;
  }

  const targetPath = mapped.file ? path.join(pd, mapped.file) : path.join(pd, mapped.dir || '');

  // Default subcommands
  if (subcommand === 'load' || subcommand === 'get' || subcommand === 'status' || subcommand === 'list') {
    if (mapped.type === 'json') {
      try { console.log(fs.readFileSync(targetPath, 'utf-8')); } catch { console.log('{}'); }
    } else if (mapped.type === 'directory') {
      try {
        const files = fs.readdirSync(targetPath).filter(f => f.endsWith('.md'));
        console.log(JSON.stringify(files));
      } catch { console.log('[]'); }
    } else if (mapped.type === 'phase-dir') {
      try {
        const dirs = fs.readdirSync(targetPath, { withFileTypes: true })
          .filter(d => d.isDirectory() && /^\d/.test(d.name))
          .map(d => d.name)
          .sort();
        console.log(JSON.stringify(dirs));
      } catch { console.log('[]'); }
    } else {
      try { console.log(fs.readFileSync(targetPath, 'utf-8')); } catch { console.log(''); }
    }
    return EXIT_OK;
  }

  if (subcommand === 'update' || subcommand === 'set') {
    // For config-like namespaces, write JSON
    if (mapped.type === 'json') {
      const data = args[0] ? JSON.parse(args[0]) : {};
      fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
      return EXIT_OK;
    }
    console.error(`update not supported for ${namespace}`);
    return EXIT_ERR;
  }

  // Fallback: print file content if exists
  if (fs.existsSync(targetPath)) {
    const stat = fs.statSync(targetPath);
    if (stat.isFile()) {
      console.log(fs.readFileSync(targetPath, 'utf-8'));
    } else if (stat.isDirectory()) {
      try {
        const entries = fs.readdirSync(targetPath);
        console.log(JSON.stringify(entries));
      } catch { console.log('[]'); }
    }
    return EXIT_OK;
  }

  console.error(`Not found: ${targetPath}`);
  return EXIT_ERR;
}

// ─── Main query router ──────────────────────────────────────────────────────

function routeQuery(args) {
  if (args.length === 0) {
    console.error('Usage: gsd-sdk query <command> [args]');
    return EXIT_ERR;
  }

  const cmd = args[0];

  // ── Direct commands ──────────────────────────────────────────────────────
  if (cmd === 'commit') {
    const message = args[1] || 'GSD auto-commit';
    const files = [];
    let noVerify = false;
    for (let i = 2; i < args.length; i++) {
      if (args[i] === '--no-verify') noVerify = true;
      else if (args[i] === '--files') {
        i++;
        while (i < args.length && !args[i].startsWith('--')) files.push(args[i++]);
        i--;
      }
    }
    return gitCommit(message, files);
  }

  if (cmd === 'resolve-model') {
    return resolveModel(args[1] || 'default');
  }

  if (cmd === 'generate-slug') {
    return generateSlug(args.slice(1).join(' '));
  }

  if (cmd === 'config-get') {
    const key = args[1];
    if (!key) { console.error('config-get requires a key'); return EXIT_ERR; }
    const val = getConfigValue(process.cwd(), key);
    if (val !== undefined) {
      console.log(typeof val === 'object' ? JSON.stringify(val) : String(val));
    }
    return EXIT_OK;
  }

  if (cmd === 'config-set') {
    const key = args[1];
    const val = args.slice(2).join(' ');
    if (!key) { console.error('config-set requires key and value'); return EXIT_ERR; }
    setConfigValue(process.cwd(), key, val);
    return EXIT_OK;
  }

  if (cmd === 'state.load' || cmd === 'state.load\b') {
    const content = loadState(process.cwd());
    console.log(content);
    return EXIT_OK;
  }

  if (cmd === 'frontmatter.get') {
    const filePath = args[1];
    const field = args.find((a, i) => i > 1 && a === '--field') ? args[args.indexOf('--field') + 1] : null;
    if (!filePath) { console.error('frontmatter.get requires a file path'); return EXIT_ERR; }
    const resolved = path.resolve(filePath);
    if (!fs.existsSync(resolved)) { console.error(`File not found: ${resolved}`); return EXIT_ERR; }
    const content = fs.readFileSync(resolved, 'utf-8');
    const fm = extractFrontmatter(content);
    if (field) {
      console.log(fm[field] !== undefined ? String(fm[field]) : '');
    } else {
      console.log(JSON.stringify(fm));
    }
    return EXIT_OK;
  }

  if (cmd === 'frontmatter.set') {
    const filePath = args[1];
    if (!filePath) { console.error('frontmatter.set requires a file path'); return EXIT_ERR; }
    const resolved = path.resolve(filePath);
    if (!fs.existsSync(resolved)) { console.error(`File not found: ${resolved}`); return EXIT_ERR; }
    let content = fs.readFileSync(resolved, 'utf-8');

    // Parse --field and --value
    let field = null, value = null;
    for (let i = 2; i < args.length; i++) {
      if (args[i] === '--field') field = args[++i];
      if (args[i] === '--value') value = args[++i];
    }
    if (!field) { console.error('frontmatter.set requires --field'); return EXIT_ERR; }
    content = setFrontmatter(content, field, value !== null ? value : '');
    fs.writeFileSync(resolved, content);
    return EXIT_OK;
  }

  if (cmd === 'frontmatter.merge') {
    const filePath = args[1];
    if (!filePath) { console.error('frontmatter.merge requires a file path'); return EXIT_ERR; }
    const resolved = path.resolve(filePath);
    if (!fs.existsSync(resolved)) { console.error(`File not found: ${resolved}`); return EXIT_ERR; }
    let content = fs.readFileSync(resolved, 'utf-8');
    let dataArg = null;
    for (let i = 2; i < args.length; i++) {
      if (args[i] === '--data') dataArg = args[++i];
    }
    if (!dataArg) { console.error('frontmatter.merge requires --data'); return EXIT_ERR; }
    const data = JSON.parse(dataArg);
    for (const [k, v] of Object.entries(data)) {
      content = setFrontmatter(content, k, String(v));
    }
    fs.writeFileSync(resolved, content);
    return EXIT_OK;
  }

  if (cmd === 'health.status' || cmd === 'health.xxx') {
    const pd = planningDir(process.cwd());
    const checks = {
      'STATE.md': fs.existsSync(path.join(pd, 'STATE.md')),
      'ROADMAP.md': fs.existsSync(path.join(pd, 'ROADMAP.md')),
      'config.json': fs.existsSync(path.join(pd, 'config.json')),
      'phases/': fs.existsSync(path.join(pd, 'phases')),
    };
    console.log(JSON.stringify(checks));
    return EXIT_OK;
  }

  // ── Namespace commands (e.g., intel.query, todos.list) ───────────────────
  const dotIdx = cmd.indexOf('.');
  if (dotIdx > 0) {
    const namespace = cmd.slice(0, dotIdx);
    const subcommand = cmd.slice(dotIdx + 1);
    return handleNamespaceCommand(namespace, subcommand, args.slice(1));
  }

  // ── Fallback ─────────────────────────────────────────────────────────────
  console.error(`Unknown command: ${cmd}`);
  return EXIT_ERR;
}

// ─── CLI entrypoint ─────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
GSD SDK — Generic Version (drop-in replacement for Codex gsd-sdk)

Usage:
  gsd-sdk query <command> [args]

Commands:
  commit <message> [--files f1 f2] [--no-verify]
  resolve-model <agent-type>
  generate-slug <text>
  config-get <key.path>
  config-set <key.path> <value>
  state.load
  frontmatter.get <file> [--field key]
  frontmatter.set <file> --field key --value val
  frontmatter.merge <file> --data '{"key":"val"}'
  health.status
  <namespace>.<subcommand>  (e.g., intel.query, todos.list, roadmap.get)

Examples:
  gsd-sdk query state.load
  gsd-sdk query config-get workflow.tdd_mode
  gsd-sdk query frontmatter.get .planning/phases/1-PLAN.md --field status
  gsd-sdk query commit "Update roadmap"
  gsd-sdk query resolve-model gsd-planner
`.trim());
    return EXIT_OK;
  }

  if (args[0] === '--version' || args[0] === '-v') {
    console.log('gsd-sdk-generic 1.0.0');
    return EXIT_OK;
  }

  if (args[0] === 'query') {
    return routeQuery(args.slice(1));
  }

  console.error(`Unknown subcommand: ${args[0]}. Use "gsd-sdk query <command>".\n`);
  return EXIT_ERR;
}

process.exit(main());
