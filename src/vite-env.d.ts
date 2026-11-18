/// <reference types="vite/client" />

declare module "*.svelte" {
	import type { Component } from "svelte";
	const component: Component;
	export default component;
}

declare module "@snowui-design-system/resource-svelte";
/*! @license SnowUI-Commercial-2.4.0 https://snowui.dev/LICENSE (../LICENSE) */
