// 插件 browser 子路径尚未声明类型，沿用 Prettier 官方 Plugin 接口。
declare module "prettier-plugin-svelte/browser" {
    import type { Plugin } from "prettier";
    export const parsers: Plugin["parsers"];
    export const printers: Plugin["printers"];
    export const options: Plugin["options"];
    export const languages: Plugin["languages"];
}
