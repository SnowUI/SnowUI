# Field 更新日志归档

### v1.2.0 (2026-07-05)

#### 新功能
- 新增默认关闭的 `error` 内置模式；仅在 invalid 时生成 F-02 同款 `<Text as="error">`。
- `parts.Text` 同时用于配置内置 label 与 error，显式组合模式保持不变。

### v1.1.0 (2026-07-05)

#### 新功能
- **FD-BuiltIn.1** 新增默认关闭的 `label` 内置模式，支持字符串或 Snippet，并生成既有样式的 `<Text as="label">`。
- **FD-BuiltIn.2** 新增 `parts.Text` 配置入口；原有显式 `<Text as="label">` 组合模式保持不变。

### v1.0.14 (2026-05-06)

#### 修复
- **FD-Fix.3** 修复 `Field row > Input/Select as="segment"` 横向分段宿主的 padding 被后续嵌套宿主规则清零，导致 F-04 双输入并排示例中文字贴边的问题；现在直接 segment 宿主保留自身 `12 / 16` 内容 inset，嵌套在 segment 容器内的 host 仍由外层容器持有 padding。

### v1.0.13 (2026-04-25)

#### 修复
- **FD-Fix.2** 修复 `Field` 内嵌非 `segment` 的 `Textarea` 右侧留白过大：外层 `Field` 已提供右侧 `16px` padding，Textarea control 不再额外叠加右侧 padding，仅保留底部 `resize/footer` 区域。

### v1.0.10 (2026-04-02)

#### 调整
- **FD-Doc.1** 文档补充最新字段组合规则：移除最小高度表述，明确 `label -> 内容` 默认纵向间距为 `8px`，并强调 `Text / Input / Frame / Select / Textarea` 进入 `Field` 后由外层统一控制边框、背景、圆角与 padding。
- **FD-Doc.2** 文档收敛分割线判定：只有多个输入宿主或显式分段组成连续字段表面时才使用分割线；`leading + Input + trailing` 这类配件型结构不使用分割线，并更新了 `Select + trailing` 示例写法。

### v1.0.9 (2026-03-24)

#### 修复
- **FD-Fix.1** 当 `Field` 中嵌入的宿主本身是 `Input` 时，容器不再复用通用 host 布局；改为让嵌入态 `Input` 继续使用自身的三列 grid、gap、padding 与 number stepper 对齐链路。若 `Field` 内只有这一个 `Input` 宿主，则 `Field` 根退成普通块容器、宿主跨满整行，保证 `<Field><Input /></Field>` 与独立 `<Input />` 在右侧留白和按钮尺寸上完全一致。

### v1.0.8 (2026-03-16)

#### 新功能
- **FD-Layout.9** 新增根节点 `row / column` 简写：`Field row` 和 `Field column` 现在可直接复用原有局部 `row / col` 容器规则，无需再额外包一层 `Frame`。

### v1.0.7 (2026-03-16)

#### 新功能
- **FD-Layout.8** 新增 `col` 局部容器协议：`Field > Frame as="col" column` 现在可作为字段内部的竖向组合容器，复用宿主 padding、横向分隔线和嵌套 `row` 的组合规则。

### v1.0.6 (2026-03-16)

#### 调整
- **FD-Layout.7** 多段字段内容之间的横向分割线改为与 Field 外边框一致的颜色与粗细，避免复杂结构示例里中间分割线过浅。

### v1.0.5 (2026-03-16)

#### 修复
- **FD-Layout.6** `leading / trailing` 的 `Button bare` 改为通过外侧 margin 保留与 Field 边框的间距，并显式垂直居中，避免日期示例里的按钮贴到右上角。

### v1.0.4 (2026-03-16)

#### 修复
- **FD-Layout.5** `row` 内部的通用兄弟分隔线不再作用于与 `Button bare` 相邻的节点，避免复杂结构里的 trailing 无外壳按钮继续显示边框。

### v1.0.3 (2026-03-16)

#### 修复
- **FD-Layout.4** 当 `leading / trailing` 角色本身是 `Button bare` 时，移除槽位分隔线，避免无外壳按钮在 Field 示例中出现额外边框。

### v1.0.2 (2026-03-16)

#### 调整
- **FD-Layout.3** 日期触发器不再依赖额外行为 prop；复杂结构中的日期按钮也统一只使用 `as="trailing"`，并要求位于可识别的局部容器中。

### v1.0.1 (2026-03-15)

#### 新功能
- **FD-Layout.1** 新增直接组合规则：`Field > host + trailing` 现在可直接形成一行字段表面，无需额外 `Frame as="row"`。
- **FD-Layout.2** Field 根布局升级为三列网格：`leading / host / trailing`，任意未声明角色的复杂子块默认跨满整行。

### v1.0.0 (2026-03-15)

#### 新功能
- **FD-Feat.1** 新增表单容器组件，负责承接字段视觉外壳与组合式布局协议。
