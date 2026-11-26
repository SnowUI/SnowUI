#!/usr/bin/env node
// Portable zero-dependency linkage impact analyzer, on-touch rule state reconciler, and uncovered-coupling detector.
// Canonical source lives in brain/bin/sync-impact.mjs and is distributed verbatim to standalone projects.
// Read-only by design: executes zero tests, zero builds, and zero file writes.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SKIP_WALK_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  'vendor',
  'raw-assets',
  'assets',
  'history',
  'tmp',
  'logs',
  'cases',
  'unpacked',
  '__pycache__',
]);

function parseArgs(argv) {
  const opts = { scope: '', rawFiles: [], coverage: false, status: false, json: false, lang: '', help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--coverage') opts.coverage = true;
    else if (a === '--status') opts.status = true;
    else if (a === '--json') opts.json = true;
    else if (a === '--lang' && i + 1 < argv.length) opts.lang = argv[++i];
    else if (a === '--english' || a === '--en') opts.lang = 'en';
    else if (a === '--help' || a === '-h') opts.help = true;
    else if (a === '--files' || a === '-f') {
      while (i + 1 < argv.length && !argv[i + 1].startsWith('-')) {
        opts.rawFiles.push(argv[++i]);
      }
    } else if (!a.startsWith('-') && !opts.scope) {
      opts.scope = a.replace(/\/+$/, '');
    }
  }
  return opts;
}

function globToRegExp(pattern) {
  let expr = '';
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (ch === '*') {
      if (pattern[i + 1] === '*') {
        if (pattern[i + 2] === '/') {
          expr += '(?:.+/)?';
          i += 2;
        } else {
          expr += '.*';
          i += 1;
        }
      } else {
        expr += '[^/]*';
      }
    } else if (ch === '?') {
      expr += '[^/]';
    } else if (ch === '{') {
      const close = pattern.indexOf('}', i);
      if (close > i) {
        const alts = pattern
          .slice(i + 1, close)
          .split(',')
          .map(s => s.replace(/[.+^$()|[\]\\]/g, '\\$&'));
        expr += `(?:${alts.join('|')})`;
        i = close;
      } else {
        expr += '\\{';
      }
    } else if ('.+^$()|[]\\'.includes(ch)) {
      expr += '\\' + ch;
    } else {
      expr += ch;
    }
  }
  return new RegExp(`^${expr}$`);
}

function prefixPattern(pat, basePrefix) {
  if (!basePrefix || !pat) return pat;
  if (pat.startsWith('{dir}') || pat.startsWith('{rel}')) return pat;
  return `${basePrefix}/${pat}`;
}

function mapHubTriggerToProject(tr, projRel) {
  if (tr.startsWith(projRel + '/')) return tr.slice(projRel.length + 1);
  if (tr === '*/AGENTS.md') return 'AGENTS.md';
  if (tr === '*/*/AGENTS.md') return '*/AGENTS.md';
  if (tr === '*/sync-manifest.json') return 'sync-manifest.json';
  if (tr === '*/scripts/sync-impact.mjs') return 'scripts/sync-impact.mjs';
  return null;
}

function discoverUpstreamContext(primaryBaseDir, primaryData) {
  const hints = { upstreamHubRel: '', parentWorkspaceRel: '', mountedSpec: null };

  if (primaryData.upstreamHub) {
    const hubFile = path.resolve(primaryBaseDir, primaryData.upstreamHub);
    if (fs.existsSync(hubFile)) {
      const hubRel = path.relative(primaryBaseDir, hubFile).split(path.sep).join('/');
      hints.upstreamHubRel = hubRel;
      try {
        const hubData = JSON.parse(fs.readFileSync(hubFile, 'utf8'));
        const hubRootDir = path.resolve(path.dirname(hubFile), hubData.hubRoot || '..');
        const projRel = path.relative(hubRootDir, primaryBaseDir).split(path.sep).join('/');
        if (projRel && !projRel.startsWith('..')) {
          const mappedPoints = [];
          for (const pt of hubData.points ?? []) {
            const localTriggers = (pt.triggers ?? [])
              .map(t => mapHubTriggerToProject(t, projRel))
              .filter(Boolean);
            if (!localTriggers.length) continue;
            const localCompanions = (pt.companions ?? []).map(c => {
              if (c.startsWith('{dir}') || c.startsWith('{rel}')) return c;
              return path.relative(primaryBaseDir, path.join(hubRootDir, c)).split(path.sep).join('/');
            });
            const localAuth = pt.authorityDoc
              ? path.relative(primaryBaseDir, path.join(hubRootDir, pt.authorityDoc)).split(path.sep).join('/')
              : '';
            mappedPoints.push({
              ...pt,
              triggers: localTriggers,
              companions: localCompanions,
              authorityDoc: localAuth,
              isUpstreamMounted: true,
            });
          }
          if (mappedPoints.length) {
            hints.mountedSpec = {
              manifestFile: hubFile,
              manifestRel: hubRel,
              ownerDir: primaryBaseDir,
              basePrefix: '',
              isUpstreamMounted: true,
              data: {
                scope: hubData.scope ?? 'brain',
                language: primaryData.language ?? 'zh',
                points: mappedPoints,
              },
            };
          }
        }
      } catch {}
    }
  } else if (primaryData.standaloneRepoOnly) {
    const parentWs = path.resolve(primaryBaseDir, '../sync-manifest.json');
    const grandBrain = path.resolve(primaryBaseDir, '../../brain/sync-manifest.json');
    const grandLegacy = path.resolve(primaryBaseDir, '../../linkage/sync-manifest.json');
    if (fs.existsSync(parentWs)) hints.parentWorkspaceRel = '../sync-manifest.json';
    if (fs.existsSync(grandBrain)) hints.upstreamHubRel = '../../brain/sync-manifest.json';
    else if (fs.existsSync(grandLegacy)) hints.upstreamHubRel = '../../linkage/sync-manifest.json';
  }

  return hints;
}

