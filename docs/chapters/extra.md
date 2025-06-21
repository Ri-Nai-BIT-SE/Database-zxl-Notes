以下是对上传的课件《14 tp.pdf》中内容的详细笔记整理，涵盖主要知识点和细节信息：

---

## **Chapter 14: More on Transaction Processing**

### **1. Cascading Rollback and Recoverable Schedules**
- **Cascading Rollback**：
  - 某个事务的回滚导致其他事务也必须回滚。
  - 示例：`Tj`写入了数据项A，`Ti`读取了A。如果`Tj`被中止，而`Ti`已经提交，则可能导致数据不一致。
  - 避免方式：通过可避免级联回滚（ACR, Avoids Cascading Rollback）的调度。

- **Recoverable Schedule**：
  - 定义：如果一个事务`Ti`从另一个事务`Tj`读取数据，那么在`Ti`提交之前，`Tj`必须已经提交。
  - 数学表达：若`Tj ⇒S Ti`且`Ci ∈ S`，则`Cj <S Ci`。

- **Non-Persistent Commit**：
  - 如果某个事务提交后，系统崩溃，其更改可能未持久化，这是不可接受的。
  - 避免方法：确保所有事务在提交前将日志记录写入磁盘。

---

### **2. Deadlocks**

#### **Deadlock Detection**
- **Wait-for Graph**：
  - 每个节点表示一个事务。
  - 边`Ti → Tj`表示事务`Ti`等待事务`Tj`释放锁。
  - 当图中出现环时，表示存在死锁。
  - 解决方案：选择一个事务作为“受害者”进行回滚。

#### **Deadlock Prevention**
- **Resource Ordering**：
  - 对所有资源进行编号，事务只能按编号递增顺序请求锁。
  - 缺点：现实中难以实现，因为事务可能无法提前知道需要哪些资源。

- **Timeout**：
  - 如果事务等待时间超过预设阈值（如L秒），则回滚该事务。
  - 简单但不够灵活，难以选择合适的L值。

- **Wait-Die Scheme**：
  - 事务具有时间戳（ts），只有当`ts(Ti) < ts(Tj)`时，`Ti`才能等待`Tj`，否则`Ti`死亡并重试。
  - **Starvation问题**：如果事务死亡后使用原始时间戳重试，则不会发生饥饿。

- **Wound-Wait Scheme**：
  - 如果`ts(Ti) < ts(Tj)`，则`Ti`可以“伤害”`Tj`（即让`Tj`回滚），否则`Ti`等待。
  - **Starvation问题**：死亡事务使用原始时间戳重试，可以避免饥饿。

---

### **3. View Serializability**
- **定义**：
  - 两个调度`S1`和`S2`是view-equivalent的，如果它们满足以下条件：
    1. 对于每个数据项`A`，最终写入`A`的事务相同。
    2. 对于每个事务`Ti`，它读取的初始值相同。
    3. 对于每个事务`Ti`，它读取的由其他事务写入的值相同。

- **View Serializable Schedule**：
  - 一个调度是view serializable的，如果它与某个串行调度view-equivalent。

---

### **4. Distributed Transactions**
- **Two-Phase Commit (2PC)**：
  - 协调者（Coordinator）负责协调多个参与者的提交或中止操作。
  - 阶段一：准备阶段（询问参与者是否准备好）。
  - 阶段二：提交或中止阶段。

- **Three-Phase Commit (3PC)**：
  - 在2PC基础上引入超时机制，减少阻塞风险。

---

### **5. Long Transactions**
- **Nested Transactions**：
  - 事务内部可以包含子事务。
  - 子事务可以独立提交或中止，不影响父事务。
  - 父事务提交时，所有子事务必须已提交；父事务中止时，所有子事务必须回滚。

- **Compensation Transactions**：
  - 用于撤销长事务的部分操作。
  - 补偿事务不能完全恢复数据库到原始状态，只能保证逻辑一致性。

- **Sagas**：
  - 一种处理长事务的方法。
  - 每个步骤都有对应的补偿事务。
  - 语义原子性：要么执行所有步骤，要么执行所有补偿步骤。

---

### **6. Locking Mechanisms**
- **Record-Level Locking vs Page-Level Latching**：
  - 记录级锁控制对具体数据项的并发访问。
  - 页面级latch用于保护物理存储结构，在页面操作期间短暂持有。

