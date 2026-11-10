/* SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export function useNativeValidation(getControl: () => Control | undefined, focus?: () => void) {
    let message = $state("");
    $effect(() => {
        const control = getControl();
        if (!control) return;
        const form = control.form;
        function invalid(event: Event) {
            if (event.defaultPrevented) return;
            event.preventDefault();
            message = control!.validationMessage;
            const first = form ? Array.from(form.elements).find((item) => item.matches(":invalid")) : control;
            if (first === control) { if (focus) focus(); else control!.focus(); }
        }
        function update() { if (message) message = control!.validationMessage; }
        function reset() { message = ""; }
        control.addEventListener("invalid", invalid);
        control.addEventListener("input", update);
        control.addEventListener("change", update);
        const radioForm = control instanceof HTMLInputElement && control.type === "radio" ? form : null;
        radioForm?.addEventListener("change", update);
        form?.addEventListener("reset", reset);
        return () => {
            control.removeEventListener("invalid", invalid);
            control.removeEventListener("input", update);
            control.removeEventListener("change", update);
            radioForm?.removeEventListener("change", update);
            form?.removeEventListener("reset", reset);
        };
    });
    return { get message() { return message; } };
}
