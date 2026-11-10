/* SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import { INPUT_REQUIRED_KEYFRAMES, INPUT_REQUIRED_TIMING } from "../motion/presets/input-required";

export function useRequiredFeedback(
    getInput: () => HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | undefined,
    getSurface: () => HTMLElement | undefined,
    focus?: () => void,
) {
    $effect(() => {
        const input = getInput();
        const surface = getSurface();
        if (!input || !surface) return;
        let feedback: Animation | undefined;
        function stop() { feedback?.cancel(); feedback = undefined; }
        function invalid() {
            if (!input!.validity.valueMissing) return;
            const first = input!.form
                ? Array.from(input!.form.elements).find(control => control.matches("input:invalid, textarea:invalid, select:invalid"))
                : input;
            if (first !== input) return;
            stop();
            if (focus) focus(); else input!.focus();
            if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                feedback = surface!.animate(INPUT_REQUIRED_KEYFRAMES, INPUT_REQUIRED_TIMING);
                feedback.id = "snowui-required-feedback";
            }
        }
        input.addEventListener("invalid", invalid);
        input.addEventListener("input", stop);
        input.addEventListener("change", stop);
        input.addEventListener("blur", stop);
        input.form?.addEventListener("reset", stop);
        return () => {
            stop();
            input.removeEventListener("invalid", invalid);
            input.removeEventListener("input", stop);
            input.removeEventListener("change", stop);
            input.removeEventListener("blur", stop);
            input.form?.removeEventListener("reset", stop);
        };
    });
}
