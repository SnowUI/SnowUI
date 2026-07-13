import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const required = [
    "src/styles/index.css",
    "src/styles/themes.css",
    "src/styles/components.css",
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

const forbidden = /(?:\.\.\/){2,}styles(?:\/|\b)|\/Users\/yuan\/Project\/snowui\/styles\//;
for (const file of walk("src")) {
    if (!/\.(?:css|ts|svelte|md)$/.test(file)) continue;
    const source = readFileSync(file, "utf8");
    if (forbidden.test(source) && !file.endsWith("src/styles/themes.css")) {
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

console.log("✅ Components styles are self-contained");
