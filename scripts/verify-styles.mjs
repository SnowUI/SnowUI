import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const required = [
    "src/styles/index.css",
    "src/styles/themes.css",
    "src/styles/components.css",
    "src/styles/auto-layout.css",
];

for (const file of required) {
    if (!existsSync(file)) {
        console.error(`❌ missing package style: ${file}`);
        process.exit(1);
    }
}

function* walk(dir) {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) yield* walk(full);
        else yield full;
    }
}

const forbidden = /snowui-components\.css|snowui-themes\.css|(?:\.\.\/){2,}styles(?:\/|\b)|\/Users\/yuan\/Project\/snowui\/styles\//;
for (const file of walk("src")) {
    if (!/\.(?:css|ts|js|mjs|svelte)$/.test(file)) continue;
    const source = readFileSync(file, "utf8");
    if (forbidden.test(source)) {
        console.error(`❌ external styles dependency found in ${file}`);
        process.exit(1);
    }
}

const index = readFileSync("src/styles/index.css", "utf8");
for (const importPath of ["./themes.css", "./components.css"]) {
    if (!index.includes(importPath)) {
        console.error(`❌ src/styles/index.css must import ${importPath}`);
        process.exit(1);
    }
}

const autoLayout = readFileSync("src/styles/auto-layout.css", "utf8");
if (!autoLayout.includes("@layer snowui-auto-layout")) {
    console.error("❌ auto-layout.css must stay in the snowui-auto-layout low-priority layer");
    process.exit(1);
}

const buttonGroup = readFileSync("src/components/ButtonGroup.svelte", "utf8");
if (!/<Frame[\s\S]*?enableAutoLayout=\{false\}[\s\S]*?>/.test(buttonGroup)) {
    console.error("❌ ButtonGroup inline shell must keep Auto Layout disabled");
    process.exit(1);
}

console.log("✅ Components styles are self-contained");