function resolveRuntimeContext() {
  const scriptPath = path.resolve(fileURLToPath(import.meta.url));
  const ownerDir = path.resolve(path.dirname(scriptPath), '..');
  const ownerManifestFile = path.join(ownerDir, 'sync-manifest.json');
  const cwdManifestFile = path.join(process.cwd(), 'sync-manifest.json');
  const primaryManifestFile = fs.existsSync(ownerManifestFile)
    ? ownerManifestFile
    : (fs.existsSync(cwdManifestFile) ? cwdManifestFile : '');

  if (!primaryManifestFile) {
    return { rootDir: ownerDir, isHub: false, upstreamHints: {}, manifestSpecs: [] };
  }

  const primaryData = JSON.parse(fs.readFileSync(primaryManifestFile, 'utf8'));
  const primaryBaseDir = path.dirname(primaryManifestFile);

  if (primaryData.hubRoot) {
    const candidateHub = path.resolve(primaryBaseDir, primaryData.hubRoot);
    if (candidateHub !== primaryBaseDir && fs.existsSync(path.join(candidateHub, 'AGENTS.md'))) {
      const specs = [
        {
          manifestFile: primaryManifestFile,
          manifestRel: path.relative(candidateHub, primaryManifestFile).split(path.sep).join('/'),
          ownerDir: candidateHub,
          basePrefix: '',
          data: primaryData,
        },
      ];
      const hubOwnerName = path.basename(primaryBaseDir);
      for (const entry of fs.readdirSync(candidateHub, { withFileTypes: true })) {
        if (!entry.isDirectory() || entry.name.startsWith('.') || entry.name === hubOwnerName) continue;
        const childManifest = path.join(candidateHub, entry.name, 'sync-manifest.json');
        if (!fs.existsSync(childManifest)) continue;
        const childData = JSON.parse(fs.readFileSync(childManifest, 'utf8'));
        if (childData.standaloneRepoOnly) continue;
        specs.push({
          manifestFile: childManifest,
          manifestRel: `${entry.name}/sync-manifest.json`,
          ownerDir: path.join(candidateHub, entry.name),
          basePrefix: entry.name,
          data: childData,
        });
      }
      return { rootDir: candidateHub, isHub: true, upstreamHints: {}, manifestSpecs: specs };
    }
  }

  const upstreamHints = discoverUpstreamContext(primaryBaseDir, primaryData);
  const specs = [
    {
      manifestFile: primaryManifestFile,
      manifestRel: 'sync-manifest.json',
      ownerDir: primaryBaseDir,
      basePrefix: '',
      data: primaryData,
    },
  ];
  if (upstreamHints.mountedSpec) {
    specs.push(upstreamHints.mountedSpec);
  }

  return {
    rootDir: primaryBaseDir,
    isHub: false,
    upstreamHints,
    manifestSpecs: specs,
  };
}

function compileManifests(manifestSpecs) {
  return manifestSpecs.map(spec => {
    const { data, basePrefix, manifestRel, ownerDir } = spec;
    const allowPatterns = (data.standaloneAllowlist ?? []).map(p => prefixPattern(p, basePrefix));
    const genPatterns = (data.generatedGlobs ?? []).map(p => prefixPattern(p, basePrefix));
    const skipGitPrefixes = (data.skipGitDiscovery ?? []).map(p => prefixPattern(p, basePrefix));
    const coverageProbes = (data.coverageProbes ?? []).map(p => ({
      raw: p,
      resolved: prefixPattern(p, basePrefix),
    }));
    const subrepos = data.subrepos ?? [];

    const points = (data.points ?? []).map(pt => {
      const triggers = (pt.triggers ?? []).map(p => prefixPattern(p, basePrefix));
      const companions = (pt.companions ?? []).map(p => prefixPattern(p, basePrefix));
      return {
        ...pt,
        propagation: pt.propagation ?? 'immediate',
        scope: data.scope,
        manifestPath: manifestRel,
        ownerDir,
        basePrefix,
        subrepos,
        triggers,
        companions,
        authorityDoc: pt.authorityDoc ? prefixPattern(pt.authorityDoc, basePrefix) : '',
        triggerRegexes: triggers.map(globToRegExp),
      };
    });

    const ruleStates = (data.ruleStates ?? []).map(rule => {
      const compiledTargets = {};
      for (const [targetName, tInfo] of Object.entries(rule.targets ?? {})) {
        const rawGlob = tInfo.glob ?? `${targetName}/**`;
        const resolvedGlob = prefixPattern(rawGlob, basePrefix);
        compiledTargets[targetName] = {
          ...tInfo,
          rawGlob,
          resolvedGlob,
          globRegex: globToRegExp(resolvedGlob),
        };
      }
      return {
        ...rule,
        manifestPath: manifestRel,
        scope: data.scope,
        ownerDir,
        basePrefix,
        subrepos,
        authorityDoc: rule.authorityDoc ? prefixPattern(rule.authorityDoc, basePrefix) : '',
        compiledTargets,
      };
    });

    const sharedMirrors = (data.sharedMirrors ?? []).map(mirror => {
      const resolvedTargetGlob = prefixPattern(mirror.targetGlob ?? `${mirror.targetName}/**`, basePrefix);
      return {
        ...mirror,
        manifestPath: manifestRel,
        scope: data.scope,
        ownerDir,
        basePrefix,
        subrepos,
        resolvedTargetGlob,
        targetRegex: globToRegExp(resolvedTargetGlob),
        resolvedSourceDir: prefixPattern(mirror.sourceDir, basePrefix),
        resolvedDestDir: prefixPattern(mirror.destDir, basePrefix),
      };
    });

    return {
      path: manifestRel,
      scope: data.scope,
      language: data.language ?? 'zh',
      standaloneRepoOnly: Boolean(data.standaloneRepoOnly),
      isUpstreamMounted: Boolean(spec.isUpstreamMounted),
      ownerDir,
      basePrefix,
      subrepos,
      skipGitPrefixes,
      coverageProbes,
      allowRegexes: allowPatterns.map(globToRegExp),
      generatedRegexes: genPatterns.map(globToRegExp),
      points,
      ruleStates,
      sharedMirrors,
    };
  });
}

function evaluateRuleTargetState(rule, tInfo) {
  const rev = Number(rule.revision ?? 1);
  const applied = Number(tInfo.appliedRevision ?? 0);
  const reverted = Boolean(tInfo.reverted);

  if (rule.status === 'cancelled') {
    if (applied === 0) {
      return { kind: 'UNAFFECTED', actionable: false, fromRev: 0, toRev: 0 };
    }
    if (reverted) {
      return { kind: 'REVERTED', actionable: false, fromRev: applied, toRev: 0 };
    }
    return { kind: 'PENDING_REVERT', actionable: true, fromRev: applied, toRev: 0 };
  }

  if (applied >= rev) {
    return { kind: 'ALIGNED', actionable: false, fromRev: applied, toRev: rev };
  }
  if (applied === 0) {
    return { kind: 'PENDING_FRESH', actionable: true, fromRev: 0, toRev: rev };
  }
  return { kind: 'PENDING_UPGRADE', actionable: true, fromRev: applied, toRev: rev };
}

function inspectMirrorDrift(rootDir, mirror) {
  const srcAbs = path.join(rootDir, mirror.resolvedSourceDir);
  const dstAbs = path.join(rootDir, mirror.resolvedDestDir);
  if (!fs.existsSync(srcAbs) || !fs.existsSync(dstAbs)) {
    return { skipped: true, driftedFiles: [] };
  }
  const driftedFiles = [];
  for (const fn of mirror.files ?? []) {
    const sFile = path.join(srcAbs, fn);
    const dFile = path.join(dstAbs, fn);
    if (!fs.existsSync(sFile)) continue;
    if (!fs.existsSync(dFile)) {
      driftedFiles.push(`${fn} (missing in target)`);
      continue;
    }
    if (!fs.readFileSync(sFile).equals(fs.readFileSync(dFile))) {
      driftedFiles.push(fn);
    }
  }
  return { skipped: false, driftedFiles };
}