- **Logical Actions in Logging**：
  - 日志记录包括插入、删除、更新等逻辑操作。
  - Undo/Redo操作需要幂等性（idempotent）。

- **Log Sequence Number (LSN)**：
  - 每条日志记录有一个唯一编号。
  - 页面上的LSN用于判断是否需要应用日志中的操作。

---

### **7. Recovery Process**
- **Recovery Strategy**：
  1. **重建崩溃时刻的状态**：
     - 找到最后一个检查点`Ck`，确定活跃事务集合`ac`。
     - 从检查点开始扫描日志，应用Redo操作。
  2. **回滚未提交的事务**：
     - 扫描日志反向应用Undo操作。
     - 对于未完全回滚的事务，继续读取更早的日志记录并执行Undo。

- **Example of Log During Recovery**：
  ```
  | chk pt
  | ...
  | lsn=21 T1 a1 p1
  | ...
  | lsn=27 T1 a2 p2
  | ...
  | lsn=29 T1 a3 p3
  | ...
  | lsn=31 T1 a3-1 p3
  | ...
  | lsn=35 T1 a2-1 p2
  | ...
  ```

- **Committed transactions are rolled forward and written to the database**.
- **Uncommitted transactions are rolled back and not written to the database**.

---

### **8. SQL Server Recovery Process**
- **BEGIN** 和 **COMMIT** 标记事务的开始和结束。
- **CHECKPOINT** 将内存中的脏页写入磁盘。
- **Recovery** 过程分为两个阶段：
  - Redo Phase：重放已提交事务的日志操作。
  - Undo Phase：撤销未提交事务的操作。

---

### **9. Summary**
- **Cascading Rollback**：可通过可恢复调度避免。
- **Deadlocks**：可以通过检测（Wait-for Graph）或预防（Resource Ordering, Timeout, Wait-Die, Wound-Wait）解决。
- **Nested Transactions**：支持子事务嵌套，提供更细粒度的控制。
- **Multi-level View**：逻辑操作与物理操作分离，提高并发性和恢复效率。

---

以上为根据课件内容整理的详细知识点，涵盖了事务处理中的核心概念和实现机制。
以下是基于你上传的课件《15 View Serializability.pdf》整理的详细笔记，涵盖所有主要知识点和细节内容：

---

## **Chapter 15: View Serializability**

### **1. 引入背景**
- 并发控制的目标是确保调度（schedule）与某个串行调度等价。
- 常见的等价关系包括：
  - **Conflict Equivalence**（冲突等价）
  - **View Equivalence**（视图等价）

### **2. Conflict Serializability vs View Serializability**
| 概念 | 冲突可串行化（Conflict Serializable） | 视图可串行化（View Serializable） |
|------|----------------------------------------|----------------------------------|
| 定义 | 调度可以通过交换非冲突操作转换为串行调度 | 调度在“读取什么值”和“最终写入”方面与某个串行调度相同 |
| 等价性 | 更严格 | 更宽松 |
| 包含关系 | 所有冲突可串行化的调度都是视图可串行化的 | 有些视图可串行化的调度不是冲突可串行化的 |

### **3. Motivating Example**
考虑以下调度 Q：
```
Q = r1(A) w2(A) w1(A) w3(A)
```
- 其优先图 P(Q) 不是无环的 → 不是冲突可串行化的。
- 但它与某个串行调度（如 T1→T2→T3）具有相同的读取行为和最终状态。

### **4. View Equivalence 的定义**
两个调度 S1 和 S2 是 **view equivalent** 的，当且仅当满足以下三个条件：

1. 如果在 S1 中事务 Ti 写 A，然后事务 Tj 读 A，则在 S2 中也必须存在同样的读写顺序。
   - 即：`wj(A) ⇒ ri(A)` 在 S1 和 S2 中都成立。

2. 如果在 S1 中事务 Ti 读 A 的初始值（即未被任何事务写过），那么在 S2 中也必须如此。

3. 如果在 S1 中事务 Ti 是最后一个写 A 的事务，那么在 S2 中也必须由 Ti 最后写 A。

> 符号说明：
> - `⇒` 表示“读到了该事务写的值”。

### **5. View Serializable 的定义**
一个调度 S 是 **view serializable** 的，如果它与某个串行调度是 view equivalent 的。

### **6. 关系总结**
- 所有 **conflict serializable** 的调度也是 **view serializable** 的。
- 但反之不成立。存在一些 **view serializable** 的调度不是 **conflict serializable** 的。

