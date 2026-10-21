/* SnowUI source notice | LICENSE 2.3.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
// 插件 browser 子路径尚未声明类型，沿用 Prettier 官方 Plugin 接口。
declare module "prettier-plugin-svelte/browser" {
    import type { Plugin } from "prettier";
    export const parsers: Plugin["parsers"];
    export const printers: Plugin["printers"];
    export const options: Plugin["options"];
    export const languages: Plugin["languages"];
}
