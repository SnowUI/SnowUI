# 图片加载策略

公开入口：`import { provideMediaLoading, type MediaLoading } from '@snowui-design-system/components'`。

`MediaLoading = 'lazy' | 'eager'`。在 Svelte 宿主组件初始化时调用 `provideMediaLoading(value)`，为该组件的后代 Image 提供默认值；`value` 可以是固定值或返回策略的响应式 getter。最近 Provider 优先，Image 显式 `mediaLoading` 优先于继承，未提供时为 `lazy`。不在模块顶层或事件回调中调用 Provider。

只映射字符串图片原生 `<img loading>`，不会改视频 metadata 预加载、资源组件内的媒体、未挂载的查看器内容或出现动画。SSR 按同一上下文输出属性，每棵渲染树独立，没有全局可变默认值；getter 应在服务端与客户端返回一致初始值。更改为 lazy 不保证撤销浏览器已开始的请求。

真实消费方：Image；Site 首页宿主选择 eager，组件文档页维持默认 lazy。详见 [Image](../components/Image.md)。加载失败沿用组件原有 error / Skeleton 规则，Provider 不发请求也不接管加载状态。

实现 [media-loading.ts](./media-loading.ts) 仅保存 / 读取作用域 getter，无 Observer、listener、timer、rAF 或浏览器全局。未提供 Provider 的 Image 仍增加一次 context 查询及派生值读取；构建字节增量以任务验收记录为准，不声称零成本。未使用的公开 helper 可 tree-shake，类型被擦除。
