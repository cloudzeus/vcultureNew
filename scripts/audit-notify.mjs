#!/usr/bin/env node
/**
 * Dependency health notifier.
 *
 * Runs `npm audit` (vulnerabilities) and a lockfile-only dry-run install
 * (deprecation warnings), then emails a summary via Mailgun when anything
 * needs attention.
 *
 * Run with Node's native env loading (no dotenv dependency):
 *   node --env-file=.env scripts/audit-notify.mjs
 *
 * Required env: MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_ENDPOINT,
 *               MAILGUN_ALERT_TO, MAILGUN_ALERT_FROM
 *
 * Flags:
 *   --always   send an email even when nothing is wrong (useful for testing)
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const ALWAYS = process.argv.includes('--always');

// execFile resolves only on exit 0; `npm audit` exits non-zero when vulns
// exist. Capture stdout regardless of exit code.
async function run(cmd, args) {
  try {
    const { stdout, stderr } = await exec(cmd, args, { maxBuffer: 32 * 1024 * 1024 });
    return { stdout, stderr };
  } catch (err) {
    return { stdout: err.stdout ?? '', stderr: err.stderr ?? '' };
  }
}

async function getVulnerabilities() {
  const { stdout } = await run('npm', ['audit', '--json']);
  try {
    const data = JSON.parse(stdout);
    const meta = data.metadata?.vulnerabilities ?? {};
    const total = meta.total ?? 0;
    const advisories = Object.values(data.vulnerabilities ?? {}).map((v) => ({
      name: v.name,
      severity: v.severity,
      range: v.range,
      via: (Array.isArray(v.via) ? v.via : [])
        .map((x) => (typeof x === 'object' ? x.title : x))
        .filter(Boolean),
    }));
    return { total, counts: meta, advisories };
  } catch {
    return { total: 0, counts: {}, advisories: [] };
  }
}

async function getDeprecations() {
  // A lockfile-only dry run touches nothing on disk but still emits
  // "npm warn deprecated <pkg>@<ver>: <reason>" lines for deprecated installs.
  const { stderr } = await run('npm', [
    'install',
    '--package-lock-only',
    '--dry-run',
    '--no-audit',
    '--no-fund',
  ]);
  const seen = new Map();
  for (const line of stderr.split('\n')) {
    const m = line.match(/deprecated\s+(\S+):\s*(.*)$/i);
    if (m) seen.set(m[1], (m[2] || '').trim());
  }
  return [...seen.entries()].map(([pkg, reason]) => ({ pkg, reason }));
}

function buildEmail({ vulns, deprecations }) {
  const lines = [];
  lines.push(`Project: ${process.env.npm_package_name || 'vcultureNew'}`);
  lines.push(`Checked: ${new Date().toISOString()}`);
  lines.push('');

  if (vulns.total > 0) {
    const c = vulns.counts;
    lines.push(`⚠️  ${vulns.total} vulnerabilities (` +
      `critical: ${c.critical || 0}, high: ${c.high || 0}, ` +
      `moderate: ${c.moderate || 0}, low: ${c.low || 0})`);
    for (const a of vulns.advisories) {
      lines.push(`  • [${a.severity}] ${a.name} ${a.range}`);
      for (const t of a.via.slice(0, 3)) lines.push(`      - ${t}`);
    }
    lines.push('');
  } else {
    lines.push('✅ No known vulnerabilities.');
    lines.push('');
  }

  if (deprecations.length > 0) {
    lines.push(`⚠️  ${deprecations.length} deprecated package(s):`);
    for (const d of deprecations) {
      lines.push(`  • ${d.pkg}${d.reason ? ` — ${d.reason}` : ''}`);
    }
  } else {
    lines.push('✅ No deprecated packages.');
  }

  return lines.join('\n');
}

async function sendMail(subject, text) {
  const { MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_ENDPOINT, MAILGUN_ALERT_TO, MAILGUN_ALERT_FROM } = process.env;
  const missing = ['MAILGUN_API_KEY', 'MAILGUN_DOMAIN', 'MAILGUN_ENDPOINT', 'MAILGUN_ALERT_TO', 'MAILGUN_ALERT_FROM']
    .filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing env vars: ${missing.join(', ')}`);
  }

  // Accept an endpoint with or without the /v3/<domain>/messages suffix.
  const base = MAILGUN_ENDPOINT.replace(/\/+$/, '');
  const url = /\/messages$/.test(base) ? base : `${base}/v3/${MAILGUN_DOMAIN}/messages`;

  const form = new URLSearchParams();
  form.set('from', MAILGUN_ALERT_FROM);
  form.set('to', MAILGUN_ALERT_TO);
  form.set('subject', subject);
  form.set('text', text);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Mailgun ${res.status}: ${await res.text()}`);
  }
}

async function main() {
  const [vulns, deprecations] = await Promise.all([getVulnerabilities(), getDeprecations()]);
  const needsAttention = vulns.total > 0 || deprecations.length > 0;

  const body = buildEmail({ vulns, deprecations });
  console.log(body);

  if (!needsAttention && !ALWAYS) {
    console.log('\nNothing to report — no email sent.');
    return;
  }

  const subject = needsAttention
    ? `[npm-audit] ${vulns.total} vuln(s), ${deprecations.length} deprecated — vcultureNew`
    : '[npm-audit] All clear — vcultureNew';

  await sendMail(subject, body);
  console.log(`\n📧 Alert sent to ${process.env.MAILGUN_ALERT_TO}`);
}

main().catch((err) => {
  console.error('audit-notify failed:', err.message);
  process.exit(1);
});
