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
            message = control!.validity.valueMissing ? "" : control!.validationMessage;
            const first = form ? Array.from(form.elements).find((item) => item.matches(":invalid")) : control;
            if (first === control) { if (focus) focus(); else control!.focus(); }
        }
        function update() { if (message) message = control!.validity.valueMissing ? "" : control!.validationMessage; }
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
/*! @license SnowUI-Commercial-2.4.0 https://snowui.dev/LICENSE (../../LICENSE) */
