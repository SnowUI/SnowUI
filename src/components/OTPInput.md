# OTPInput

> **版本**: v1.1.0<br>
> **职责**: 提供 4–8 位数字一次性验证码输入，并保留原生表单、自动填充、键盘与无障碍语义。<br>
> **包归属**: `@snowui-design-system/components`

## 组件介绍

提供 4–8 位数字一次性验证码输入，支持整码粘贴、短信自动填充、原生表单提交与重置。

## 使用选择

<!-- usage-guide:start -->
用于输入已经由业务或身份服务发送的一次性数字验证码。组件只负责输入，不负责发送短信、倒计时或验证验证码。

- 默认 6 位，可选 4、5、6、7、8 位；可以点击任意格输入，中间空位在未完整值中以空格保留；粘贴严格校验，规则见下文。
- `oncomplete` 仅在用户输入产生一个新的完整值时触发；初始化、外部赋值和相同完整值重复同步不触发。
- `name`、`form`、`required`、`disabled`、`readonly` 与 `autocomplete="one-time-code"` 均落到真实 input。
<!-- usage-guide:end -->

## 快速开始

```svelte
<script lang="ts">
    import { OTPInput } from "@snowui-design-system/components";
    let code = $state("");
</script>

<OTPInput bind:value={code} aria-label="Verification code" oncomplete={(value) => console.log(value)} />
```

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| value | `string` | `""` | 支持 `bind:value`；未完整值用空格表示中间空位，完整值只包含数字。外部更新会同步显示。 |
| defaultValue | `string` | — | 未提供 value 时的初始值，也是原生表单 reset 的恢复值；同时提供两者时 value 决定当前显示，defaultValue 决定 reset 基线。 |
| length | `OTPLength` | `6` | 验证码位数；改变时立即按新长度截断值并重建格数。 |
| oncomplete | `(value: string) => void` | — | 用户输入首次形成新的完整值时回调；初始化、外部赋值和重复相同值不触发。 |
| name | `string` | — | 原生字段名；启用时由 FormData 收集过滤后的完整或部分值。 |
| form | `string` | — | 按 id 关联外部 form。 |
| disabled | `boolean` | `false` | 禁止聚焦与编辑；字段不参与 FormData。 |
| readonly | `boolean` | `false` | 允许聚焦、选择与提交，但禁止编辑。 |
| required | `boolean` | `false` | 启用原生必填校验。 |
| autocomplete | `HTMLInputAttributes["autocomplete"]` | `"one-time-code"` | 默认启用短信验证码自动填充语义。 |
| autofocus | `boolean` | — | 请求页面加载后聚焦；应避免与其他自动聚焦控件竞争。 |
| tabindex | `number` | — | 原生焦点顺序。 |
| id | `string` | — | 真实 input id，可由 label 的 `for` 关联。 |
| title | `string` | — | 原生提示；不替代可访问名称。 |
| invalid | `boolean` | `false` | 调用方控制的持续错误态，输出 aria-invalid、Input 同款边框/聚焦环/错误文字与 shake；不会被内置 2 秒计时器清除。 |
| success | `boolean` | `false` | 调用方验证成功后设置，可双向绑定；展示只读外观并隐藏激活态，2 秒后自动恢复为 `false`。这是视觉状态，不禁止编辑或提交；组件不自行判断验证码是否正确。 |
| error | `string \| Snippet` | locale 文案 | 错误文字或内容；显式值优先于 locale 默认文案。 |
| oninput | `(event: Event) => void` | — | 用户输入已归一化或有效粘贴已写入后回调；拒绝粘贴不会触发。 |
| onchange | `(event: Event) => void` | — | 转发真实 input 的原生 change 事件。 |
| onfocus | `(event: FocusEvent) => void` | — | 真实 input 获得焦点、同步活动格后回调。 |
| onblur | `(event: FocusEvent) => void` | — | 真实 input 失去焦点、隐藏激活框后回调。 |
| onkeydown | `(event: KeyboardEvent) => void` | — | 原生按键处理前回调，可通过 preventDefault 取消默认行为。 |
| onpaste | `(event: ClipboardEvent) => void` | — | 校验粘贴内容前回调；preventDefault 可取消整次组件粘贴处理。 |
| class / style / Frame Props | `FrameProps` | — | 适用能力应用于公开根 Frame；tag、children 和 F-03B enableScaleObserver 不公开，合法原生属性由共享分流器只传给 input。 |

公开样式覆盖：`--snowui-otp-input-gap-override`、`--snowui-otp-input-size-override`、`--snowui-otp-input-radius-override`、`--snowui-otp-input-font-size-override`、`--snowui-otp-input-line-height-override`。

## 原生表单校验反馈

