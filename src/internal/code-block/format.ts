/* SnowUI source notice | LICENSE 2.1.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/// <reference path="./prettier-svelte.d.ts" />
/** CodeBlock 的展示格式化；不执行代码、不读取宿主配置、不修改原始输入。 */
import type { Plugin } from "prettier";

const MAX_SOURCE_LENGTH = 200_000;
const CACHE_SIZE = 32;
const results = new Map<string, Promise<string>>();

function resolveParser(source: string, language: string): string | undefined {
    const languages: Record<string, string> = {
        svelte: "svelte", js: "babel", javascript: "babel", jsx: "babel",
        ts: "typescript", typescript: "typescript", tsx: "typescript",
        html: "html", css: "css", scss: "scss", less: "less",
        json: "json", jsonc: "json", yaml: "yaml", yml: "yaml",
        markdown: "markdown", md: "markdown", graphql: "graphql", gql: "graphql",
    };
    const explicit = language.trim().toLowerCase();
    if (explicit) return languages[explicit];
    const input = source.trimStart();
    if (/^(?:<!--|<!doctype\b|<[A-Za-z]|\{[#:@])/.test(input)) return "svelte";
    if (/^[\[{]/.test(input)) return "json";
    if (/^(?:\/\/|\/\*|import\b|export\b|const\b|let\b|var\b|async\b|function\b|class\b|interface\b|type\b|console\.)/.test(input)) return "typescript";
    return undefined;
}

async function pluginsFor(parser: string): Promise<Plugin[]> {
    switch (parser) {
        case "svelte":
            return Promise.all([
                import("prettier-plugin-svelte/browser"),
                import("prettier/plugins/babel"),
                import("prettier/plugins/typescript"),
                import("prettier/plugins/estree"),
                import("prettier/plugins/postcss"),
            ]);
        case "babel": case "typescript": case "json":
            return Promise.all([
                parser === "typescript" ? import("prettier/plugins/typescript") : import("prettier/plugins/babel"),
                import("prettier/plugins/estree"),
            ]);
        case "html":
            return Promise.all([
                import("prettier/plugins/html"), import("prettier/plugins/babel"),
                import("prettier/plugins/estree"), import("prettier/plugins/postcss"),
            ]);
        case "css": case "scss": case "less": return [await import("prettier/plugins/postcss")];
        case "yaml": return [await import("prettier/plugins/yaml")];
        case "markdown": return [await import("prettier/plugins/markdown")];
        case "graphql": return [await import("prettier/plugins/graphql")];
        default: return [];
    }
}

export async function formatCodeBlock(source: string, language = ""): Promise<string> {
    if (!source.trim() || source.length > MAX_SOURCE_LENGTH) return source;
    const parser = resolveParser(source, language);
    if (!parser) return source;
    const key = `${parser}\0${source}`;
    const cached = results.get(key);
    if (cached) {
        results.delete(key);
        results.set(key, cached);
        return cached;
    }
    const result = (async () => {
        try {
            const [prettier, plugins] = await Promise.all([import("prettier/standalone"), pluginsFor(parser)]);
            const output = await prettier.format(source, {
                parser, plugins, useTabs: true, tabWidth: 4, printWidth: 80,
                singleQuote: true, semi: true, trailingComma: "none",
                singleAttributePerLine: true, endOfLine: "lf",
                svelteSortOrder: "none", svelteIndentScriptAndStyle: true,
            });
            // 展示末尾不额外生成一行，字符串和模板内部的换行由解析器保留。
            return output.replace(/\n$/, "");
        } catch {
            return source;
        }
    })();
    results.set(key, result);
    if (results.size > CACHE_SIZE) results.delete(results.keys().next().value!);
    return result;
}