function isAbsentOptionalSubrepo(resolvedPath, ownerDir, basePrefix, subrepos) {
  if (!subrepos || !subrepos.length) return false;
  let localRel = resolvedPath;
  if (basePrefix) {
    if (localRel === basePrefix) return false;
    if (!localRel.startsWith(basePrefix + '/')) return false;
    localRel = localRel.slice(basePrefix.length + 1);
  }
  for (const sub of subrepos) {
    if (localRel === sub || localRel.startsWith(sub + '/')) {
      if (!fs.existsSync(path.join(ownerDir, sub))) return true;
    }
  }
  return false;
}

function normalizeRel(inputPath, rootDir) {
  if (path.isAbsolute(inputPath)) {
    return path.relative(rootDir, inputPath).split(path.sep).join('/');
  }
  const clean = inputPath.replace(/^\.\/+/, '').replace(/\/+$/, '');
  if (fs.existsSync(path.join(rootDir, clean))) return clean;
  const rootBase = path.basename(rootDir);
  if (clean.startsWith(rootBase + '/')) {
    return clean.slice(rootBase.length + 1);
  }
  return path.relative(rootDir, path.resolve(rootDir, clean)).split(path.sep).join('/');
}

function discoverGitRepos(rootDir, manifests, scopeFilter) {
  const skipPrefixes = manifests.flatMap(m => m.skipGitPrefixes);
  const repos = [];

  function walk(absDir, relDir, depth) {
    if (relDir) {
      if (skipPrefixes.some(sp => relDir === sp || relDir.startsWith(sp + '/'))) return;
      if (
        scopeFilter &&
        !relDir.startsWith(scopeFilter + '/') &&
        relDir !== scopeFilter &&
        !scopeFilter.startsWith(relDir + '/')
      ) {
        return;
      }
    }
    if (fs.existsSync(path.join(absDir, '.git'))) {
      repos.push(relDir || '.');
    }
    if (depth >= 3) return;
    let entries = [];
    try {
      entries = fs.readdirSync(absDir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('.') || SKIP_WALK_DIRS.has(entry.name)) continue;
      const nextRel = relDir ? `${relDir}/${entry.name}` : entry.name;
      walk(path.join(absDir, entry.name), nextRel, depth + 1);
    }
  }

  walk(rootDir, '', 0);
  return repos;
}

