import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function* walkFiles(dir, exts) {
    let entries;
    try { entries = readdirSync(dir); } catch { return; }
    for (const entry of entries) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) yield* walkFiles(full, exts);
        else if (exts.some((ext) => full.endsWith(ext))) yield full;
    }
}

const patterns = [
    /import\s+.*\bFramePro\b/,
    /import\s+.*\bFlowText\b/,
    /import\s+.*\bImageViewer\b/,
    /import\s+.*\bField\b/,
    /import\s+.*\bSplitText\b/,
    /import\s+.*\bAnimatePresence\b/,
    /from\s+['"].*\/(frame-state|frame-motion|frame-orchestrator|frame-scale-observer|frame-scale-resolver|frame-perception|frame-actions|frame-class-state|frame-inline-style|motion-engine|motion-orchestration|timeline|overlay-scrollbar|split-pane)['"]/,
    /from\s+['"]@snowui-design-system\/components-pro['"]/,
];

let failed = false;
for (const file of walkFiles("src", [".ts", ".svelte", ".js"])) {
    if (file.includes(".test.") || file.includes("/demo/") || file.includes("/playground/")) continue;
    const source = readFileSync(file, "utf8");
    for (const pattern of patterns) {
        const match = source.match(pattern);
        if (!match) continue;
        console.error(`❌ PRO leak: ${pattern.source} matched in ${file}\n   → ${match[0].trim()}`);
        failed = true;
    }
}

if (!failed) console.log("✅ no PRO leaks detected in @snowui-design-system/components src");
process.exit(failed ? 1 : 0);
