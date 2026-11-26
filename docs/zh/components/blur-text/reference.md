# BlurText

> **版本**: v1.0.0
> **职责**: 逐字从模糊与轻微下移中揭示文字。
> **包归属**: `@snowui-design-system/components`

## 组件介绍

通过逐字变清晰、淡入与轻微上移呈现标题和短段落，保持自然换行、字号、行高与文字基线，适合欢迎语、介绍文案和内容揭示。

## 使用选择


静态内容使用 Text；模糊揭示使用 BlurText；纵向换字使用 SlotText / FlowText；字符扰动使用 ScrambleText。BlurText 接收纯文本，不承接富文本子树，不解释数字或计时器语义。长篇正文建议使用静态 Text，减少逐字滤镜的绘制成本。



## 快速开始

```svelte
<script lang="ts">
  import { BlurText } from '@snowui-design-system/components';
</script>

<BlurText text="让灵感逐渐清晰。" size="--text-32" lineHeight="--leading-32" />
```

未传排版 Props 时继承父级。也可以直接使用 `class="text-32"`，无需包一层 Text。数字 size 的单位是 px；数字 lineHeight 是无单位倍率，固定行高用 Token 或 `"40px"`。

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| text | `string \| number` | `""` | 最终纯文本，保留空格和换行 |
| speed | `number` | `1.5` | 字符启动速率，有限正数；错峰为 30ms / speed，单字固定 600ms；无效值回退 1.5 |
| animated | `boolean` | `true` | 关闭时立即呈现最终文本并清理内部动画 |
| playOnMount | `boolean` | `true` | 首次挂载且出现门禁放行后播放 |
| replayKey | `string \| number` | `0` | 值变化时重播当前全文 |
| respectMotionPreference | `boolean` | `true` | 遵循系统减少动效设置；运行中开启同样立即完成 |
| font | `string` | — | 字体或字体 Token |
| size | `string \| number` | — | 字号或字号 Token |
| weight | `string \| number` | — | 字重 |
| lineHeight | `string \| number` | — | 行高 Token、CSS 长度或无单位倍率 |
| color | `SnowUIColor \| string` | — | 最终文字色，支持 PascalCase 语义色 |
| align | `TextMotionAlign` | — | 文字对齐，默认继承 |
| motionColor | `TextMotionColor` | — | 可选逐字临时色，支持 chromatic()；结束后回到最终色 |

继承适用的 FrameProps，`tag` 默认 span，`as` 仍表示父组件角色。内部动效与根 Frame 的 `while*` 分层；`enableDefaultMotion={false}` 只关闭根默认动效。公开 `speed` 调整字符错峰，与参考站 speedReveal 对齐；单字时长固定 600ms；没有公开 duration、stagger、blur 或位移参数。速率修改从下一次文字更新或重播生效，不重启当前动画。临时颜色等待随揭示速率缩放，回落仍使用共享 280ms。

## 使用边界与详细说明

### 行为与无障碍

- 首次播放及 replayKey 更新揭示全文；text 更新立即提交最新内容并揭示。快速更新时仍在播放的相同位置字符从当前可见模糊、透明度与位移继续，旧回调不会覆盖新内容；不执行数字滚轮或旧文本退出动画。
- SSR 和无 JavaScript 输出完整文本。系统减少动效或 Web Animations API 缺失时保持静态可读内容。动画结束后移除所有内部 Animation。
- 根提供最终文本的稳定 aria-label；内部逐字视觉层 aria-hidden。语义标题使用 tag="h2" 等标签；默认 span 使用 img 角色表达完整文字，不逐字朗读。
- 换行由浏览器的 inline 排版决定，中文、英文单词、空格、显式换行不通过单字固定宽度或额外 margin 模拟。字体连字等最终效果由浏览器塑形决定。

### 参考来源

- 参考项目 Svelte Animations 中的 Blur Reveal 示例位于 `src/lib/components/spell/blur-reveal/blur-reveal.svelte`；该路径相对于参考项目，不属于 SnowUI 组件包或源码归档。
- 原站示例：[Svelte Animations · Blur Reveal](https://sv-animations.vercel.app/spell/blur-reveal)。
- 参考网站：[Text Motion Observatory · References](https://text-motion-observatory.farewelltowind.chatgpt.site/references)（需要登录 ChatGPT；此补充参考不是使用组件的前提）。

参考项目用于核对模糊揭示动效；参考网站作为补充案例入口。参考项目不参与 SnowUI 构建或运行时依赖。
