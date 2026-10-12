/* SnowUI source notice | LICENSE 2.0.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * Dialog 模版注册 + 命令式 API
 *
 * - `registerDialogTemplate(id, config)` / `unregisterDialogTemplate(id)` 注册模版
 * - `showDialog(id)` / `hideDialog(id)` 控制打开关闭
 * - `[data-dialog-target="id"]` 声明式触发
 */

export type DialogSize = "sm" | "md" | "lg";
export type DialogBackdrop = import("../lib/backdrop").BackdropVariant;

export interface DialogTemplateConfig {
    size: DialogSize;
    backdrop: DialogBackdrop;
    closeOnOutside: boolean;
    closeOnEscape: boolean;
}

export interface ActiveDialog {
    id: string;
    triggerEl?: HTMLElement;
}

const templates = new Map<string, DialogTemplateConfig>();

export const dialogStore = $state<{ active: ActiveDialog[] }>({ active: [] });

export function registerDialogTemplate(
    id: string,
    config: DialogTemplateConfig,
): void {
    templates.set(id, config);
}

export function unregisterDialogTemplate(id: string): void {
    templates.delete(id);
    hideDialog(id);
}

export function getDialogTemplate(id: string): DialogTemplateConfig | undefined {
    return templates.get(id);
}

export function showDialog(id: string, triggerEl?: HTMLElement): void {
    if (!templates.has(id)) return;
    const idx = dialogStore.active.findIndex((item) => item.id === id);
    if (idx === -1) {
        dialogStore.active = [...dialogStore.active, { id, triggerEl }];
    } else {
        dialogStore.active[idx] = { id, triggerEl };
    }
}

export function hideDialog(id: string): void {
    dialogStore.active = dialogStore.active.filter((item) => item.id !== id);
}

export function isDialogOpen(id: string): boolean {
    return dialogStore.active.some((item) => item.id === id);
}

let delegateInitialized = false;

function findDialogTrigger(target: EventTarget | null): HTMLElement | null {
    if (!(target instanceof Element)) return null;
    return target.closest("[data-dialog-target]") as HTMLElement | null;
}

export function initDialogDelegate(): void {
    if (delegateInitialized) return;
    if (typeof document === "undefined") return;
    delegateInitialized = true;

    document.addEventListener(
        "click",
        (event) => {
            const dialogTrigger = findDialogTrigger(event.target);
            if (dialogTrigger?.dataset.dialogTarget) {
                showDialog(dialogTrigger.dataset.dialogTarget, dialogTrigger);
            }
        },
        true,
    );
}

if (typeof document !== "undefined") {
    initDialogDelegate();
}