function walkUntrackedFiles(absDir, relPrefix, sink, maxDepth = 4) {
  if (maxDepth < 0) return;
  let entries = [];
  try {
    entries = fs.readdirSync(absDir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.') || SKIP_WALK_DIRS.has(entry.name)) continue;
    const childAbs = path.join(absDir, entry.name);
    const childRel = `${relPrefix}/${entry.name}`;
    if (entry.isDirectory()) {
      if (fs.existsSync(path.join(childAbs, '.git'))) continue;
      walkUntrackedFiles(childAbs, childRel, sink, maxDepth - 1);
    } else if (entry.isFile()) {
      sink.add(childRel);
    }
  }
}

function collectDirtyFiles(rootDir, gitRepos) {
  const dirty = new Set();
  for (const repo of gitRepos) {
    const dir = repo === '.' ? rootDir : path.join(rootDir, repo);
    let out = '';
    try {
      out = execFileSync('git', ['-C', dir, 'status', '--porcelain', '--untracked-files=normal'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
    } catch {
      continue;
    }
    for (const rawLine of out.split('\n')) {
      if (!rawLine || rawLine.length < 4) continue;
      let subPath = rawLine.slice(3).trim();
      if (subPath.includes(' -> ')) subPath = subPath.split(' -> ').pop().trim();
      if (subPath.startsWith('"') && subPath.endsWith('"')) {
        try {
          subPath = JSON.parse(subPath);
        } catch {}
      }
      subPath = subPath.replace(/\/+$/, '');
      const fullRel = repo === '.' ? subPath : `${repo}/${subPath}`;
      const abs = path.join(rootDir, fullRel);
      if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
        if (!fs.existsSync(path.join(abs, '.git'))) {
          walkUntrackedFiles(abs, fullRel, dirty);
        }
      } else {
        dirty.add(fullRel);
      }
    }
  }
  return [...dirty].sort();
}

function expandTemplate(tpl, fileRel) {
  const dir = path.posix.dirname(fileRel);
  const name = path.posix.basename(fileRel);
  const ext = path.posix.extname(name);
  const stem = ext ? name.slice(0, -ext.length) : name;
  return tpl
    .replaceAll('{dir}', dir === '.' ? '' : dir)
    .replaceAll('{stem}', stem)
    .replaceAll('{name}', name)
    .replaceAll('{rel}', fileRel)
    .replace(/^\/+/, '');
}

function repoOwnerOf(fileRel, gitRepos) {
  const sorted = [...gitRepos].sort((a, b) => b.length - a.length);
  for (const r of sorted) {
    if (r === '.') continue;
    if (fileRel === r || fileRel.startsWith(r + '/')) return r;
  }
  const firstSeg = fileRel.split('/')[0];
  return firstSeg || '.';
}

function auditStaleManifestPaths(rootDir, manifests, scopeFilter) {
  const stale = [];
  for (const m of manifests) {
    if (m.isUpstreamMounted) continue;
    if (scopeFilter && m.basePrefix && !scopeFilter.startsWith(m.basePrefix) && !m.basePrefix.startsWith(scopeFilter)) {
      continue;
    }
    for (const pt of m.points) {
      if (pt.isUpstreamMounted) continue;
      for (const field of ['triggers', 'companions']) {
        for (const pat of pt[field] ?? []) {
          if (pat.includes('{dir}') || pat.includes('{stem}') || pat.includes('{rel}') || pat.includes('{name}')) {
            continue;
          }
          if (isAbsentOptionalSubrepo(pat, m.ownerDir, m.basePrefix, m.subrepos)) {
            continue;
          }
          if (!/[*?{]/.test(pat)) {
            if (!fs.existsSync(path.join(rootDir, pat))) {
              stale.push(`${m.path}#${pt.id} -> ${pat}`);
            }
          } else {
            const parts = [];
            for (const seg of pat.split('/')) {
              if (/[*?{]/.test(seg)) break;
              parts.push(seg);
            }
            if (parts.length) {
              const baseRel = parts.join('/');
              if (isAbsentOptionalSubrepo(baseRel, m.ownerDir, m.basePrefix, m.subrepos)) continue;
              if (!fs.existsSync(path.join(rootDir, baseRel))) {
                stale.push(`${m.path}#${pt.id} -> ${baseRel}/ (glob base missing)`);
              }
            }
          }
        }
      }
    }
  }
  return stale;
}

function collectOnTouchReconciliations(rootDir, scopedFiles, manifests) {
  const ruleDebts = [];
  const mirrorDebts = [];

  for (const m of manifests) {
    if (m.isUpstreamMounted) continue;
    for (const rule of m.ruleStates ?? []) {
      for (const [targetName, tInfo] of Object.entries(rule.compiledTargets)) {
        if (isAbsentOptionalSubrepo(tInfo.resolvedGlob, m.ownerDir, m.basePrefix, m.subrepos)) continue;
        const touched = scopedFiles.filter(f => tInfo.globRegex.test(f));
        if (!touched.length) continue;
        const evalState = evaluateRuleTargetState(rule, tInfo);
        if (evalState.actionable) {
          ruleDebts.push({
            manifestPath: m.path,
            ruleId: rule.ruleId,
            title: rule.title,
            status: rule.status,
            targetName,
            evalState,
            supersedes: rule.supersedes ?? '',
            desiredState: rule.desiredState ?? '',
            cancelledCleanup: rule.cancelledCleanup ?? '',
            authorityDoc: rule.authorityDoc ?? '',
            prevNote: tInfo.note ?? '',
            touchedSample: touched.slice(0, 4),
          });
        }
      }
    }

    for (const mirror of m.sharedMirrors ?? []) {
      if (isAbsentOptionalSubrepo(mirror.resolvedTargetGlob, m.ownerDir, m.basePrefix, m.subrepos)) continue;
      const touched = scopedFiles.filter(f => mirror.targetRegex.test(f));
      if (!touched.length) continue;
      const drift = inspectMirrorDrift(rootDir, mirror);
      if (!drift.skipped && drift.driftedFiles.length) {
        mirrorDebts.push({
          manifestPath: m.path,
          id: mirror.id,
          targetName: mirror.targetName,
          sourceDir: mirror.resolvedSourceDir,
          destDir: mirror.resolvedDestDir,
          driftedFiles: drift.driftedFiles,
          syncCommand: mirror.syncCommand ?? '',
        });
      }
    }
  }

  return { ruleDebts, mirrorDebts };
}

function collectHistoricalTraceHints(rootDir, scopedFiles, manifests, isHub) {
  if (!scopedFiles.length) return [];
  if (!isHub && manifests[0]?.standaloneRepoOnly) return [];

  const centralTraceFile = isHub
    ? path.join(rootDir, 'brain/records/traces.jsonl')
    : path.resolve(rootDir, '../brain/records/traces.jsonl');
  if (!fs.existsSync(centralTraceFile)) return [];

  let lines = [];
  try {
    lines = fs.readFileSync(centralTraceFile, 'utf8').split('\n');
  } catch {
    return [];
  }

  const localProjectName = isHub ? '' : path.basename(rootDir);
  const localScopeName = isHub ? '' : (manifests[0]?.scope ?? '');
  const hits = [];
  const seenIds = new Set();

  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    let entry;
    try {
      entry = JSON.parse(trimmed);
    } catch {
      continue;
    }
    if (!entry?.id || seenIds.has(entry.id) || !Array.isArray(entry.files)) continue;
    const entryProj = entry.project ?? '';
    if (!isHub && entryProj && entryProj !== localProjectName && entryProj !== localScopeName) continue;
    const basePrefix = isHub && entryProj && entryProj !== '.' ? entryProj : '';
    const compiled = entry.files.map(p => globToRegExp(prefixPattern(p, basePrefix)));
    const matched = scopedFiles.filter(f => compiled.some(rx => rx.test(f)));
    if (matched.length) {
      seenIds.add(entry.id);
      hits.push({
        id: entry.id,
        date: entry.date ?? '',
        category: entry.category ?? 'change',
        title: entry.title ?? '',
        why: entry.why ?? '',
        invariants: entry.invariants ?? '',
        rollback: entry.rollback ?? '',
        matchedFiles: matched.slice(0, 5),
      });
    }
  }
  return hits.reverse();
}

function analyze(rootDir, files, manifests, gitRepos, isHub, scopeFilter, lang) {
  const en = lang === 'en';
  const scopedFiles = scopeFilter
    ? files.filter(f => f === scopeFilter || f.startsWith(scopeFilter + '/'))
    : files;
  const dirtySet = new Set(files);
  const allPoints = manifests.flatMap(m => m.points);
  const allowRegexes = manifests.flatMap(m => m.allowRegexes);
  const generatedRegexes = manifests.flatMap(m => m.generatedRegexes);

  const isGenerated = fileRel =>
    fileRel.endsWith('.generated.json') || generatedRegexes.some(rx => rx.test(fileRel));

  const hitsByPoint = new Map();
  const coveredFiles = new Set();

  for (const file of scopedFiles) {
    for (const pt of allPoints) {
      if (pt.triggerRegexes.some(rx => rx.test(file))) {
        coveredFiles.add(file);
        if (!hitsByPoint.has(pt.id)) {
          hitsByPoint.set(pt.id, { point: pt, matchedFiles: [], companionStatus: new Map() });
        }
        const record = hitsByPoint.get(pt.id);
        record.matchedFiles.push(file);
        for (const tpl of pt.companions ?? []) {
          const resolved = expandTemplate(tpl, file);
          if (!resolved || resolved === file) continue;
          const skippedOptional = isAbsentOptionalSubrepo(resolved, pt.ownerDir, pt.basePrefix, pt.subrepos);
          const existsOnDisk = skippedOptional ? false : fs.existsSync(path.join(rootDir, resolved));
          const alsoModified = dirtySet.has(resolved);
          record.companionStatus.set(resolved, { existsOnDisk, alsoModified, skippedOptional });
        }
      }
    }
  }

  const onTouch = collectOnTouchReconciliations(rootDir, scopedFiles, manifests);
  const traceHints = collectHistoricalTraceHints(rootDir, scopedFiles, manifests, isHub);

  const evolveSignals = [];
  const staleRefs = auditStaleManifestPaths(rootDir, manifests, scopeFilter);
  if (staleRefs.length) {
    evolveSignals.push({
      code: 'STALE_MANIFEST_PATH',
      files: staleRefs,
      guidance: en
        ? 'Paths referenced in sync-manifest.json were renamed or removed. Update sync-manifest.json in the same task.'
        : '检测到 sync-manifest.json 中引用的文件或父目录已被重命名／移动／删除：必须同任务打开对应 sync-manifest.json 更新或清理该路径，防止联动链腐化失效！',
    });
  }

  const uncoveredFiles = scopedFiles.filter(f => {
    if (coveredFiles.has(f) || isGenerated(f)) return false;
    if (allowRegexes.some(rx => rx.test(f))) return false;
    if (f === 'scripts/trace.mjs' || f.endsWith('/scripts/trace.mjs') || f === 'scripts/sync-impact.mjs' || f.endsWith('/scripts/sync-impact.mjs')) return false;
    if (/\/docs\/history\//.test(f) || /^docs\/history\//.test(f)) return false;
    return true;
  });

  if (uncoveredFiles.length) {
    evolveSignals.push({
      code: 'UNCOVERED_FILES',
      files: uncoveredFiles.slice(0, 20),
      total: uncoveredFiles.length,
      guidance: en
        ? 'Changed files above did not match any linkage trigger. Check for downstream consumers; prefer L-Code single-source imports or register a linkage point in sync-manifest.json.'
        : '上述改动文件未命中任何 sync-manifest.json 触发器：请核查其是否存在跨文件／跨仓消费者；若有，优先收敛为 L-Code 单源或将其注册入对应项目的 sync-manifest.json。',
    });
  }

  const newSharedCandidates = scopedFiles.filter(
    f =>
      !isGenerated(f) &&
      !coveredFiles.has(f) &&
      /(?:^|\/)(?:config|shared|scripts|lib|logic|migrations|schema)\//.test(f)
  );
  if (newSharedCandidates.length) {
    evolveSignals.push({
      code: 'NEW_SHARED_OR_CONFIG_SOURCE',
      files: newSharedCandidates.slice(0, 15),
      guidance: en
        ? 'Uncovered shared/config/script/migration changes detected. Apply the L-Code -> L-Gen -> L-Rule hierarchy and register new couplings if multi-file sync is required.'
        : '检测到未纳管的共享层／配置／脚本／迁移路径变动：必须按 UpdateMechanism.md §1（L-Code → L-Gen → L-Rule）决定是否建立新更新机制。',
    });
  }

  if (isHub) {
    const touchedTopScopes = [
      ...new Set(
        scopedFiles
          .filter(f => !isGenerated(f) && f.includes('/'))
          .map(f => repoOwnerOf(f, gitRepos).split('/')[0])
      ),
    ].filter(s => s && s !== '.' && s !== 'docs' && s !== 'brain' && s !== 'linkage');
    const hasCrossProjectHit = [...hitsByPoint.values()].some(
      h => (h.point.scope === 'brain' || h.point.scope === 'linkage') && (h.point.id.startsWith('root.cross.') || h.point.id.startsWith('root.topology.'))
    );
    if (touchedTopScopes.length >= 2 && !hasCrossProjectHit) {
      evolveSignals.push({
        code: 'CROSS_PARTITION_COCHANGE',
        partitions: touchedTopScopes,
        guidance: en
          ? `Multiple top-level partitions (${touchedTopScopes.join(', ')}) changed without matching a cross-project contract. Register new cross-project dependencies in brain/sync-manifest.json if applicable.`
          : `当前同时改动了多个顶层项目分区（${touchedTopScopes.join(', ')}）且未命中跨项目联动契约：请核查是否诞生了新的跨项目依赖，若是请补入 brain/sync-manifest.json。`,
      });
    }
  }

  const targetManifests = [...new Set(manifests.map(m => m.path))];

  return {
    scannedCount: scopedFiles.length,
    gitRepoCount: gitRepos.length,
    targetManifests,
    onTouch,
    traceHints,
    hitPoints: [...hitsByPoint.values()],
    evolveSignals,
  };
}

function buildRuleStatusMatrix(rootDir, manifests, scopeFilter) {
  const rulesOut = [];
  const mirrorsOut = [];
  for (const m of manifests) {
    if (m.isUpstreamMounted) continue;
    if (scopeFilter && m.basePrefix && !scopeFilter.startsWith(m.basePrefix) && !m.basePrefix.startsWith(scopeFilter)) {
      continue;
    }
    for (const rule of m.ruleStates ?? []) {
      const targets = {};
      for (const [tName, tInfo] of Object.entries(rule.compiledTargets)) {
        if (isAbsentOptionalSubrepo(tInfo.resolvedGlob, m.ownerDir, m.basePrefix, m.subrepos)) {
          targets[tName] = { state: 'SKIPPED_ABSENT' };
          continue;
        }
        const ev = evaluateRuleTargetState(rule, tInfo);
        targets[tName] = {
          state: ev.kind,
          actionable: ev.actionable,
          appliedRevision: Number(tInfo.appliedRevision ?? 0),
          targetRevision: ev.toRev,
          reverted: Boolean(tInfo.reverted),
          updated: tInfo.updated ?? '',
        };
      }
      rulesOut.push({
        manifest: m.path,
        ruleId: rule.ruleId,
        title: rule.title,
        status: rule.status,
        revision: rule.revision,
        targets,
      });
    }
    for (const mirror of m.sharedMirrors ?? []) {
      if (isAbsentOptionalSubrepo(mirror.resolvedTargetGlob, m.ownerDir, m.basePrefix, m.subrepos)) continue;
      const drift = inspectMirrorDrift(rootDir, mirror);
      mirrorsOut.push({
        manifest: m.path,
        id: mirror.id,
        targetName: mirror.targetName,
        status: drift.skipped ? 'SKIPPED' : drift.driftedFiles.length ? 'MIRROR_DRIFT' : 'MIRROR_SYNCED',
        driftedFiles: drift.driftedFiles,
      });
    }
  }
  return { rules: rulesOut, sharedMirrors: mirrorsOut };
}

function formatStatusMatrix(matrix, lang) {
  const en = lang === 'en';
  const lines = [
    en
      ? '# On-Touch Rule Reconciliation & Shared Mirror Matrix'
      : '# 按需触达（On-Touch）通用规则版本与各实例对齐矩阵',
  ];
  if (!matrix.rules.length && !matrix.sharedMirrors.length) {
    lines.push(en ? '\n- No on-touch ruleStates or sharedMirrors registered in current scope.' : '\n- 当前范围未登记 on-touch 规则状态表或共享镜像检查。');
    return lines.join('\n') + '\n';
  }
  if (matrix.rules.length) {
    lines.push(en ? '\n## 1. Versioned Rule States (ruleStates)' : '\n## 一、通用规则版本与子实例状态矩阵（ruleStates）');
    for (const r of matrix.rules) {
      lines.push(`\n### [${r.ruleId}] ${r.title} (status=${r.status}, rev=${r.revision}, ${r.manifest})`);
      for (const [tName, st] of Object.entries(r.targets)) {
        if (st.state === 'SKIPPED_ABSENT') {
          lines.push(`- ${tName}: SKIPPED (repo absent)`);
        } else if (st.state === 'ALIGNED') {
          lines.push(`- ${tName}: ALIGNED ✓ (rev ${st.appliedRevision}/${st.targetRevision})`);
        } else if (st.state === 'UNAFFECTED') {
          lines.push(`- ${tName}: UNAFFECTED ✓ (appliedRevision=0, cancelled rule never applied)`);
        } else if (st.state === 'REVERTED') {
          lines.push(`- ${tName}: REVERTED ✓ (was rev ${st.appliedRevision}, cleanup completed)`);
        } else if (st.state === 'PENDING_FRESH') {
          lines.push(`- ${tName}: PENDING_FRESH ⏳ (rev 0 -> ${st.targetRevision}: apply latest desiredState on next touch)`);
        } else if (st.state === 'PENDING_UPGRADE') {
          lines.push(`- ${tName}: PENDING_UPGRADE ⏳ (rev ${st.appliedRevision} -> ${st.targetRevision}: upgrade superseded rule on next touch)`);
        } else if (st.state === 'PENDING_REVERT') {
          lines.push(`- ${tName}: PENDING_REVERT ⚠️ (rule cancelled, but target had rev ${st.appliedRevision}: revert on next touch)`);
        }
      }
    }
  }
  if (matrix.sharedMirrors.length) {
    lines.push(en ? '\n## 2. Shared Source Mirrors (sharedMirrors)' : '\n## 二、共享源码物理镜像状态（sharedMirrors）');
    for (const sm of matrix.sharedMirrors) {
      const detail = sm.driftedFiles.length ? ` -> drifted: ${sm.driftedFiles.join(', ')}` : '';
      lines.push(`- [${sm.id}] ${sm.targetName}: ${sm.status}${detail}`);
    }
  }
  return lines.join('\n') + '\n';
}

function runCoverageAudit(rootDir, manifests) {
  const allTriggerRx = manifests.flatMap(m => m.points.flatMap(p => p.triggerRegexes));
  const allAllowRx = manifests.flatMap(m => m.allowRegexes);
  const probes = [];
  for (const m of manifests) {
    for (const item of m.coverageProbes) {
      if (isAbsentOptionalSubrepo(item.resolved, m.ownerDir, m.basePrefix, m.subrepos)) continue;
      probes.push(item.resolved);
    }
  }
  const uniqueProbes = [...new Set(probes)];
  const covered = [];
  const missed = [];
  for (const probe of uniqueProbes) {
    if (allTriggerRx.some(rx => rx.test(probe)) || allAllowRx.some(rx => rx.test(probe))) covered.push(probe);
    else missed.push(probe);
  }
  const stale = auditStaleManifestPaths(rootDir, manifests, '');
  const totalPoints = manifests.reduce((sum, m) => sum + m.points.length, 0);
  const totalRuleStates = manifests.reduce((sum, m) => sum + (m.ruleStates?.length ?? 0), 0);
  return {
    manifests: manifests.length,
    totalLinkagePoints: totalPoints,
    totalTrackedRuleStates: totalRuleStates,
    probedKeyPaths: uniqueProbes.length,
    coveredCount: covered.length,
    coveragePercent: uniqueProbes.length ? Number(((covered.length / uniqueProbes.length) * 100).toFixed(1)) : 100,
    missedPaths: missed,
    staleManifestPaths: stale,
  };
}

function formatReport(report, modeLabel, lang, upstreamHints = {}) {
  const en = lang === 'en';
  const lines = [];
  const debtCount = (report.onTouch?.ruleDebts?.length ?? 0) + (report.onTouch?.mirrorDebts?.length ?? 0);
  const traceCount = report.traceHints?.length ?? 0;

  lines.push(
    en
      ? `# Linkage Impact & Blind-Spot Report (${modeLabel} · ${report.scannedCount} changed paths)`
      : `# 联动影响与盲区诊断报告 (${modeLabel} · 扫描 ${report.scannedCount} 个改动路径)`
  );

  if (report.gitRepoCount === 0 && report.scannedCount === 0) {
    lines.push(
      en
        ? '\n> Note: No .git repository detected in scan root. Pass `--files <path...>` to preview linkage chains in a gitless directory.'
        : '\n> 提示：当前目录为无 Git 模式，可使用 `--files <相对路径...>` 预演或核销指定文件的联动链。'
    );
  }

  if (!report.hitPoints.length && !report.evolveSignals.length && debtCount === 0 && traceCount === 0) {
    if (en) {
      lines.push('\n- Matched Linkage Points: None (no tracked cross-file changes or only allowlisted standalone/history files)');
      lines.push('- Blind-Spot & New Mechanism (L-Evolve): 0 uncovered couplings');
      if (upstreamHints.parentWorkspaceRel || upstreamHints.upstreamHubRel) {
        lines.push(
          `- Upstream Registries Detected on Disk: ${[upstreamHints.parentWorkspaceRel, upstreamHints.upstreamHubRel].filter(Boolean).join(', ')}`
        );
      }
    } else {
      lines.push('\n- 命中联动点：无（当前无受控跨处变更，或仅涉及豁免的独立指针／历史归档文件）');
      lines.push('- 盲区与新机制（L-Evolve）：0 未覆盖耦合');
      if (upstreamHints.upstreamHubRel) {
        const hubAgents = upstreamHints.upstreamHubRel.replace(/sync-manifest\.json$/, 'AGENTS.md');
        lines.push(
          `- 上层跨项目联动入口（已自动联通）：${upstreamHints.upstreamHubRel}（规范见 ${hubAgents}；本仓／组内耦合写 ./sync-manifest.json，跨顶层项目新耦合上浮写入 ${upstreamHints.upstreamHubRel}）`
        );
      }
    }
    return lines.join('\n') + '\n';
  }

  if (debtCount > 0) {
    lines.push(
      en
        ? `\n## 0. On-Touch Pending Rule & Mirror Reconciliation (${debtCount} items woken up by touched target)`
        : `\n## 零、顺路必办：当前触碰目标唤醒的挂起通用规则与共享镜像账单（共 ${debtCount} 项）`
    );
    for (const d of report.onTouch.ruleDebts) {
      const st = d.evalState;
      if (st.kind === 'PENDING_FRESH') {
        lines.push(
          en
            ? `- [${d.ruleId}] (${d.targetName} · PENDING_FRESH rev 0 -> ${st.toRev}): ${d.title}`
            : `- [${d.ruleId}]（目标：${d.targetName} · 新增待接入 rev 0 → ${st.toRev}）：${d.title}`
        );
        lines.push(
          en
            ? `  Desired State (apply latest v${st.toRev} directly, skipping any superseded revisions): ${d.desiredState}`
            : `  顺路要求（直接一步到位实施最新 rev ${st.toRev}，自动跳过任何中间旧版）：${d.desiredState}`
        );
      } else if (st.kind === 'PENDING_UPGRADE') {
        lines.push(
          en
            ? `- [${d.ruleId}] (${d.targetName} · PENDING_UPGRADE rev ${st.fromRev} -> ${st.toRev}): ${d.title}`
            : `- [${d.ruleId}]（目标：${d.targetName} · 规则覆盖升级 rev ${st.fromRev} → ${st.toRev}）：${d.title}`
        );
        if (d.supersedes) {
          lines.push(en ? `  Supersedes Note: ${d.supersedes}` : `  演进覆盖说明（本实例曾实施 rev ${st.fromRev}）：${d.supersedes}`);
        }
        lines.push(en ? `  New Desired State: ${d.desiredState}` : `  最新目标终态：${d.desiredState}`);
      } else if (st.kind === 'PENDING_REVERT') {
        lines.push(
          en
            ? `- [${d.ruleId}] (${d.targetName} · PENDING_REVERT — RULE CANCELLED, had rev ${st.fromRev}): ${d.title}`
            : `- [${d.ruleId}]（目标：${d.targetName} · 规则已取消，本实例曾实施 rev ${st.fromRev} 需顺路回退）：${d.title}`
        );
        lines.push(
          en
            ? `  Revert / Cleanup Action: ${d.cancelledCleanup || 'Revert prior changes from this cancelled rule and mark target aligned/reverted.'}`
            : `  顺路回退要求：${d.cancelledCleanup || '清理并撤回此前按旧版规则写入的逻辑，完成后运行 linkage-state.mjs align 标记 reverted'}`
        );
      }
      if (d.authorityDoc) {
        lines.push(en ? `  Authority Spec: ${d.authorityDoc}` : `  权威规范：${d.authorityDoc}`);
      }
      lines.push(
        en
          ? `  After completion: run linkage-state.mjs align --manifest ${d.manifestPath} --rule ${d.ruleId} --target "${d.targetName}" (if current task is a tiny doc/hotfix edit and scope is too large, ask Owner before skipping).`
          : `  核销方式：与当前任务一并完成后运行 linkage-state.mjs align --manifest ${d.manifestPath} --rule ${d.ruleId} --target "${d.targetName}"（若本次仅为纯文档修改或紧急微调不宜夹带大改，须先向 Owner 说明并请示是否继续挂起）。`
      );
    }

    for (const md of report.onTouch.mirrorDebts) {
      lines.push(
        en
          ? `- [MIRROR_DRIFT · ${md.id}] (${md.targetName}): Shared source ${md.sourceDir} has newer changes than ${md.destDir} [${md.driftedFiles.join(', ')}]${md.syncCommand ? ` -> Run: ${md.syncCommand}` : ''}`
          : `- [共享镜像待同步 · ${md.id}]（目标：${md.targetName}）：共享源 ${md.sourceDir} 已有更新尚未同步至 ${md.destDir} [${md.driftedFiles.join(', ')}]${md.syncCommand ? ` → 请顺路执行：${md.syncCommand}` : ''}`
      );
    }
  }

  if (traceCount > 0) {
    lines.push(
      en
        ? `\n## Historical Optimization & Root-Cause Invariants (${traceCount} matched trace records)`
        : `\n## 既往关键改动与防退化不变量提醒（命中 ${traceCount} 条 brain/records/traces.jsonl 记录）`
    );
    for (const tr of report.traceHints) {
      lines.push(
        en
          ? `- [${tr.id}] ${tr.title} (${tr.date} · ${tr.category}) -> ${tr.matchedFiles.join(', ')}`
          : `- [${tr.id}] ${tr.title}（${tr.date} · ${tr.category}）→ ${tr.matchedFiles.join(', ')}`
      );
      if (tr.why) lines.push(en ? `  Why: ${tr.why}` : `  历史改动背景：${tr.why}`);
      if (tr.invariants) lines.push(en ? `  Must Preserve: ${tr.invariants}` : `  严禁破坏的不变量：${tr.invariants}`);
      if (tr.rollback) lines.push(en ? `  Rollback / Isolate: ${tr.rollback}` : `  异常回退提示：${tr.rollback}`);
    }
  }

  lines.push(
    en
      ? `\n## 1. Matched Linkage Contracts (${report.hitPoints.length})`
      : `\n## 一、命中的逐点联动契约（共 ${report.hitPoints.length} 项）`
  );
  for (const { point, matchedFiles, companionStatus } of report.hitPoints) {
    lines.push(`\n### [${point.id}] ${point.title} (${point.tier} · propagation=${point.propagation})`);
    lines.push(
      en
        ? `- Triggered Files (${matchedFiles.length}): ${matchedFiles.slice(0, 6).join(', ')}${matchedFiles.length > 6 ? ` ...+${matchedFiles.length - 6}` : ''}`
        : `- 触发文件（${matchedFiles.length}）：${matchedFiles.slice(0, 6).join(', ')}${matchedFiles.length > 6 ? ` ...+${matchedFiles.length - 6}` : ''}`
    );
    lines.push(en ? `- Trigger Signal: ${point.triggerSignal}` : `- 触发语义：${point.triggerSignal}`);
    if (point.exemptWhen) {
      lines.push(en ? `- Exemption Boundary: ${point.exemptWhen}` : `- 豁免边界：${point.exemptWhen}`);
    }
    if (companionStatus.size) {
      const compItems = [...companionStatus.entries()].map(([file, st]) => {
        let tag;
        if (st.skippedOptional) tag = en ? 'SKIPPED (sibling repo absent)' : 'SKIPPED (未检出兄弟仓)';
        else if (st.alsoModified) tag = 'SYNCED ✓';
        else if (st.existsOnDisk) tag = 'PENDING ?';
        else tag = 'MISSING !';
        return `${file} [${tag}]`;
      });
      lines.push(
        en
          ? `- Companion Status: ${compItems.slice(0, 8).join(' | ')}${compItems.length > 8 ? ` ...+${compItems.length - 8}` : ''}`
          : `- 配对文件状态：${compItems.slice(0, 8).join(' | ')}${compItems.length > 8 ? ` ...+${compItems.length - 8}` : ''}`
      );
    }
    for (const act of point.immediate ?? []) {
      lines.push(en ? `- [Immediate Required] ${act}` : `- [即时必改] ${act}`);
    }
    for (const ot of point.onTouch ?? []) {
      lines.push(en ? `- [On-Touch Deferred Policy] ${ot}` : `- [按需触达挂起策略 on-touch] ${ot}`);
    }
    for (const ev of point.evaluated ?? []) {
      lines.push(
        en
          ? `- [Evaluated -> ${ev.target}] Rubric: ${ev.rubric}`
          : `- [主动评估 -> ${ev.target}] 标尺：${ev.rubric}`
      );
    }
    if ((point.mergeMain ?? []).length) {
      lines.push(
        en
          ? `- [Before Merge to main] ${point.mergeMain.join(' && ')}`
          : `- [合并 main 闭环] ${point.mergeMain.join(' && ')}`
      );
    }
    if (point.authorityDoc) {
      lines.push(en ? `- Authority Spec: ${point.authorityDoc}` : `- 权威规范：${point.authorityDoc}`);
    }
  }

  lines.push(
    en
      ? `\n## 2. Blind-Spot & Self-Evolution Checks (L-Evolve: ${report.evolveSignals.length} alerts)`
      : `\n## 二、盲区探测与新机制自演进自检（L-Evolve：${report.evolveSignals.length} 项自动告警）`
  );
  if (!report.evolveSignals.length) {
    lines.push(
      en
        ? '- Automated Path & Staleness Audit: 0 uncovered paths, 0 stale manifest paths'
        : '- 自动路径与陈旧性检测：0 未覆盖路径、0 失效注册路径'
    );
  } else {
    for (const sig of report.evolveSignals) {
      const detail = sig.files ? sig.files.join(', ') : (sig.partitions ?? []).join(', ');
      lines.push(`- [${sig.code}] ${detail}`);
      lines.push(en ? `  Action: ${sig.guidance}` : `  处置要求：${sig.guidance}`);
    }
  }

  if (en) {
    lines.push('- Manual Anti-Masking Review (update sync-manifest.json in the same task if any applies):');
    lines.push('  1) Introduced a duplicated constant, schema, port, env var, or digest across files that cannot yet be single-sourced via L-Code import;');
    lines.push('  2) Fixed a "changed A but forgot B" regression where B is not yet listed in immediate/evaluated;');
    lines.push('  3) Renamed, split, or removed an authoritative file referenced by an existing linkage chain.');
    if (upstreamHints.parentWorkspaceRel || upstreamHints.upstreamHubRel) {
      lines.push(
        `- Upstream Registries Detected on Disk: ${[upstreamHints.parentWorkspaceRel, upstreamHints.upstreamHubRel].filter(Boolean).join(', ')} (add multi-repo or cross-project linkage chains there when working in the full workspace)`
      );
    }
    lines.push('\n## 3. User-Facing Summary Hint (Keep It Conversational)');
    lines.push(
      `- Checked ${report.hitPoints.length} matched contract(s)${debtCount ? ` and ${debtCount} on-touch item(s)` : ''}; uncovered alerts: ${report.evolveSignals.length}.`
    );
    lines.push(
      '- When replying to the user, explain linkage outcomes in 1-2 short, natural sentences without pasting internal point IDs, enum tags, or bureaucratic receipt headers (record exact IDs only in task logs).'
    );
  } else {
    lines.push('- 防通配符遮蔽人工复核（即使命中通用路由通配符，出现以下任一情况仍须同任务更新注册表）：');
    lines.push('  1) 新建了跨前后端／跨脚本／跨数据库触发器共用的数值、枚举、端口、环境变量或摘要绑定（优先改 L-Code 单源导入，无法单源则入表）；');
    lines.push('  2) 修复了“改 A 漏改 B”型缺陷，且现有命中的联动点 immediate/evaluated 未点名 B 文件；');
    lines.push('  3) 修改了 on-touch 型通用规则（新增、覆盖升版或废止取消），须同步通过 linkage-state.mjs 更新 ruleStates[] 各实例状态。');
    if ((report.targetManifests ?? []).length) {
      lines.push(`- 当前生效的注册表入口：${report.targetManifests.join(', ')}（查看实例状态矩阵运行 --status，覆盖率自检运行 --coverage）`);
    }
    if (upstreamHints.upstreamHubRel) {
      const hubAgents = upstreamHints.upstreamHubRel.replace(/sync-manifest\.json$/, 'AGENTS.md');
      lines.push(
        `- 上层跨项目联动注册入口（已自动挂载）：本仓／组内新耦合写入 ./sync-manifest.json；若需建立跨顶层项目新联动链，直接上浮添加至 ${upstreamHints.upstreamHubRel}（规范见 ${hubAgents}）`
      );
    }
    lines.push('\n## 三、给用户的收尾汇报提示（必须用简洁自然的口语）');
    lines.push(
      `- 本次内部核对结果：命中 ${report.hitPoints.length} 项契约${debtCount ? `、唤醒 ${debtCount} 项顺路规则` : ''}，盲区告警 ${report.evolveSignals.length} 项（精确 ID 仅记入任务日志）。`
    );
    lines.push(
      '- 回复用户时：请用 1～2 句自然的日常口语顺带交代联动情况（如哪些关联文件已一并改好、哪些按约定留到下次碰对应项目时再改、有无遗漏关联处）；严禁照抄点位 ID、propagation 枚举、“联动核销回执”标题或 L-Evolve 等内部术语！'
    );
  }
  return lines.join('\n') + '\n';
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.log(
      'Usage:\n  node sync-impact.mjs [scope]\n  node sync-impact.mjs --files <path1> [path2...]\n  node sync-impact.mjs [scope] --status [--json]\n  node sync-impact.mjs --coverage [--json] [--lang en|zh]'
    );
    process.exit(0);
  }

  const ctx = resolveRuntimeContext();
  if (!ctx.manifestSpecs.length) {
    console.log('No sync-manifest.json found in current root; skipping linkage audit.');
    process.exit(0);
  }

  const manifests = compileManifests(ctx.manifestSpecs);
  const primaryLang = manifests[0]?.language ?? 'zh';
  const lang = opts.lang || primaryLang;

  if (opts.status) {
    const matrix = buildRuleStatusMatrix(ctx.rootDir, manifests, opts.scope);
    if (opts.json) console.log(JSON.stringify(matrix, null, 2));
    else process.stdout.write(formatStatusMatrix(matrix, lang));
    process.exit(0);
  }

  if (opts.coverage) {
    const cov = runCoverageAudit(ctx.rootDir, manifests.filter(m => !m.isUpstreamMounted));
    console.log(JSON.stringify(cov, null, 2));
    process.exit(cov.missedPaths.length || cov.staleManifestPaths.length ? 1 : 0);
  }

  const gitRepos = discoverGitRepos(ctx.rootDir, manifests, opts.scope);
  const files = opts.rawFiles.length
    ? opts.rawFiles.map(f => normalizeRel(f, ctx.rootDir))
    : collectDirtyFiles(ctx.rootDir, gitRepos);

  const en = lang === 'en';
  const modeLabel = opts.rawFiles.length
    ? (en ? 'Dry-Run --files' : '沙盘推演 --files')
    : opts.scope
      ? (en ? `Live Scan scope=${opts.scope}` : `实盘扫描 scope=${opts.scope}`)
      : ctx.isHub
        ? (en ? 'Workspace Hub Scan' : '全工作区跨项目聚合扫描')
        : ctx.upstreamHints.mountedSpec
          ? (en ? `Project Scan + Upstream Hub (${manifests[0].scope})` : `项目扫描 + 自动挂载上层跨仓契约 (${manifests[0].scope})`)
          : (en ? `Standalone Scan (${manifests[0].scope})` : `独立项目自治扫描 (${manifests[0].scope})`);

  const report = analyze(ctx.rootDir, files, manifests, gitRepos, ctx.isHub, opts.scope, lang);
  if (opts.json) console.log(JSON.stringify(report, null, 2));
  else process.stdout.write(formatReport(report, modeLabel, lang, ctx.upstreamHints));
}

main();
