<!-- SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<script lang="ts" module>
  export type PasswordStrengthLevel = 0 | 1 | 2 | 3 | 4;
  export type PasswordStrengthEvaluator = (password: string) => PasswordStrengthLevel;
  /** 参考 shadcn/ui 的规则计数；仅为提示，不是密码安全保证。 */
  export function evaluatePasswordStrength(password: string, minimumLength = 8): PasswordStrengthLevel {
    if (!password) return 0;
    if (password.length < minimumLength) return 1;
    const rules = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].filter(pattern => pattern.test(password)).length;
    return Math.max(1, rules) as PasswordStrengthLevel;
  }
</script>
<script lang="ts">
  import Frame, { type FrameProps } from './Frame.svelte';
  import Text from './Text.svelte';
  import { useLocale } from '../i18n/locale.svelte';
  interface Props extends Omit<FrameProps, 'children' | 'column' | 'row' | 'gap' | 'enableAutoLayout'> {
    password?: string;
    evaluate?: PasswordStrengthEvaluator;
    labels?: readonly [string, string, string, string, string];
    minimumLength?: number;
    minimumLengthMessage?: (length: number) => string;
    requireLowercase?: boolean;
    requireUppercase?: boolean;
    requireNumber?: boolean;
    requireSymbol?: boolean;
    [key: string]: any;
  }
  let { password = '', evaluate, labels = ['请输入密码', '弱', '一般', '较强', '完美'], minimumLength = 8, minimumLengthMessage, requireLowercase = false, requireUppercase = false, requireNumber = false, requireSymbol = false, enableResponsive = true, enableContext = true, enableScaleObserver = false, class: userClass = '', ...rest }: Props = $props();
  const locale = useLocale();
  let level = $derived(evaluate ? evaluate(password) : evaluatePasswordStrength(password, minimumLength));
  let missingRequirements = $derived([
    requireLowercase && !/[a-z]/.test(password) ? locale.t('passwordStrength.lowercase') : '',
    requireUppercase && !/[A-Z]/.test(password) ? locale.t('passwordStrength.uppercase') : '',
    requireNumber && !/[0-9]/.test(password) ? locale.t('passwordStrength.number') : '',
    requireSymbol && !/[^\p{L}\p{N}\s]/u.test(password) ? locale.t('passwordStrength.symbol') : ''
  ].filter(Boolean));
  let message = $derived(!password ? labels[level] : password.length < minimumLength ? (minimumLengthMessage?.(minimumLength) ?? locale.t('passwordStrength.minimumLength', { length: minimumLength })) : missingRequirements.length ? locale.t('passwordStrength.requirements', { requirements: missingRequirements.join('、') }) : labels[level]);
</script>
<Frame {...rest} row={false} column gap={2} enableAutoLayout={false} enableResponsive={enableResponsive} enableContext={enableContext} enableScaleObserver={enableScaleObserver} class={`snowui-password-strength ${userClass}`}>
  <div class="snowui-strength-track" aria-hidden="true">
    {#each [1, 2, 3, 4] as segment}<span class:snowui-strength-active={segment <= level} class:snowui-strength-level-1={level === 1} class:snowui-strength-level-2={level === 2} class:snowui-strength-level-strong={level >= 3}></span>{/each}
  </div>
  <Text class="snowui-strength-label">{message}</Text>
</Frame>
<style>
  :global(:where(.snowui-password-strength)) { --snowui-password-strength-segment-gap: var(--gap-2); --snowui-password-strength-segment-radius: var(--radius-full); padding-inline: var(--padding-1, 4px); box-sizing: border-box; }
  :global(:where(.snowui-strength-track)) { display: flex; gap: var(--snowui-password-strength-segment-gap-override, var(--snowui-password-strength-segment-gap, var(--gap-2))); width: 100%; }
  :global(:where(.snowui-strength-track span)) { flex: 1 1 0; min-width: 0; height: var(--size-1, 4px); border-radius: var(--snowui-password-strength-segment-radius-override, var(--snowui-password-strength-segment-radius, var(--radius-full))); background: var(--black-10, #0000001A); }
  :global(:where(.snowui-strength-track .snowui-strength-active.snowui-strength-level-1)) { background: var(--secondary-red, #FF4747FF); }
  :global(:where(.snowui-strength-track .snowui-strength-active.snowui-strength-level-2)) { background: var(--secondary-orange, #FFB55BFF); }
  :global(:where(.snowui-strength-track .snowui-strength-active.snowui-strength-level-strong)) { background: var(--secondary-green, #71DD8CFF); }
  :global(:where(.snowui-password-strength .snowui-strength-label)) { color: var(--black-40, #00000066); font-size: var(--text-12, 12px); line-height: var(--leading-12, 16px); min-width: 0; width: 100%; white-space: normal; overflow-wrap: anywhere; }
</style>
