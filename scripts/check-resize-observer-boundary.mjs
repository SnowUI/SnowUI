import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(repoRoot, "..");
const observerPath = resolve(repoRoot, "src/logic/observer.svelte.ts");
const scanRoots = [
    resolve(repoRoot, "src"),
    resolve(workspaceRoot, "site/src"),
    resolve(workspaceRoot, "playground/test"),
].filter((path) => {
    try {
        return statSync(path).isDirectory();
    } catch {
        return false;
    }
});

function* walk(directory) {
    for (const entry of readdirSync(directory)) {
        const path = join(directory, entry);
        const stat = statSync(path);
        if (stat.isDirectory()) yield* walk(path);
        else if (/\.(svelte|ts)$/.test(entry)) yield path;
    }
}

const violations = [];
for (const root of scanRoots) {
    for (const path of walk(root)) {
        if (resolve(path) === observerPath) continue;
        const source = readFileSync(path, "utf8");
        if (/\bnew\s+ResizeObserver\s*\(/.test(source)) {
            violations.push(relative(workspaceRoot, path));
        }
    }
}

if (violations.length > 0) {
    throw new Error(
        `ResizeObserver 只能由 components/src/logic/observer.svelte.ts 创建：\n${violations.map((path) => `- ${path}`).join("\n")}`,
    );
}

const source = readFileSync(observerPath, "utf8");
const compiled = ts.transpileModule(source, {
    compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
    },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`;

const originalResizeObserver = globalThis.ResizeObserver;
const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;

try {
    delete globalThis.ResizeObserver;
    const { resizeManager } = await import(moduleUrl);
    const missingCleanup = resizeManager.watch({}, () => {});
    if (typeof missingCleanup !== "function") {
        throw new Error("ResizeObserver 缺失时必须返回无操作 cleanup。");
    }

    let instance;
    let disconnectCount = 0;
    let unobserveCount = 0;
    const scheduledFrames = [];
    globalThis.requestAnimationFrame = (callback) => {
        scheduledFrames.push(callback);
        return scheduledFrames.length;
    };
    globalThis.cancelAnimationFrame = () => {};
    globalThis.ResizeObserver = class {
        constructor(callback) {
            this.callback = callback;
            instance = this;
        }
        observe() {}
        unobserve() {
            unobserveCount += 1;
        }
        disconnect() {
            disconnectCount += 1;
        }
    };

    const node = {};
    const delivered = [];
    const cleanup = resizeManager.watch(node, (entry) => delivered.push(entry));
    const firstEntry = { target: node, contentRect: { width: 100, height: 40 } };
    const latestEntry = { target: node, contentRect: { width: 120, height: 40 } };
    instance.callback([firstEntry]);
    instance.callback([latestEntry]);
    if (delivered.length !== 0 || scheduledFrames.length !== 1) {
        throw new Error("ResizeObserver 通知必须合并到单一动画帧后交付。");
    }
    scheduledFrames.shift()(0);
    if (delivered.length !== 1 || delivered[0] !== latestEntry) {
        throw new Error("同一元素在一帧内只应交付最新尺寸通知。");
    }
    cleanup();
    cleanup();
    if (unobserveCount !== 1 || disconnectCount !== 1) {
        throw new Error("最后一个监听移除后必须且只能清理一次 Observer。");
    }

    globalThis.ResizeObserver = class {
        constructor() {
            throw new Error("init failed");
        }
    };
    const failedCleanup = resizeManager.watch({}, () => {});
    if (typeof failedCleanup !== "function") {
        throw new Error("ResizeObserver 初始化失败时必须返回无操作 cleanup。");
    }
} finally {
    if (originalResizeObserver === undefined) delete globalThis.ResizeObserver;
    else globalThis.ResizeObserver = originalResizeObserver;
    if (originalRequestAnimationFrame === undefined) delete globalThis.requestAnimationFrame;
    else globalThis.requestAnimationFrame = originalRequestAnimationFrame;
    if (originalCancelAnimationFrame === undefined) delete globalThis.cancelAnimationFrame;
    else globalThis.cancelAnimationFrame = originalCancelAnimationFrame;
}

console.log("ResizeObserver SSR、退化、按帧交付和唯一入口检查通过。");
