# TableBody

## 内置组件双模式

- `parts.TableRow` / `parts.TableCell`：统一配置首次加载时直接生成的行与单元格。
- `parts.Spinner`：配置已有数据加载状态的 Spinner。
- parts 不递归进入 TableCell 内部；更深层配置必须通过对应子组件自己的 parts。

> **版本**: v1.4.0
> **职责**: Table 的 `<tbody>` 语义容器。

```svelte
<TableBody><TableRow><TableCell>内容</TableCell></TableRow></TableBody>
```

| 属性 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| loading | `boolean` | Table Context | 首次加载时隐藏业务 children，并按已注册列结构渲染 Skeleton rows |
| loadingSpinner | `boolean` | Table Context | 保留业务 children，并在末尾追加跨列、居中的 Spinner 加载行 |
| continuousHover | `boolean` | `true` | 是否使用唯一的容器级连续 hover 移动层；关闭后不显示行背景 |
| children | `Snippet` | - | 正常数据行；Skeleton 首次加载期间不渲染 |

## 首次加载协议

TableBody 从同一个 Table 的 Context 读取 `TableHead` 显式注册的列结构。首次加载时，它使用真实 `TableRow / TableCell` 生成 40px 高的骨架数据行，并在普通内容列中复用 `Skeleton variant="line"`；selection / actions 角色列只保留合法单元格与列几何，不创建可交互控件。

Skeleton line 默认按行列交错使用 54%–76% 的占位宽度；可在 TableBody 或上层容器通过 `--snowui-table-body-skeleton-width-override` 统一覆盖。

独立 Table 可直接声明：

```svelte
<Table>
    <TableHeader>...</TableHeader>
    <TableBody loading />
</Table>
```

位于 DataTable 内时无需重复传入 `loading`；DataTable 仅在首次加载且 rows 为空时向 Context 开启该状态，并将规范化后的 `pageSize` 作为骨架行数。独立 Table 无法读取分页行数时回退为 10 行，与 DataTable 的默认 `pageSize` 一致。Skeleton 行数不提供额外公开属性，避免加载占位数量与真实分页数量分离。

## 已有数据加载 Spinner

DataTable 在 `loading` 或 `refreshing` 且当前存在可见 rows 时，通过 Context 开启 `loadingSpinner`。TableBody 保留现有数据行，并在末尾追加一个非交互的加载行：加载单元格的 `colspan` 等于 TableHead 注册列数，内部直接使用 SnowUI `<Spinner size={16} />`，在行中水平、垂直居中。Spinner 尺寸由外层 `<Table loadingSpinnerSize={...}>` 设置；未设置时使用表格默认 16×16px。

独立 Table 可显式声明 `<TableBody loadingSpinner>`。

手动加载按钮可由页面作为普通 TableBody child 放在数据行之后，并调用 `DataTableRenderState.loadMore()`。自动加载哨兵不属于 TableBody 的原生表格结构，由 DataTable 以不占布局的绝对定位元素在根层内部管理；页面只需声明 `loadMoreMode="auto"`。请求期由 DataTable 显示 TableBody Spinner；第一条新行开始渐显时 Spinner 隐藏，普通 TableCell 自动从 Context 获取进入动效，页面不需要手动维护 rows 或声明 `whileAppear`。

## Keyword

| Keyword | 说明 |
| :--- | :--- |
| component | 当前组件公开契约 |

> **以下内容供 AI 阅读，不展示在文档站点**

- 根节点必须保持 `tbody`，空态可使用带 colspan 的 TableCell。

## Changelog

- 2026-08-03：v1.4.0，Table 行背景收敛为 TableBody 唯一连续 hover 移动层；TableRow / TableCell 不再绘制第二层背景，关闭 `continuousHover` 后不显示行背景。
- 2026-08-02：v1.3.1，连续 hover 改用 direct 几何模式，移除长表格逐行 ResizeObserver 和 pointermove 全量行扫描。
- 2026-06-30：v1.3.0，明确手动按钮仍可作为 TableBody child；auto 模式哨兵改由 DataTable 根层内部管理，避免向原生 tbody 注入观察器结构。
- 2026-06-30：v1.2.0，新增 `loadingSpinner`：已有数据加载时追加跨列居中的通用 Spinner 行。
- 2026-06-30：v1.1.1，移除独立 `skeletonRows` 配置；骨架行数继承 DataTable `pageSize`，无法读取时回退 10 行。
- 2026-06-30：v1.1.0，新增 `loading` / `skeletonRows` 与 Table Context 列注册消费协议，首次空数据加载时自动生成语义化 Skeleton rows。
- 2026-06-19：v1.0.0，首次发布。
## 连续 Hover

`continuousHover` 默认 `true`。视觉层挂在合法的 Table viewport 中，但测量和
交互由 `tbody` 管理；它只跟随真实数据行，跳过 Skeleton 与 loading-spinner 行。
Table 行没有间隙，因此使用 direct 几何模式：pointer 直接命中当前行，不登记逐行
ResizeObserver，也不在 pointermove 时扫描全部行。TableRow / TableCell 不再绘制自己的
hover 背景；关闭 `continuousHover` 后不显示行背景。