原生必填、类型、长度和格式校验失败时，组件取消浏览器气泡，将 `validationMessage` 显示在组件下方，并保持原生无效提交拦截。首个无效字段获得焦点；输入修正后更新反馈，表单重置清除反馈。调用方业务校验继续使用 `invalid` 与 `error`，原生错误存在时优先显示原生反馈。原生消息语言由浏览器决定，不将校验状态等同服务端验证结果。

## 使用边界与详细说明

- 单一真实 `<input type="text" inputmode="numeric">` 负责键盘、选择、删除、替换、自动填充、表单和辅助技术；根 `role="group"` 与 input 共享显式可访问名称，分格为 `aria-hidden` 视觉层。错误通过 aria-describedby 关联，并由 polite 状态区播报。
- 点击任意格会选择对应字符，因此下一次键入替换该格；活动格跟随 input 的真实 selection。原生方向键、Home、End、Backspace、Delete、选择替换与撤销行为保持可用。
- 普通输入保留 ASCII 数字 `0–9` 与用于记录中间空位的空格，点击任意格可在该格输入；填写最后一格时若仍有空位，显示错误且不触发 `oncomplete`。填满所有格后才产生完整验证码。
- 删除某一格时右侧数字保留在原格；使用方确认验证成功后设置 `success`，不论通过输入还是整码粘贴完成，均展示只读外观 2 秒并隐藏激活态，仍可编辑，随后自动恢复。
- 粘贴先检查全部内容，空白、分隔符、字母、全角数字等均视为非数字，不做静默过滤。
- 粘贴长度恰好等于 `length` 时，无论当前激活位置都从首格完整覆盖。
- 在后续格（index > 0）粘贴，只要已有连续前缀且不超过右侧剩余格数，就从当前格补入；允许未填满。例如 4 位码已有 `12`，第三格粘贴 `34` 得到 `1234`，粘贴 `3` 得到 `123`。
- 在首格粘贴不足/超长数字时清空全部内容并报错；在后续格粘贴超出剩余格数，或粘贴非数字时，拒绝整次粘贴并保留原值。
- 内置粘贴错误使用 Input 同款边框、聚焦环、shake 和错误文字，持续 2 秒后恢复；再次无效粘贴重新计时。reset、卸载清理 timer；错误期间不锁定输入。外部 invalid 仍由调用方负责。
- 激活框通过 `TAB_INDICATOR_MOTION` 平移，数字出现／替换使用向上翻入的局部动效；reduced-motion 保持值、语义和焦点，直接呈现最终位置。
- 调用方必须提供 `aria-label`、`aria-labelledby` 或关联 `<label>`。disabled 不提交，readonly 仍提交。
- form reset 默认恢复 `defaultValue`，未提供时恢复首次 value；取消的 reset 保留当前值。监听按当前 `input.form` 判定，因此 `form` 改变后自动关联新表单。reset 的零延迟收尾 timer 在重复 reset 或卸载时清理。

## AI Zone

| 类别 | 关键字 | 处理位置 | 约束 |
| --- | --- | --- | --- |
| 根协议 | `.snowui-otp-input` | 根 Frame | class/style 与 Frame 能力出口。 |
| 原生值宿主 | `.snowui-otp-native` | 真实 input | 唯一表单、焦点、键盘和自动填充宿主。 |
| 视觉层 | `.snowui-otp-slots` | `aria-hidden` | 不建立第二套输入或可访问语义。 |
| 状态 | `data-focus` / `data-disabled` / `data-readonly` / `data-invalid` | 根 Frame | 只反映真实交互状态。 |

## 多语言与共享视觉

`otpInput.invalidCode` 通过 `useLocale()` 提供 zh-CN / en-US 默认文案，`error` 显式覆盖优先。`.snowui-field-bordered` 统一拥有 hover / focus / invalid 的边框与聚焦环；OTP 的委托视觉节点通过 `data-field-hover` / `data-field-focus` 反映真实输入状态，不在组件复制色值或 ring 参数。`.snowui-field-error-message` 与 Input 共用错误文字排版。

UI Lab OTPInput 是交互与动效参考，SnowUI 的 API、Token、Frame、表单与粘贴规则由本组件拥有。第三方许可见包根 THIRD_PARTY_NOTICES.md。Test 仅保留 `OTPInput-Demo` 单组件入口，原 XERJ 对照指标属于历史实验，不是当前行为契约。

## 组合与边界

OTPInput 是基础组件，不生成公开子组件、parts、短信发送或验证服务。没有默认动效、Portal 或 Observer；reset 监听与短 timer 只在 action 挂载后的浏览器端建立并在卸载时清理，模块导入和 SSR 不读取浏览器全局。`prefers-reduced-motion` 无特殊分支。

## 更新日志

- v1.0.0：首次公开，覆盖 4–8 位数字输入、粘贴过滤、表单、重置、自动填充和仅用户新完成触发。

- v1.1.0：统一 Input 状态样式，补充顺序激活、严格/补入粘贴校验、2 秒错误恢复、数字与激活框动效；删除 Test 平行实验实现。
