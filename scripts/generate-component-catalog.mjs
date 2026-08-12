import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const discovery = JSON.parse(fs.readFileSync(path.join(root, "component-discovery.json"), "utf8"));
const outputPath = path.join(root, "component-catalog.json");

function stripMarkdown(value = "") {
  return value
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function readDescription(documentation, name) {
  if (!documentation || !fs.existsSync(documentation)) return `${name} SnowUI PRO component.`;
  const markdown = fs.readFileSync(documentation, "utf8");
  const responsibility = markdown.match(/^>\s*\*\*职责\*\*:\s*(.+)$/m);
  if (responsibility) return stripMarkdown(responsibility[1]);
  const paragraph = markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith("#") && !line.startsWith(">") && !line.startsWith("|") && !line.startsWith("-") && !line.startsWith("```"));
  return stripMarkdown(paragraph) || `${name} SnowUI PRO component.`;
}

function collectExports(indexRelative, defaultKind) {
  const indexPath = path.join(root, indexRelative);
  const source = fs.readFileSync(indexPath, "utf8");
  const entries = [];
  for (const match of source.matchAll(/export\s*\{([\s\S]*?)\}\s*from\s*["']([^"']+)["'];?/g)) {
    const exported = match[1].match(/default\s+as\s+(\w+)/);
    if (!exported) continue;
    const name = exported[1];
    const sourceRelative = path.posix.normalize(path.posix.join(path.posix.dirname(indexRelative), match[2]));
    const sourceFile = sourceRelative.endsWith(".svelte") ? sourceRelative : `${sourceRelative}.svelte`;
    const canonical = path.basename(sourceFile, ".svelte");
    const metadata = discovery.components[name] ?? discovery.components[canonical] ?? {};
    const documentationRelative = metadata.documentation ?? sourceFile.replace(/\.svelte$/, ".md");
    const documentationPath = path.join(root, documentationRelative);
    entries.push({
      name,
      canonical: metadata.canonical ?? (name === canonical ? name : canonical),
      package: packageJson.name,
      import: `import { ${name} } from '${packageJson.name}';`,
      tier: defaultKind === "block" ? "pro-block" : "pro",
      kind: defaultKind,
      source: sourceFile,
      documentation: fs.existsSync(documentationPath) ? documentationRelative : null,
      description: readDescription(documentationPath, name),
      intents: metadata.intents ?? [],
      aliases: metadata.aliases ?? [],
      whenToUse: metadata.whenToUse ?? null,
      avoidWhen: metadata.avoidWhen ?? null,
      related: metadata.related ?? [],
      deprecated: metadata.deprecated ?? false
    });
  }
  return entries;
}

const components = [
  ...collectExports("src/index.ts", "component"),
  ...collectExports("src/blocks/index.ts", "block")
]
  .filter((entry, index, all) => all.findIndex((candidate) => candidate.name === entry.name) === index)
  .sort((a, b) => a.name.localeCompare(b.name));

const exportedNames = new Set(components.flatMap((entry) => [entry.name, entry.canonical]));
const unusedMetadata = Object.keys(discovery.components).filter((name) => !exportedNames.has(name));
const missingDocumentation = components.filter((entry) => !entry.documentation).map((entry) => entry.name);
if (unusedMetadata.length || missingDocumentation.length) {
  if (unusedMetadata.length) console.error(`Discovery metadata has no matching export: ${unusedMetadata.join(", ")}`);
  if (missingDocumentation.length) console.error(`Exported components without documentation: ${missingDocumentation.join(", ")}`);
  process.exit(1);
}

const catalog = {
  schemaVersion: 1,
  package: packageJson.name,
  generatedFrom: ["src/index.ts", "src/blocks/index.ts", "src/components/*.md", "src/blocks/*.md", "component-discovery.json"],
  components
};
const next = `${JSON.stringify(catalog, null, 2)}\n`;

if (process.argv.includes("--check")) {
  const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : "";
  if (current !== next) {
    console.error("component-catalog.json is out of date. Run pnpm catalog:generate.");
    process.exit(1);
  }
  console.log(`component-catalog.json is current (${components.length} exports).`);
} else {
  fs.writeFileSync(outputPath, next);
  console.log(`component-catalog.json generated (${components.length} exports).`);
}
