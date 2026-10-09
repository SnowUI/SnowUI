/**
 * ImageViewer.test.ts
 * v1.3.1
 * 变更记录 (2026-07-05): 增加 dismissMode button / backdrop 关闭策略覆盖。
 * 变更记录 (2026-07-05): 默认示例改用 ImageViewer 内置纯图标 Button 控制键。
 */
export const examples = [
    ...["opaque", "blur", "transparent"].map((backdrop) => ({
        name: `Backdrop: ${backdrop}`,
        code: `<script>let open = $state(false);</script>
<Button onclick={() => { open = false; queueMicrotask(() => open = true); }}>打开预览</Button>
<ImageViewer {open} backdrop="${backdrop}" dismissMode="button" items={[{ src: Gradient01, alt: "SnowUI cover" }]} />`,
    })),
    {
        name: "1: 页面级自动预览",
        code: `1
<div class="flex flex-col gap-24 items-center w-full">
    <ImageGroup
        previewMode="viewer"
        size={80}
        contentHug
        class="w-full justify-center"
        style="width: min(100%, 48rem);"
    >
        <Image
            src="https://cdn.dribbble.com/userupload/46965275/file/3ca8ffbe0c95ab60ae8091f98bad7741.png"
            size={80}
            alt="Preview image 1"
        />
        <Image
            src="https://cdn.dribbble.com/userupload/46948675/file/0bab170dd5ad324f15d36ca4379fbf2e.png"
            size={80}
            alt="Preview image 2"
        />
        <Image
            src="https://cdn.dribbble.com/userupload/47006672/file/d2ef1d3bf8e672c65a937c7baec8e4b8.mp4"
            size={80}
            alt="Preview video 1"
        />
        <Image
            src="https://cdn.dribbble.com/userupload/46852864/file/4fc858b968caaef3a8d33d5596a151a4.mp4"
            size={80}
            alt="Preview video 2"
        />
    </ImageGroup>

    <ImageViewer />
</div>`,
    },
    {
        name: "2: 单图自动接入页面级 Viewer",
        code: `2
<div class="flex flex-col gap-24 items-center w-full">
    <Image
        previewMode="viewer"
        src="https://cdn.dribbble.com/userupload/46965275/file/3ca8ffbe0c95ab60ae8091f98bad7741.png"
        size={80}
        alt="Single preview image"
    />

    <ImageViewer />
</div>`,
    },
    {
        name: "3: 原生 HTML 与资源图片接入 Viewer",
        code: `3
<div class="flex flex-col gap-24 items-center w-full">
    <div
        class="flex flex-row gap-16 items-center justify-center"
        data-snowui-image-viewer-scope
    >
        <img
            data-snowui-image-viewer-mode="viewer"
            style="width: 200px; height: 200px;"
            src="https://cdn.dribbble.com/userupload/46965275/file/3ca8ffbe0c95ab60ae8091f98bad7741.png"
            alt="Native preview image 1"
        />
        <img
            data-snowui-image-viewer-mode="viewer"
            style="width: 200px; height: 200px;"
            src="https://cdn.dribbble.com/userupload/46948675/file/0bab170dd5ad324f15d36ca4379fbf2e.png"
            alt="Native preview image 2"
        />
        <Image01 data-snowui-image-viewer-mode="viewer" alt="Resource preview image" />
    </div>

    <ImageViewer parts={{ Button: { size: "lg" } }} />
</div>`,
    },
    {
        name: "4: 受控混合媒体预览",
        code: `4
<div style="position: relative; min-height: 24rem; width: min(100%, 48rem);">
    <ImageViewer
        open
        dismissMode="button"
        items={[
            {
                src: "https://cdn.dribbble.com/userupload/46965275/file/3ca8ffbe0c95ab60ae8091f98bad7741.png",
                alt: "Preview image 1",
            },
            {
                src: "https://cdn.dribbble.com/userupload/46948675/file/0bab170dd5ad324f15d36ca4379fbf2e.png",
                alt: "Preview image 2",
            },
            {
                src: "https://cdn.dribbble.com/userupload/47006672/file/d2ef1d3bf8e672c65a937c7baec8e4b8.mp4",
                alt: "Preview video 1",
            },
        ]}
        index={0}
    >
        <Button as="prev" iconOnly size="md" variant="gray" backgroundBlur aria-label="上一张">
            <ArrowLineLeft />
        </Button>
        <Button as="next" iconOnly size="md" variant="gray" backgroundBlur aria-label="下一张">
            <ArrowLineRight />
        </Button>
        <Button as="close" iconOnly size="md" variant="gray" backgroundBlur aria-label="关闭图片预览">
            <Close />
        </Button>
    </ImageViewer>
</div>`,
    },
    {
        name: "5: 页面共享 Viewer 单例",
        code: `5
<div class="flex flex-row gap-16 items-center">
    <Image src={Image01} size={80} alt="Shared viewer image 1" />
    <Image src={Image01} size={48} alt="Shared viewer image 2" />
    <ImageViewer />
    <ImageViewer />
</div>`,
        expected: {
            render: "页面误声明两个自动 ImageViewer 时只渲染一个预览层。",
            layout: "两张未声明 previewMode 的 Image 共用页面级 Viewer。",
            interaction: "点击任一 Image 由唯一 owner 响应并打开；显式 window/none 仍可覆盖。",
            performance: "非 owner 只保留注册，不渲染 Portal 或媒体树。",
            responsive: "共享 Viewer 继续覆盖完整视口。",
        },
        logic: ["SharedService", "SingletonOwner", "DefaultRouting"],
    },
    {
        name: "6: 空白区域关闭模式",
        code: `6
<div class="flex flex-row gap-16 items-center">
    <Image src={Image01} size={80} alt="Backdrop dismiss image" />
    <ImageViewer />
</div>`,
        expected: {
            render: "Viewer 打开后不显示关闭按钮，只保留上一张/下一张边界控制。",
            layout: "媒体与导航按钮布局保持不变。",
            interaction: "点击媒体外空白区域关闭 Viewer；点击媒体本体不关闭。",
            performance: "不创建内置 close Button。",
            responsive: "空白命中区覆盖 Viewer 全视口。",
        },
        logic: ["DismissMode", "Backdrop", "BuiltInButton"],
    },
] as const;
