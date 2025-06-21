# 第四章：多值依赖与第四范式（4NF）笔记

## 1. 多值依赖（Multivalued Dependencies, MVD）

### 定义：
- **多值依赖 X->->Y** 表示如果两个元组在属性集 X 上取值相同，那么它们的 Y 分量可以交换，结果仍然是关系中的合法元组。
- 换句话说：对于每个 X 的取值，Y 的值独立于 R - X - Y 的其他属性。

### 示例：
在关系 `Drinkers(name, addr, phones, beersLiked)` 中：

- `name ->-> phones` 和 `name ->-> beersLiked` 表示一个饮者的电话号码和喜欢的啤酒是相互独立的。
- 因此，每个电话号码会与每种喜欢的啤酒组合出现。


## 2. 多值依赖与函数依赖的关系

- **每一个函数依赖都是一个多值依赖**（推广规则）：
  - 如果 $X \rightarrow Y $，则 $ X \rightarrow\rightarrow Y$。
- **补集规则**（Complementation）：
  - 如果 $X \rightarrow\rightarrow Y$，且 Z 是所有其他属性的集合，则 $X \rightarrow\rightarrow Z$。


## 3. 多值依赖的特性

- **不能像函数依赖那样进行分解**：
  - 左边不能拆分；
  - 右边也不能随意拆分，有时需要保留多个属性。

### 示例：
关系 `Drinkers(name, areaCode, phone, beersLiked, manf)` 中：

- `name ->-> areaCode phone`
- `name ->-> beersLiked manf`

表示一个饮者可能有多个电话（areaCode + phone），也可能喜欢多种啤酒（beersLiked + manf），而这两组信息是彼此独立的。


## 4. 第四范式（Fourth Normal Form, 4NF）

### 定义：
- 一个关系 R 在 **4NF** 中，当且仅当对于任何非平凡的 MVD $ X \rightarrow\rightarrow Y $，X 都是一个超键（superkey）。

> 非平凡 MVD 指的是：
> 1. Y 不是 X 的子集；
> 2. X 和 Y 并不一起包含所有属性。

### 4NF 与 BCNF 的区别：

| 范式 | 依据 |
|------|------|
| **BCNF** | 基于函数依赖（FD） |
| **4NF** | 基于多值依赖（MVD） |

- 所有 FD 都是 MVD，所以如果关系满足 4NF，它也一定满足 BCNF。
- 但反过来不一定成立，因为 BCNF 不考虑 MVD。


## 5. 4NF 的分解方法

如果存在违反 4NF 的 MVD $X \rightarrow\rightarrow Y$，我们可以将关系 R 分解为：

1. $XY$
2. $R - (Y - X)$

即保留 $X$ 和 $Y$ 的部分，以及去掉 $Y - X$ 后的其余部分。

### 示例：
关系 `Drinkers(name, addr, phones, beersLiked)` 中：

- 存在 MVD `name ->-> phones` 和 `name ->-> beersLiked`
- 分解步骤：
  1. 根据 `name -> addr` 分解为：
     - `Drinkers1(name, addr)`
     - `Drinkers2(name, phones, beersLiked)`
  2. 继续对 `Drinkers2` 分解（根据 MVD）：
     - `Drinkers3(name, phones)`
     - `Drinkers4(name, beersLiked)`


## 6. 推理机制：如何判断是否满足某个依赖？

使用 **Tableau 方法** 来推理是否能从已知的 FDs 和 MVDs 推导出某个目标依赖。

### 步骤：
1. 构造一个初始的 Tableau，两行数据：
   - 对左部属性取值相同；
   - 对其他属性取不同值（用下标区分）。
2. 应用已知的 FD 和 MVD 规则逐步修改 Tableau。
3. 判断是否能够推导出目标依赖。

#### 应用 FD：
- 如果某两个元组在 X 上相同，则强制它们在 Y 上也相同。

#### 应用 MVD：
- 如果两个元组在 X 上相同，则生成新的元组，交换它们的 Y 分量。

### 示例推理：
证明：如果 $A \rightarrow\rightarrow BC$ 且 $D \rightarrow C$，则 $A \rightarrow C$。

通过构造 Tableau 并应用 MVD 和 FD 规则，最终可推导出 c1 = c2，从而证明结论。


## 7. 为什么研究 MVD 和 4NF 很重要？

1. **消除冗余**：
   - MVD 引起的数据冗余不同于 FD 引起的冗余。
   - 即使在 BCNF 下也无法完全消除这种冗余，因此需要 4NF。

2. **规范化过程的一部分**：
   - 当我们进行关系分解时，需要考虑投影后的 FD 和 MVD 是否保持。

3. **逻辑推理工具**：
   - 使用 Tableau 方法可以帮助我们验证复杂依赖是否成立。


## 总结

| 概念 | 描述 |
|------|------|
| **多值依赖（MVD）** | 描述属性之间的“独立性”，用于表达某些属性的组合是交叉重复的。 |
| **4NF** | 更强的范式，要求所有非平凡的 MVD 的左部是超键。 |
| **分解策略** | 类似于 BCNF，但基于 MVD 进行分解，以消除冗余。 |
| **Tableau 推理法** | 一种用于判断是否满足特定 FD 或 MVD 的工具，适用于复杂的依赖推理。 |

