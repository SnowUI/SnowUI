/** SnowUI 组件内置 UI 文案 catalog。文档: ../../../specs/LocalizationSpec.md */

export const DEFAULT_LOCALE = "zh-CN";

export type SnowUIMessageKey =
    | "colorSchemeButton.toLight"
    | "colorSchemeButton.toDark"
    | "styleButton.toSnowUI"
    | "styleButton.toApple"
    | "sidePanel.placement.toInline"
    | "sidePanel.placement.toFloating"
    | "sidePanel.previous"
    | "sidePanel.next"
    | "sidePanel.copy"
    | "sidePanel.delete"
    | "sidePanel.cancel"
    | "sidePanel.save"
    | "sidePanel.close";

export type SnowUIMessageValues = Record<string, string | number>;
export type SnowUIMessageOverrides = Partial<Record<SnowUIMessageKey, string>>;

export const SNOWUI_MESSAGES: Record<
    string,
    Record<SnowUIMessageKey, string>
> = {
    "zh-CN": {
        "colorSchemeButton.toLight": "切换到亮色",
        "colorSchemeButton.toDark": "切换到暗色",
        "styleButton.toSnowUI": "切换到 SnowUI 风格",
        "styleButton.toApple": "切换到 Apple 风格",
        "sidePanel.placement.toInline": "切换为内嵌预览",
        "sidePanel.placement.toFloating": "切换为浮层预览",
        "sidePanel.previous": "上一项",
        "sidePanel.next": "下一项",
        "sidePanel.copy": "复制",
        "sidePanel.delete": "删除",
        "sidePanel.cancel": "取消",
        "sidePanel.save": "保存",
        "sidePanel.close": "关闭",
    },
    "en-US": {
        "colorSchemeButton.toLight": "Switch to light color scheme",
        "colorSchemeButton.toDark": "Switch to dark color scheme",
        "styleButton.toSnowUI": "Switch to SnowUI style",
        "styleButton.toApple": "Switch to Apple style",
        "sidePanel.placement.toInline": "Switch to inline preview",
        "sidePanel.placement.toFloating": "Switch to floating preview",
        "sidePanel.previous": "Previous item",
        "sidePanel.next": "Next item",
        "sidePanel.copy": "Copy",
        "sidePanel.delete": "Delete",
        "sidePanel.cancel": "Cancel",
        "sidePanel.save": "Save",
        "sidePanel.close": "Close",
    },
};
