/* SnowUI source notice | LICENSE 2.3.0: ../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/// <reference types="vite/client" />

declare module "*.svelte" {
	import type { Component } from "svelte";
	const component: Component;
	export default component;
}

declare module "@snowui-design-system/resource-svelte";
