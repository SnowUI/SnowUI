# ColorSchemeButton API

来源指纹：ffcda51ddd4050c1。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| scheme | `ColorScheme` | — | 当前配色方案，支持 bind:scheme。关闭 systemPreference 时，挂载值优先于 defaultScheme；点击更新该值，同步页面属性时也会跟随根节点变化。 |
| defaultScheme | `ColorScheme` | — | 关闭 systemPreference 时的非受控初值；scheme 优先。均未提供时读取页面根节点；applyToDocument=false 时回退为 light。 |
| applyToDocument | `boolean` | true | 将当前状态同步到 document.documentElement：theme="dark"；亮色时移除 theme。false 时不读写或观察页面属性，由调用方处理主题目标；系统偏好和 Cookie 能力由 systemPreference 单独控制。 |
| systemPreference | `boolean` | true | 无有效手动 Cookie 时跟随系统亮暗；手动选择保存 365 天，到期恢复系统。开启时 Cookie／系统优先于初值；false 不读取系统或偏好 Cookie，也不写偏好。 |
| ariaLabel | `string` | — | 覆盖按钮的可访问名称；默认描述点击后切换到的状态，跟随 LocaleProvider。 |
| lightIcon | `Snippet` | —（内置图形） | 替换当前为 light 时显示的 Sun 图标。仅改变图形，不接管切换逻辑。 |
| darkIcon | `Snippet` | —（内置图形） | 替换当前为 dark 时显示的 Moon 图标。仅改变图形，不接管切换逻辑。 |
| children | `Snippet` | — | 显示在状态图形之后的自定义内容；未提供时宿主 Button 自动使用 iconOnly 布局。 |
| disabled | `boolean` | false | 禁用按钮操作；不会阻止外部绑定值或页面属性的同步。 |
| onSchemeChange | `(scheme: ColorScheme) => void` | — | 用户点击切换后接收新值；初始化、外部赋值及页面属性观察同步不会调用此回调。 |
| onclick | `(event: MouseEvent) => void` | — | 有效点击时先调用，再执行状态切换；当前实现不会以 preventDefault() 取消后续切换。disabled 时不调用。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