### **7. 示例分析**
#### 示例 1:
```
Q = r1(A) w2(A) w1(A) w3(A)
Ss（串行调度）= T1 → T2 → T3
```
- Q 和 Ss 都让 T1 读到初始值，T2、T3 读到 T1 写的值。
- 最终 A 的状态一致。
- 因此 Q 是 view serializable 的。

#### 示例 2:
```text
Z = wb(A) r1(A) w2(A) r3(A) w1(A) w3(A) rf(A)
```
- 添加 Tb（初始化所有数据）和 Tf（读取所有数据）后构建优先图。
- 优先图无环 → Z 是 view serializable 的。

### **8. View Serializability 测试方法**
测试一个调度是否是 view serializable 的步骤如下：

#### 步骤 1: 添加虚拟事务
- **Tb（Begin transaction）**：在调度开始前写入所有数据库对象（用于消除第2条约束）。
- **Tf（Final transaction）**：在调度结束后读取所有数据库对象（用于消除第3条约束）。

#### 步骤 2: 构建带标签的优先图（Labeled Precedence Graph, LP(S)）
- 对于每个 `wi(A) ⇒ rj(A)`，添加边 `Ti → Tj`。
- 对于每个 `wk(A)`，检查是否存在其他事务涉及 A，并根据以下规则插入额外的边：
  - 如果 `Ti ≠ Tb` 且 `Tj ≠ Tf`，则插入 `Tk → Ti` 和 `Tj → Tk`。
  - 如果 `Ti = Tb` 且 `Tj ≠ Tf`，则插入 `Tj → Tk`。
  - 如果 `Ti ≠ Tb` 且 `Tj = Tf`，则插入 `Tk → Ti`。

#### 步骤 3: 判断图是否有环
- 对于每一对带有不同标签（p ≠ 0）的边，选择其中一条。
- 如果最终图是无环的，则该调度是 view serializable 的。

### **9. View Serializability 的复杂性**
- 相较于 conflict serializability，view serializability 的判断更复杂。
- 时间复杂度较高，不适合实时检测。
- 但在理论研究和某些特定场景中仍有应用价值。

### **10. “Useless Write” 的影响**
- 有些调度包含没有被任何事务读取的写操作（称为 useless write）。
- 这些写操作不影响最终状态，但在 view serializability 中仍需考虑它们对读操作的影响。

#### 示例：
```
S = w1(A) r2(A) w2(B) r1(B) w3(A) w3(B)
```
- 如果只关心最终状态，可以忽略 T1 和 T2。
- 如果关注事务的读取行为（即 view equivalence），则不能忽略这些事务。

### **11. 重要结论**
- 如果一个调度中没有“blind writes”（即每个写操作都有对应的读操作），那么该调度是 view serializable 的当且仅当它是 conflict serializable 的。
- 换句话说，**所有不是 conflict serializable 但却是 view serializable 的调度都包含 blind writes**。

### **12. 数学证明要点**
假设调度 S1 是 view serializable 的，并且没有任何 blind writes：
- 存在一个串行调度 Ss，使得 S1 与 Ss view equivalent。
- 若 S1 中存在 `w1(A)` 后 `r2(A)`，则在 Ss 中也必须是 T1 先执行。
- 类似地，若存在中间事务 T3 读并写 A，则其执行顺序也必须保持。
- 因此，在这种情况下，view serializability 和 conflict serializability 是等价的。

### **13. 实际意义**
- **Conflict serializability** 更容易检测，适用于大多数实际系统。
- **View serializability** 更宽松，允许更多并发，但代价是更高的检测成本。
- 在设计并发控制机制时，可以根据需求选择合适的模型。

---

### **总结**
| 概念 | 是否包含 | 备注 |
|------|----------|------|
| Conflict Serializable | ⊂ View Serializable | 更严格 |
| View Serializable | ⊃ Conflict Serializable | 更宽松 |
| Useless Writes | 可能存在于 V-S 中 | 不影响最终状态 |
| Blind Writes | 必须存在于非 C-S 的 V-S 调度中 | 是两者的区别点 |
| 检测难度 | 较高 | 适合理论分析 |

---

以上是对《15 View Serializability.pdf》课件内容的完整整理与归纳，涵盖了从基本概念到高级理论分析的所有核心知识点。
