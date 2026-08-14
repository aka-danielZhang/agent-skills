#!/usr/bin/env node
/**
 * Sync `skills/dsh-harness-dev` against a DeepSeek Harness checkout.
 *
 * What it does on each run:
 *  1. Locate the checkout (`DSH_CHECKOUT` env, then the default path).
 *  2. Inventory `$DSH/docs` (non-zh Markdown, excluding `i18n/`), hashing each file.
 *  3. Diff against `skills/dsh-harness-dev/upstream-state.json` (added/removed/changed).
 *  4. Regenerate the `GENERATED:doc-index` region of `references/doc-map.md`.
 *  5. Verify every `docs/...md` path cited in the hand-maintained tables still exists.
 *  6. On real change: bump the SKILL.md `version` patch segment and commit (unless `--no-commit`).
 *
 * Exit codes: 0 = up to date or synced cleanly; 2 = synced but cited docs are missing
 * (fix the hand-maintained tables); 1 = error (e.g. checkout not found).
 */
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = dirname(dirname(fileURLToPath(import.meta.url)))
const SKILL_DIR = join(REPO, 'skills/dsh-harness-dev')
const DOC_MAP = join(SKILL_DIR, 'references/doc-map.md')
const SKILL_MD = join(SKILL_DIR, 'SKILL.md')
const STATE_FILE = join(SKILL_DIR, 'upstream-state.json')
const DEFAULT_CHECKOUT = join(homedir(), 'workspace/coding-study/deepseek-harness')
const OFFICIAL_UPSTREAM = 'https://github.com/deepseek-ai/deepseek-harness'
const BEGIN = '<!-- BEGIN GENERATED:doc-index (scripts/update-check.mjs) — do not edit -->'
const END = '<!-- END GENERATED:doc-index -->'
const noCommit = process.argv.includes('--no-commit')

const fail = (msg) => { console.error(`error: ${msg}`); process.exit(1) }
const git = (cwd, ...args) => execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8' }).trim()

/** Resolve the harness checkout: env override first, then the default path. */
function resolveCheckout() {
  for (const candidate of [process.env.DSH_CHECKOUT, DEFAULT_CHECKOUT].filter(Boolean)) {
    if (existsSync(join(candidate, 'docs/architecture.md'))) return candidate
  }
  return undefined
}

/** Collect non-zh Markdown under docs/, excluding the i18n/ infrastructure tree. */
function inventoryDocs(docsDir) {
  const out = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (entry.name !== 'i18n') walk(join(dir, entry.name))
      } else if (entry.name.endsWith('.md') && !entry.name.endsWith('.zh.md')) {
        out.push(join(dir, entry.name))
      }
    }
  }
  walk(docsDir)
  return out.sort()
}

/** First `# ` heading of a doc page, stripped of the language-switcher suffix. */
function docTitle(file) {
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (line.startsWith('# ')) {
      return line.slice(2).replace(/\s*(English|\[中文\].*)$/, '').trim()
    }
  }
  return '(no title)'
}

/** Render the generated index region body. */
function renderIndex(docsDir, relPaths, upstreamUrl, sha, commitDate) {
  const lines = [
    `上游：${upstreamUrl} @ ${sha.slice(0, 10)}（${commitDate.slice(0, 10)}）；由 scripts/update-check.mjs 生成，勿手改本区。`,
    '',
  ]
  const byDir = new Map()
  for (const rel of relPaths) {
    const dir = dirname(rel) === '.' ? '' : dirname(rel)
    if (!byDir.has(dir)) byDir.set(dir, [])
    byDir.get(dir).push(rel)
  }
  const groups = [...byDir.keys()].sort((a, b) => (a === '' ? -1 : b === '' ? 1 : a.localeCompare(b)))
  for (const dir of groups) {
    lines.push(dir === '' ? '### 顶层' : `### ${dir}/`)
    for (const rel of byDir.get(dir)) lines.push(`- \`${rel}\` — ${docTitle(join(docsDir, rel))}`)
    lines.push('')
  }
  return lines.join('\n').trimEnd()
}

/** Paths cited as inline code ending in .md in the hand-maintained region (outside the generated block). */
function citedDocs(markdown) {
  const hand = markdown.split(BEGIN)[0]
  return [...hand.matchAll(/`([^`\n]+\.md)`/g)].map((m) => m[1])
    .filter((p) => !p.startsWith('/') && !p.includes('://') && !p.split('/').pop().startsWith('.'))
}

const checkout = resolveCheckout()
if (!checkout) {
  fail(`harness checkout not found — set DSH_CHECKOUT or clone ${OFFICIAL_UPSTREAM} to ${DEFAULT_CHECKOUT}`)
}
const docsDir = join(checkout, 'docs')
const sha = git(checkout, 'rev-parse', 'HEAD')
const commitDate = git(checkout, 'log', '-1', '--format=%cI')
let upstreamUrl = OFFICIAL_UPSTREAM
try { upstreamUrl = git(checkout, 'remote', 'get-url', 'origin') } catch { /* no remote: keep official */ }

const files = inventoryDocs(docsDir)
const current = {}
for (const f of files) current[relative(docsDir, f)] = createHash('sha256').update(readFileSync(f)).digest('hex').slice(0, 16)

const old = existsSync(STATE_FILE) ? JSON.parse(readFileSync(STATE_FILE, 'utf8')) : undefined
const bootstrap = old === undefined
const prev = bootstrap ? {} : old.docs ?? {}
const added = Object.keys(current).filter((k) => !(k in prev))
const removed = Object.keys(prev).filter((k) => !(k in current))
const changed = Object.keys(current).filter((k) => k in prev && prev[k] !== current[k])
const shaMoved = !bootstrap && old.commit !== sha

const newBlock = `${BEGIN}\n${renderIndex(docsDir, Object.keys(current), upstreamUrl, sha, commitDate)}\n${END}`
const docMapText = readFileSync(DOC_MAP, 'utf8')
const beginIdx = docMapText.indexOf(BEGIN)
const endIdx = docMapText.indexOf(END)
if (beginIdx === -1 || endIdx === -1) fail(`generated markers missing in ${DOC_MAP}`)
const regenerated = docMapText.slice(0, beginIdx) + newBlock + docMapText.slice(endIdx + END.length)

const indexChanged = regenerated !== docMapText
const broken = [...new Set(citedDocs(docMapText))].filter((p) => !existsSync(join(docsDir, p)))

if (!bootstrap && !shaMoved && added.length + removed.length + changed.length === 0 && !indexChanged) {
  console.log(`up to date: upstream ${sha.slice(0, 10)}, ${files.length} docs unchanged`)
  process.exit(broken.length ? 2 : 0)
}

writeFileSync(DOC_MAP, regenerated)
writeFileSync(STATE_FILE, `${JSON.stringify({
  upstream: upstreamUrl,
  commit: sha,
  commitDate,
  syncedAt: new Date().toISOString(),
  docs: current,
}, null, 2)}\n`)

// Real content change (not a first run): bump the patch segment of the skill version.
if (!bootstrap && (added.length + removed.length + changed.length > 0 || indexChanged)) {
  const skillText = readFileSync(SKILL_MD, 'utf8')
  const bumped = skillText.replace(/^version: (\d+)\.(\d+)\.(\d+)$/m, (_m, maj, min, pat) => `version: ${maj}.${min}.${Number(pat) + 1}`)
  if (bumped === skillText && !/^version:/m.test(skillText)) {
    fail('SKILL.md has no version field — add `version: x.y.z` to frontmatter')
  }
  writeFileSync(SKILL_MD, bumped)
}

const summary = bootstrap
  ? `bootstrapped: ${files.length} docs indexed from upstream ${sha.slice(0, 10)}`
  : `synced: upstream ${old.commit.slice(0, 10)} -> ${sha.slice(0, 10)}; +${added.length} / ~${changed.length} / -${removed.length}`
console.log(summary)

if (!noCommit) {
  mkdirSync(join(REPO, '.tmp'), { recursive: true })
  git(REPO, 'add', 'skills/dsh-harness-dev')
  if (git(REPO, 'status', '--porcelain', '--', 'skills/dsh-harness-dev') !== '') {
    git(REPO, '-c', 'user.name=agent-skills-sync', '-c', 'user.email=sync@agent-skills.local',
      'commit', '-m', `sync(dsh-harness-dev): upstream ${sha.slice(0, 10)} (+${added.length}/~${changed.length}/-${removed.length})`)
    console.log(`committed: ${git(REPO, 'log', '-1', '--format=%h %s')}`)
  }
}
if (broken.length) {
  console.warn('warning: cited docs no longer exist upstream — update the hand-maintained tables:')
  for (const p of broken) console.warn(`  - ${p}`)
  process.exit(2)
}
