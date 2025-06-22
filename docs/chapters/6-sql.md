# 数据库复习笔记（PL/SQL 版本）

> **说明**: 本笔记已统一采用 Oracle PL/SQL 语法，包括数据类型、存储过程、函数、触发器等所有示例代码。

## 一、基础 SQL 查询（SELECT-FROM-WHERE）

### 核心语法结构

SQL 查询的基础是 `SELECT-FROM-WHERE` 结构，用于从数据库中检索数据。

* **`SELECT`**: 指定你希望从结果中返回的列。
    * **支持表达式**: 你可以在 `SELECT` 语句中使用表达式来计算新值。
        ```sql
        SELECT price * 1.1 AS priceInYen FROM Sells;
        ```
    * **支持常量**: 也可以在结果中加入常量值。
        ```sql
        SELECT 'likes Bud' AS whoLikesBud FROM Likes;
        ```
* **`FROM`**: 指定查询的数据来源表。
    * **多表并列**: 可以同时指定多个表进行查询，这将产生它们的笛卡尔积。
        ```sql
        FROM Likes, Frequents
        ```
    * **子查询**: 也可以将另一个查询的结果作为数据源。
        ```sql
        FROM (SELECT beer, price FROM Sells WHERE bar = 'Joe''s Bar') AS JoeSells
        ```
* **`WHERE`**: 用于筛选满足特定条件的行。
    * **布尔运算符**: `AND`, `OR`, `NOT` 用于组合多个条件。
        ```sql
        WHERE bar = 'Joe''s Bar' AND price > 3.00
        ```
    * **比较运算符**: `=`, `>`, `<`, `>=`, `<=`, `<>` (不等于)。
        ```sql
        WHERE customer_age >= 18
        ```
    * **模式匹配**: `LIKE` 用于进行字符串模式匹配，`%` 匹配任意字符序列，`_` 匹配任意单个字符。
        ```sql
        WHERE phone_number LIKE '%555-%'
        ```
    * **范围查询**: `BETWEEN ... AND ...` 用于指定一个值的范围（包含边界）。
        ```sql
        WHERE quantity BETWEEN 10 AND 20
        ```
    * **集合查询**: `IN` 用于检查一个值是否在某个集合中（通常是子查询的结果集）。
        ```sql
        WHERE product_category IN ('Electronics', 'Books')
        WHERE customer_id IN (SELECT id FROM PremiumCustomers)
        ```

### 结果处理

* **`DISTINCT`**: 用于消除结果集中的重复行。
    ```sql
    SELECT DISTINCT price FROM Sells;
    ```
* **`ORDER BY`**: 用于对结果集进行排序。
    * `ASC`: 升序（默认）。
    * `DESC`: 降序。
    ```sql
    SELECT beer, price FROM Sells ORDER BY beer ASC, price DESC;
    ```
* **`TOP n` (SQL Server 扩展)**: 返回结果集的前 n 条记录。
    * `WITH TIES`: 如果有多条记录在排序上与第 n 条记录并列，则也会包含这些记录。
    ```sql
    SELECT TOP 5 WITH TIES product_name, price FROM Products ORDER BY price DESC;
    ```

### 多表查询与 JOIN 操作

`JOIN` 操作用于将两个或多个表中的行基于相关列组合起来。

* **交叉连接（CROSS JOIN）**: 返回两个表的笛卡尔积，即第一个表的每一行与第二个表的每一行组合。
    ```sql
    SELECT * FROM TableA CROSS JOIN TableB;
    ```
* **自然连接（NATURAL JOIN）**: 自动查找两个表中所有同名的列，并基于这些列相等来连接。
    ```sql
    SELECT * FROM TableA NATURAL JOIN TableB;
    ```
* **内连接（INNER JOIN）**: 只返回两个表中满足连接条件的行。这是最常用的连接类型。
    ```sql
    SELECT R.a, S.c FROM R INNER JOIN S ON R.b = S.b;
    ```
* **外连接（OUTER JOIN）**: 返回满足连接条件的行，同时保留某个表（或两个表）中不匹配的行。
    * **左外连接（LEFT OUTER JOIN / LEFT JOIN）**: 返回左表的所有行，以及右表中满足连接条件的行。右表中不匹配的行将用 `NULL` 填充。
        ```sql
        SELECT * FROM Orders LEFT JOIN Customers ON Orders.customer_id = Customers.id;
        ```
    * **右外连接（RIGHT OUTER JOIN / RIGHT JOIN）**: 返回右表的所有行，以及左表中满足连接条件的行。左表中不匹配的行将用 `NULL` 填充。
        ```sql
        SELECT * FROM Orders RIGHT JOIN Customers ON Orders.customer_id = Customers.id;
        ```
    * **全外连接（FULL OUTER JOIN / FULL JOIN）**: 返回左表和右表的所有行。如果某个表中没有匹配的行，则对应的列将用 `NULL` 填充。
        ```sql
        SELECT * FROM TableA FULL JOIN TableB ON TableA.id = TableB.id;
        ```
:::details 示例
当然可以！下面是每种 JOIN 类型的详细示例，包括表结构和数据，并展示查询结果。


#### 📌 准备工作：创建两个示例表

##### 表 `TableA`（员工信息）
| id  | name    |
| --- | ------- |
| 1   | Alice   |
| 2   | Bob     |
| 3   | Charlie |

##### 表 `TableB`（部门信息）
| emp_id | dept  |
| ------ | ----- |
| 1      | HR    |
| 2      | IT    |
| 4      | Sales |


#### 1️⃣ 交叉连接（CROSS JOIN）

##### 示例 SQL：
```sql
SELECT * FROM TableA CROSS JOIN TableB;
```

##### 查询结果：

| id  | name    | emp_id | dept  |
| --- | ------- | ------ | ----- |
| 1   | Alice   | 1      | HR    |
| 1   | Alice   | 2      | IT    |
| 1   | Alice   | 4      | Sales |
| 2   | Bob     | 1      | HR    |
| 2   | Bob     | 2      | IT    |
| 2   | Bob     | 4      | Sales |
| 3   | Charlie | 1      | HR    |
| 3   | Charlie | 2      | IT    |
| 3   | Charlie | 4      | Sales |

> ✅ **说明**：返回的是两个表的笛卡尔积，所有组合都列出来。


#### 2️⃣ 自然连接（NATURAL JOIN）

假设两表中都有一个同名字段 `id` 和 `emp_id`，但自然连接只匹配**相同列名且值相等**的列。

我们先修改一下 `TableB` 字段为 `id` 来演示：

##### 修改后 `TableB`
| id  | dept  |
| --- | ----- |
| 1   | HR    |
| 2   | IT    |
| 4   | Sales |

##### 示例 SQL：
```sql
SELECT * FROM TableA NATURAL JOIN TableB;
```

##### 查询结果：

| id  | name  | dept |
| --- | ----- | ---- |
| 1   | Alice | HR   |
| 2   | Bob   | IT   |

> ✅ **说明**：只保留了 `id` 列相同的行。


#### 3️⃣ 内连接（INNER JOIN）

##### 示例 SQL：
```sql
SELECT TableA.id, TableA.name, TableB.dept
FROM TableA INNER JOIN TableB ON TableA.id = TableB.emp_id;
```

##### 查询结果：

| id  | name  | dept |
| --- | ----- | ---- |
| 1   | Alice | HR   |
| 2   | Bob   | IT   |

> ✅ **说明**：只返回两个表中匹配的部分（即 `id = emp_id` 的行）。


#### 4️⃣ 左外连接（LEFT JOIN）

##### 示例 SQL：
```sql
SELECT TableA.id, TableA.name, TableB.dept
FROM TableA LEFT JOIN TableB ON TableA.id = TableB.emp_id;
```

##### 查询结果：

| id  | name    | dept |
| --- | ------- | ---- |
| 1   | Alice   | HR   |
| 2   | Bob     | IT   |
| 3   | Charlie | NULL |

> ✅ **说明**：左表（TableA）所有记录都会保留，右表没有匹配则用 `NULL` 填充。


#### 5️⃣ 右外连接（RIGHT JOIN）

##### 示例 SQL：
```sql
SELECT TableA.id, TableA.name, TableB.dept
FROM TableA RIGHT JOIN TableB ON TableA.id = TableB.emp_id;
```

##### 查询结果：

| id   | name  | dept  |
| ---- | ----- | ----- |
| 1    | Alice | HR    |
| 2    | Bob   | IT    |
| NULL | NULL  | Sales |

> ✅ **说明**：右表（TableB）的所有记录都会保留，左表没有匹配则用 `NULL` 填充。


#### 6️⃣ 全外连接（FULL JOIN）

注意：MySQL 不支持 `FULL JOIN`，可以用 `UNION` 模拟。这里以 PostgreSQL 等支持的数据库为例。

##### 示例 SQL：
```sql
SELECT TableA.id, TableA.name, TableB.dept
FROM TableA FULL JOIN TableB ON TableA.id = TableB.emp_id;
```

##### 查询结果：

| id   | name    | dept  |
| ---- | ------- | ----- |
| 1    | Alice   | HR    |
| 2    | Bob     | IT    |
| 3    | Charlie | NULL  |
| NULL | NULL    | Sales |

> ✅ **说明**：左表和右表所有记录都会保留，不匹配部分用 `NULL` 填充。


#### ✅ 总结对比表：

| JOIN 类型    | 是否保留 TableA 所有行 | 是否保留 TableB 所有行 | 匹配条件是否满足才显示 |
| ------------ | ---------------------- | ---------------------- | ---------------------- |
| CROSS JOIN   | 是                     | 是                     | 否                     |
| NATURAL JOIN | 否                     | 否                     | 是                     |
| INNER JOIN   | 否                     | 否                     | 是                     |
| LEFT JOIN    | 是                     | 否                     | 部分是                 |
| RIGHT JOIN   | 否                     | 是                     | 部分是                 |
| FULL JOIN    | 是                     | 是                     | 部分是                 |


如果你希望我用具体的数据建表语句（如 CREATE TABLE + INSERT），也可以告诉我，我可以补上完整的建表与插入语句。
:::

## 二、子查询与高级查询

### 子查询类型

子查询（或内查询）是嵌套在另一个 SQL 查询中的查询。

* **单行子查询**: 返回单个值（一列一行）。通常与单值比较运算符（`=`, `>`, `<`, etc.）一起使用。
    ```sql
    SELECT product_name FROM Products WHERE price = (SELECT MIN(price) FROM Products);
    ```
* **多行子查询**: 返回一个列的多个值。通常与 `IN`, `ANY`, `ALL` 等运算符一起使用。
    * **`IN`**: 检查一个值是否在子查询返回的集合中。
        ```sql
        SELECT name FROM Beers WHERE name IN (SELECT beer FROM Likes WHERE drinker = 'John');
        ```
    * **`ANY`**: 如果与子查询结果中的**任何一个**值满足条件，则为真。
        ```sql
        SELECT beer FROM Sells WHERE price > ANY (SELECT price FROM Sells WHERE bar = 'Joe''s Bar');
        -- 含义：如果某个啤酒的价格比 'Joe''s Bar' 中任何一种啤酒的价格都高，则返回该啤酒。
        ```
    * **`ALL`**: 如果与子查询结果中的**所有**值都满足条件，则为真。
        ```sql
        SELECT beer FROM Sells WHERE price >= ALL (SELECT price FROM Sells WHERE bar = 'Joe''s Bar');
        -- 含义：如果某个啤酒的价格比 'Joe''s Bar' 中所有啤酒的价格都高或相等，则返回该啤酒。
        ```
* **相关子查询**: 子查询的执行依赖于外层查询的每一行。子查询中会引用外层查询的列。
    ```sql
    SELECT bar FROM Frequents outer_freq
    WHERE EXISTS (SELECT * FROM Sells WHERE Sells.bar = outer_freq.bar AND Sells.price < 3.00);
    -- 含义：找出有顾客光顾，并且销售价格低于3.00的酒吧。
    ```
:::details 子查询与JOIN示例

当然可以！我们来详细讲一下 **子查询** 和 **JOIN** 之间的关系与区别，帮助你理解它们在实际开发中如何选择使用。


#### 🧠 子查询 vs JOIN：核心区别

| 特性 | 子查询（Subquery） | JOIN |
|------|---------------------|------|
| **作用** | 嵌套查询，先执行内层再处理外层 | 多表连接，一次性合并多个表的数据 |
| **返回结果** | 单值、单列、多列等 | 多行多列的组合 |
| **性能** | 在某些情况下效率较低 | 通常比子查询更高效 |
| **可读性** | 对新手友好，逻辑清晰 | 稍复杂，但结构清晰 |
| **适用场景** | 需要依赖外部查询的结果时（相关子查询），或只需要一个值做比较 | 需要从多个表中获取数据并进行关联 |


#### 🔁 举例对比：子查询和 JOIN 的等价转换

##### 示例背景：

有两个表：

##### `Customers`（客户表）
| customer_id | name    |
|-------------|---------|
| 1           | Alice   |
| 2           | Bob     |
| 3           | Charlie |

##### `Orders`（订单表）
| order_id | customer_id | amount |
|----------|-------------|--------|
| 101      | 1           | 100    |
| 102      | 2           | 50     |


#### ✅ 示例 1：查找下过订单的客户（INNER JOIN）

##### 使用 JOIN：
```sql
SELECT DISTINCT c.name
FROM Customers c
JOIN Orders o ON c.customer_id = o.customer_id;
```

##### 查询结果：
| name  |
|-------|
| Alice |
| Bob   |


##### 使用子查询（IN）：
```sql
SELECT name
FROM Customers
WHERE customer_id IN (SELECT customer_id FROM Orders);
```

> ✅ 这两个语句是等效的，都能找到有订单的客户。


#### ✅ 示例 2：查找没有下过订单的客户（LEFT JOIN + IS NULL vs NOT IN）

##### 使用 LEFT JOIN：
```sql
SELECT c.name
FROM Customers c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
```

##### 查询结果：
| name    |
|---------|
| Charlie |


##### 使用 NOT IN 子查询：
```sql
SELECT name
FROM Customers
WHERE customer_id NOT IN (SELECT customer_id FROM Orders);
```

> ✅ 同样可以达到目的。注意：如果子查询中包含 `NULL`，`NOT IN` 可能会出问题。


#### ✅ 示例 3：相关子查询 vs JOIN（需要引用外层字段）

##### 目标：找出每个客户最近的一笔订单金额（假设有一个 `order_date` 字段）

###### 表 `Orders`（扩展版）
| order_id | customer_id | amount | order_date |
|----------|-------------|--------|------------|
| 101      | 1           | 100    | 2024-01-01 |
| 102      | 1           | 150    | 2024-03-10 |
| 103      | 2           | 50     | 2024-02-15 |


##### 使用相关子查询：
```sql
SELECT o1.customer_id, o1.amount
FROM Orders o1
WHERE o1.order_date = (
    SELECT MAX(o2.order_date)
    FROM Orders o2
    WHERE o2.customer_id = o1.customer_id
);
```

> ✅ 这里子查询依赖于外层查询的 `o1.customer_id`，所以叫“相关子查询”。


##### 使用 JOIN（GROUP BY）：
```sql
SELECT o.customer_id, MAX(o.order_date) AS latest_date, MAX(o.amount) AS latest_amount
FROM Orders o
JOIN (
    SELECT customer_id, MAX(order_date) AS max_date
    FROM Orders
    GROUP BY customer_id
) AS latest
ON o.customer_id = latest.customer_id AND o.order_date = latest.max_date;
```

> ✅ 这种方式更复杂，但性能更好，适合大数据量。


#### 📊 总结：何时用 JOIN？何时用子查询？

| 场景 | 推荐使用 |
|------|-----------|
| 获取多个表中的字段，做组合展示 | JOIN |
| 只需判断某个字段是否存在/满足条件 | 子查询（如 IN、EXISTS） |
| 需要逐行处理外层数据 | 相关子查询 |
| 高性能需求，尤其在大数据量下 | JOIN |
| 逻辑简单，代码易懂 | 子查询 |
| 子查询结果为空可能导致错误（如 NOT IN） | 尽量避免，改用 LEFT JOIN |


#### 🧩 温馨提示：EXISTS vs IN vs JOIN 的选择

| 操作 | 说明 | 推荐使用场景 |
|------|------|---------------|
| `EXISTS` | 判断是否存在匹配项，性能好 | 当只关心是否存在记录时 |
| `IN` | 匹配集合中的值 | 数据量小且无 NULL 时可用 |
| `JOIN` | 获取完整信息 | 要显示多个字段时优先考虑 |


:::
### 集合操作

集合操作符用于合并或比较两个或多个查询的结果集。参与集合操作的查询结果必须具有相同数量的列，且对应列的数据类型兼容。

* **`UNION`**: 返回两个查询结果的并集，并自动去除重复行。
    ```sql
    SELECT name FROM Customers UNION SELECT name FROM Employees;
    ```
* **`UNION ALL`**: 返回两个查询结果的并集，保留所有重复行。
    ```sql
    SELECT city FROM Suppliers UNION ALL SELECT city FROM Customers;
    ```
* **`INTERSECT`**: 返回两个查询结果的交集（同时存在于两个结果集中的行）。
    ```sql
    SELECT customer_id FROM Orders INTERSECT SELECT customer_id FROM Returns;
    ```
* **`EXCEPT` (或 `MINUS` 在 Oracle)**: 返回第一个查询结果中有，但第二个查询结果中没有的行。
    ```sql
    SELECT product_id FROM AllProducts EXCEPT SELECT product_id FROM SoldProducts;
    ```


## 三、存储过程与函数（PSM/PL/SQL）

### 存储过程（Stored Procedures）

存储过程是一组预编译的 SQL 语句，存储在数据库中，可以被多次调用执行。它们通常用于执行复杂的业务逻辑或批处理任务。

* **参数模式**:
    * **`IN`**: 输入参数。在调用时传入值，存储过程内部只能读取。
        ```sql
        CREATE OR REPLACE PROCEDURE GetCustomerName (customerId IN NUMBER)
        IS
        BEGIN
            -- 过程体
            NULL;
        END GetCustomerName;
        /
        ```
    * **`OUT`**: 输出参数。存储过程内部可以修改其值，并在执行结束后将值返回给调用者。
        ```sql
        CREATE OR REPLACE PROCEDURE GetProductPrice (
            productId IN NUMBER, 
            productPrice OUT NUMBER
        )
        IS
        BEGIN
            SELECT price INTO productPrice 
            FROM Products 
            WHERE product_id = productId;
        END GetProductPrice;
        /
        ```
    * **`IN OUT`**: 输入输出参数。调用时传入值，存储过程内部可以读取和修改，并在执行结束后将修改后的值返回。
        ```sql
        CREATE OR REPLACE PROCEDURE UpdateCounter (currentCount IN OUT NUMBER)
        IS
        BEGIN
            currentCount := currentCount + 1;
        END UpdateCounter;
        /
        ```
* **调用方式**:
    ```sql
    -- 在PL/SQL块中调用
    DECLARE
        v_customer_id NUMBER := 123;
        v_price NUMBER;
        v_counter NUMBER := 10;
    BEGIN
        GetCustomerName(v_customer_id);
        GetProductPrice(1, v_price);
        UpdateCounter(v_counter);
        DBMS_OUTPUT.PUT_LINE('Counter value: ' || v_counter);
    END;
    /
    ```

### 函数（Functions）

函数是另一种预编译的 SQL 语句块，与存储过程类似，但函数必须返回一个值。

* **类型**:
    * **标量函数**: 返回单个值（例如，一个数字、一个字符串）。
        ```sql
        CREATE OR REPLACE FUNCTION CalculateTotalPrice (
            quantity IN NUMBER, 
            unitPrice IN NUMBER
        ) RETURN NUMBER
        IS
        BEGIN
            RETURN quantity * unitPrice;
        END CalculateTotalPrice;
        /
        ```
    * **表函数**: 返回一个表（结果集）。在PL/SQL中通常使用管道函数。
        ```sql
        -- 首先定义对象类型
        CREATE OR REPLACE TYPE product_obj AS OBJECT (
            product_id NUMBER,
            product_name VARCHAR2(100)
        );
        /
        
        CREATE OR REPLACE TYPE product_tab AS TABLE OF product_obj;
        /
        
        -- 创建管道函数
        CREATE OR REPLACE FUNCTION GetProductsByCategory (categoryId IN NUMBER)
        RETURN product_tab PIPELINED
        IS
        BEGIN
            FOR rec IN (SELECT id, name FROM Products WHERE category_id = categoryId) LOOP
                PIPE ROW(product_obj(rec.id, rec.name));
            END LOOP;
            RETURN;
        END GetProductsByCategory;
        /
        ```

### 控制流语句

在存储过程和函数中，你可以使用各种控制流语句来实现复杂的逻辑。

* **条件语句**: 根据条件执行不同的代码块。
    ```sql
    IF condition THEN
        -- statements for true condition
    ELSIF another_condition THEN -- PL/SQL 中使用 ELSIF
        -- statements for another_condition
    ELSE
        -- statements for false condition
    END IF;
    ```
* **循环语句**: 重复执行代码块直到满足特定条件。
    * **`LOOP ... END LOOP;`**: 基本循环，使用 `EXIT` 来退出。
        ```sql
        DECLARE
            i NUMBER := 0;
        BEGIN
            LOOP
                i := i + 1;
                IF i > 10 THEN
                    EXIT;
                END IF;
                -- do something
                DBMS_OUTPUT.PUT_LINE('i = ' || i);
            END LOOP;
        END;
        /
        ```
    * **`WHILE ... LOOP ... END LOOP;`**: 当条件为真时重复执行。
        ```sql
        DECLARE
            i NUMBER := 0;
        BEGIN
            WHILE i < 10 LOOP
                i := i + 1;
                -- do something
                DBMS_OUTPUT.PUT_LINE('i = ' || i);
            END LOOP;
        END;
        /
        ```
    * **`FOR ... LOOP ... END LOOP;`**: 计数循环，PL/SQL特有。
        ```sql
        BEGIN
            FOR i IN 1..10 LOOP
                -- do something
                DBMS_OUTPUT.PUT_LINE('i = ' || i);
            END LOOP;
            
            -- 反向循环
            FOR i IN REVERSE 1..10 LOOP
                DBMS_OUTPUT.PUT_LINE('i = ' || i);
            END LOOP;
        END;
        /
        ```


## 四、游标（Cursors）

游标允许你逐行处理查询结果集。当需要对查询结果中的每一行执行特定的操作时，游标非常有用。

* **声明游标**:
    ```sql
    DECLARE cursor_name CURSOR FOR SELECT column1, column2 FROM table_name WHERE condition;
    ```
* **打开游标**:
    ```sql
    OPEN cursor_name;
    ```
* **获取数据**:
    ```sql
    FETCH cursor_name INTO variable1, variable2;
    ```
* **关闭游标**:
    ```sql
    CLOSE cursor_name;
    ```
* **释放游标**:
    ```sql
    DEALLOCATE cursor_name; -- (SQL Server)
    ```
:::details 游标示例
当然可以！下面我将为你提供一个 **完整的 SQL 游标使用示例**，包括：

- 创建表
- 插入测试数据
- 声明、打开、获取、关闭游标
- 对每一行执行操作（例如输出或更新）

我们将以一个员工工资调整的例子来说明游标的使用。


#### 🧪 示例场景：给每个员工加薪 10%，并打印信息

##### ✅ 使用数据库：Oracle（PL/SQL 版本）


##### 🔧 第一步：创建表并插入数据

```sql
-- 创建员工表
CREATE TABLE Employees (
    EmployeeID NUMBER PRIMARY KEY,
    Name VARCHAR2(50),
    Salary NUMBER(10,2)
);

-- 插入测试数据
INSERT INTO Employees (EmployeeID, Name, Salary) VALUES (1, 'Alice', 5000);
INSERT INTO Employees (EmployeeID, Name, Salary) VALUES (2, 'Bob', 6000);
INSERT INTO Employees (EmployeeID, Name, Salary) VALUES (3, 'Charlie', 4500);
```


#### 🔁 第二步：使用 PL/SQL 游标处理

```sql
-- PL/SQL 块：声明和使用游标
DECLARE
    -- 声明变量用于保存当前行的数据
    v_EmployeeID NUMBER;
    v_Name VARCHAR2(50);
    v_Salary NUMBER(10,2);
    
    -- 声明游标
    CURSOR emp_cursor IS 
        SELECT EmployeeID, Name, Salary 
        FROM Employees;

BEGIN
    -- 启用输出（类似于 SQL Server 的 PRINT）
    DBMS_OUTPUT.ENABLE(1000000);
    
    -- 打开游标
    OPEN emp_cursor;
    
    -- 循环遍历所有行
    LOOP
        -- 获取数据到变量中
        FETCH emp_cursor INTO v_EmployeeID, v_Name, v_Salary;
        
        -- 检查是否还有数据（类似于 @@FETCH_STATUS）
        EXIT WHEN emp_cursor%NOTFOUND;
        
        -- 打印当前员工信息
        DBMS_OUTPUT.PUT_LINE('Processing employee: ' || v_Name || 
                            ', Current salary: ' || TO_CHAR(v_Salary));
        
        -- 更新工资：增加10%
        UPDATE Employees
        SET Salary = Salary * 1.10
        WHERE EmployeeID = v_EmployeeID;
        
    END LOOP;
    
    -- 关闭游标
    CLOSE emp_cursor;
    
    DBMS_OUTPUT.PUT_LINE('Salary update completed!');
    
EXCEPTION
    WHEN OTHERS THEN
        -- 异常处理
        DBMS_OUTPUT.PUT_LINE('Error occurred: ' || SQLERRM);
        ROLLBACK;
END;
/
```

##### 🎯 **PL/SQL 的另一种写法：FOR 循环游标（更简洁）**

```sql
-- 使用 FOR 循环的简化版本
BEGIN
    DBMS_OUTPUT.ENABLE(1000000);
    
    -- FOR 循环自动处理游标的打开、关闭和获取
    FOR emp_rec IN (SELECT EmployeeID, Name, Salary FROM Employees)
    LOOP
        -- 打印当前员工信息
        DBMS_OUTPUT.PUT_LINE('Processing employee: ' || emp_rec.Name || 
                            ', Current salary: ' || TO_CHAR(emp_rec.Salary));
        
        -- 更新工资：增加10%
        UPDATE Employees
        SET Salary = Salary * 1.10
        WHERE EmployeeID = emp_rec.EmployeeID;
        
    END LOOP;
    
    DBMS_OUTPUT.PUT_LINE('Salary update completed!');
    
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error occurred: ' || SQLERRM);
        ROLLBACK;
END;
/
```


#### 👀 第三步：查看结果

```sql
SELECT * FROM Employees;
```

##### 输出结果：

| EmployeeID | Name    | Salary  |
| ---------- | ------- | ------- |
| 1          | Alice   | 5500.00 |
| 2          | Bob     | 6600.00 |
| 3          | Charlie | 4950.00 |


#### 📌 PL/SQL 语法特点

| 功能               | PL/SQL 语法                          | 说明                                 |
| ------------------ | ------------------------------------ | ------------------------------------ |
| **变量声明**       | `v_var NUMBER` (在 DECLARE 块中)     | 变量名通常以 v_ 开头                 |
| **游标声明**       | `CURSOR cur IS ...`                  | 游标声明在 DECLARE 块中              |
| **字符串连接**     | `'str1' || 'str2'`                   | 使用双竖线连接字符串                 |
| **输出语句**       | `DBMS_OUTPUT.PUT_LINE('message')`    | 需要先启用 DBMS_OUTPUT               |
| **循环条件**       | `EXIT WHEN cursor%NOTFOUND`          | 使用游标属性判断状态                 |
| **类型转换**       | `TO_CHAR(value)`, `TO_NUMBER(value)` | 丰富的类型转换函数                   |
| **块结构**         | `DECLARE ... BEGIN ... END;`        | 完整的块结构，以 / 结束              |
| **异常处理**       | `EXCEPTION WHEN ... THEN`            | 强大的异常处理机制                   |
| **条件语句**       | `IF ... THEN ... ELSIF ... END IF;`  | 注意是 ELSIF 不是 ELSEIF             |
| **循环语句**       | `LOOP ... END LOOP;`                 | 多种循环类型：LOOP、WHILE、FOR       |

#### 🎯 PL/SQL 特有优势

| 特性                   | 说明                                   |
| ---------------------- | -------------------------------------- |
| **FOR 循环游标**       | 自动管理游标生命周期，代码更简洁       |
| **隐式游标属性**       | `%FOUND`, `%NOTFOUND`, `%ROWCOUNT` 等  |
| **强类型系统**         | `%TYPE`, `%ROWTYPE` 锚定类型           |
| **嵌套表和集合**       | 支持复杂数据结构                       |
| **包（Package）结构**  | 更好的代码组织和封装                   |


#### 💡 小提示

虽然游标很强大，但它的性能通常不如集合操作（比如直接用 `UPDATE Employees SET Salary = Salary * 1.10`），所以建议在以下情况下使用游标：

- 需要逐行处理（如日志记录、复杂业务逻辑）
- 每行操作依赖于前一行的状态
- 其他方法实现起来太复杂

:::
## 五、权限管理（Authorization）

权限管理是控制用户对数据库对象（如表、视图、存储过程）的访问和操作能力。

### 权限类型

* **表级权限**: 对整个表进行操作的权限。
    * `SELECT`: 读取表数据。
    * `INSERT`: 向表中插入数据。
    * `UPDATE`: 修改表数据。
    * `DELETE`: 删除表数据。
* **列级权限**: 对表中特定列进行操作的权限（粒度更细）。
    * `UPDATE(price)`: 只能更新 `price` 列。
    * `INSERT(name)`: 只能插入 `name` 列。
* **对象权限**: 对数据库对象（如视图、存储过程、触发器）的创建、修改和删除权限。
    * `CREATE`: 创建对象。
    * `ALTER`: 修改对象。
    * `DROP`: 删除对象。

### 授权与撤销

* **授权（GRANT）**: 授予用户权限。
    ```sql
    GRANT SELECT, INSERT ON Products TO user_alice;
    GRANT UPDATE(price) ON Sells TO user_bob;
    GRANT ALL PRIVILEGES ON database_name.* TO user_admin; -- MySQL
    ```
    * **`WITH GRANT OPTION`**: 允许被授权的用户将此权限继续授予其他用户。
        ```sql
        GRANT SELECT ON Customers TO user_charlie WITH GRANT OPTION;
        ```
* **撤销（REVOKE）**: 撤销用户的权限。
    ```sql
    REVOKE DELETE ON Products FROM user_alice;
    ```
    * **`CASCADE`**: 级联撤销。如果被撤销权限的用户又将此权限授予了其他用户，那么这些用户的权限也会被撤销。
        ```sql
        REVOKE SELECT ON Customers FROM user_charlie CASCADE;
        ```
    * **`RESTRICT`**: 限制撤销。如果权限已被被撤销的用户传递给其他用户，则撤销操作会失败。
        ```sql
        REVOKE UPDATE ON Employees FROM user_diana RESTRICT;
        ```


## 六、约束与触发器（Constraints & Triggers）

### 约束类型

约束是用于强制数据库中数据完整性的规则。

* **主键（PRIMARY KEY）**: 唯一标识表中每一行的列或列的组合。主键值必须是唯一的且不能为 `NULL`。
    ```sql
    CREATE TABLE Students (
        student_id NUMBER PRIMARY KEY,
        student_name VARCHAR2(100)
    );
    -- 复合主键
    CREATE TABLE Enrollments (
        student_id NUMBER,
        course_id NUMBER,
        enrollment_date DATE DEFAULT SYSDATE,
        CONSTRAINT PK_Enrollments PRIMARY KEY (student_id, course_id)
    );
    ```
* **唯一约束（UNIQUE）**: 保证指定列中的所有值都是唯一的。与主键不同，允许包含 `NULL` 值，但最多只能有一个 `NULL` 值。
    ```sql
    CREATE TABLE Employees (
        employee_id NUMBER PRIMARY KEY,
        email VARCHAR2(100),
        CONSTRAINT UK_Employees_Email UNIQUE (email)
    );
    ```
* **外键（FOREIGN KEY）**: 用于建立和加强两个表之间数据链接的列（或多列）。它引用另一个表的主键或唯一键。
    ```sql
    CREATE TABLE Orders (
        order_id NUMBER PRIMARY KEY,
        customer_id NUMBER,
        order_date DATE DEFAULT SYSDATE,
        CONSTRAINT FK_Orders_Customer FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
    );
    ```
    * **级联操作**: 当被引用的主键表中的数据发生变化时，外键表中的数据如何响应。
        * `ON DELETE CASCADE`: 当主表中的行被删除时，外键表中的相关行也随之删除。
        * `ON UPDATE CASCADE`: 当主表中的主键被更新时，外键表中的相关外键值也随之更新。
        * `ON DELETE SET NULL`: 当主表中的行被删除时，外键表中的外键值被设置为 `NULL`。
        * `ON DELETE NO ACTION` / `ON DELETE RESTRICT`: 默认行为，如果存在外键引用，则不允许删除主表中的行。
* **检查约束（CHECK）**: 用于限制列中可以接受的值的范围。
    * **列级**:
        ```sql
        CREATE TABLE Products (
            product_id NUMBER PRIMARY KEY,
            price NUMBER(10,2) CHECK (price >= 0.00 AND price <= 5000.00)
        );
        ```
    * **表级**:
        ```sql
        CREATE TABLE Sales (
            sale_id NUMBER PRIMARY KEY,
            bar_name VARCHAR2(100),
            price NUMBER(10,2),
            CONSTRAINT CHK_Sales_Business_Rule CHECK (bar_name = 'Joe''s Bar' OR price <= 5.00)
        );
        ```
* **断言（ASSERTION）**: 对数据库状态的全局约束，不与任何特定表相关联。在实际数据库系统中，断言通常由触发器或存储过程来实现。
    ```sql
    -- 这是一个理论示例，实际数据库可能不支持直接的 CREATE ASSERTION
    CREATE ASSERTION NoRipoffBars
    CHECK (NOT EXISTS (SELECT bar FROM Sells GROUP BY bar HAVING AVG(price) > 5.00));
    ```

### 触发器（Triggers）

触发器是一种特殊的存储过程，它在数据库中发生特定事件（如 `INSERT`, `UPDATE`, `DELETE`）时自动执行。

#### 触发器的作用与用途

* **自动记录日志**: 记录数据变更的历史记录
* **数据验证**: 在数据变更前进行复杂的业务规则验证
* **审计跟踪**: 自动记录谁在什么时候做了什么操作
* **自动更新相关字段**: 如最后修改时间、统计数据等
* **级联操作**: 当一个表的数据变化时，自动更新相关表

#### 触发器分类

* **触发时机**:
    * **`BEFORE`**: 在触发事件发生**之前**执行。常用于数据验证或预处理。
    * **`AFTER`**: 在触发事件发生**之后**执行。常用于审计、数据同步或级联操作。
    * **`INSTEAD OF`**: 替代 `INSERT`, `UPDATE`, `DELETE` 操作在视图上执行。主要用于可更新视图。

* **触发级别**:
    * **行级触发器（`FOR EACH ROW`）**: 每行都触发一次，可以访问 `:NEW` 和 `:OLD`
    * **语句级触发器**: 整个语句只触发一次，不使用 `FOR EACH ROW`

#### 引用新旧数据

在触发器中，你可以引用受影响行的新旧值：
* **`:NEW`**: 用于 `INSERT` 和 `UPDATE` 操作，代表新插入或更新后的行数据
* **`:OLD`**: 用于 `DELETE` 和 `UPDATE` 操作，代表删除前或更新前的行数据

#### 触发器语法对比

| 特性 | Oracle (PL/SQL) | 其他数据库对比 |
|------|----------------|----------------|
| **创建语法** | `CREATE [OR REPLACE] TRIGGER` | MySQL: `CREATE TRIGGER`<br>SQL Server: `CREATE TRIGGER` |
| **新/旧数据** | `:NEW`, `:OLD` | MySQL: `NEW`, `OLD`<br>SQL Server: `INSERTED`, `DELETED` |
| **抛出异常** | `RAISE_APPLICATION_ERROR` | MySQL: `SIGNAL SQLSTATE`<br>SQL Server: `RAISERROR` |
| **分隔符** | `/` | MySQL: `DELIMITER $$`<br>SQL Server: 不需要 |

#### 完整示例：Oracle 触发器

假设有一个员工表结构：
```sql
CREATE TABLE Employees (
    EmployeeID   NUMBER PRIMARY KEY,
    Name         VARCHAR2(100),
    Salary       NUMBER(10,2),
    LastUpdated  DATE
);
```

##### 示例 1：BEFORE UPDATE 触发器 - 自动更新时间戳

```sql
CREATE OR REPLACE TRIGGER trg_update_employee_lastupdated
BEFORE UPDATE ON Employees
FOR EACH ROW
BEGIN
    :NEW.LastUpdated := SYSDATE;
END;
/
```

##### 示例 2：AFTER INSERT 触发器 - 记录操作日志

```sql
-- 首先创建日志表
CREATE TABLE Employee_Log (
    LogID      NUMBER GENERATED BY DEFAULT AS IDENTITY,
    Action     VARCHAR2(50),
    EmployeeID NUMBER,
    ActionTime DATE
);

-- 创建触发器
CREATE OR REPLACE TRIGGER trg_after_insert_employee
AFTER INSERT ON Employees
FOR EACH ROW
BEGIN
    INSERT INTO Employee_Log (Action, EmployeeID, ActionTime)
    VALUES ('Inserted', :NEW.EmployeeID, SYSDATE);
END;
/
```

##### 示例 3：BEFORE DELETE 触发器 - 防止删除特定记录

```sql
CREATE OR REPLACE TRIGGER trg_before_delete_employee
BEFORE DELETE ON Employees
FOR EACH ROW
BEGIN
    IF :OLD.EmployeeID = 1 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Cannot delete employee with ID 1.');
    END IF;
END;
/
```

##### 示例 4：复杂业务逻辑 - 工资变动审计

```sql
CREATE OR REPLACE TRIGGER trg_salary_audit
BEFORE UPDATE OF Salary ON Employees
FOR EACH ROW
DECLARE
    salary_change_percent NUMBER;
BEGIN
    -- 计算工资变化百分比
    salary_change_percent := ABS((:NEW.Salary - :OLD.Salary) / :OLD.Salary * 100);
    
    -- 如果工资变化超过20%，记录到审计表
    IF salary_change_percent > 20 THEN
        INSERT INTO Employee_Log (Action, EmployeeID, ActionTime)
        VALUES ('Large Salary Change: ' || TO_CHAR(salary_change_percent, '999.99') || '%', 
                :NEW.EmployeeID, SYSDATE);
    END IF;
    
    -- 自动更新最后修改时间
    :NEW.LastUpdated := SYSDATE;
END;
/
```

#### 更多 PL/SQL 触发器示例

```sql
-- AFTER INSERT 触发器示例：更新库存
CREATE OR REPLACE TRIGGER trg_after_order_insert
AFTER INSERT ON Orders
FOR EACH ROW
BEGIN
    UPDATE Products 
    SET stock = stock - :NEW.quantity 
    WHERE product_id = :NEW.product_id;
END;
/

-- BEFORE UPDATE 触发器示例：验证价格
CREATE OR REPLACE TRIGGER trg_before_product_update
BEFORE UPDATE ON Products
FOR EACH ROW
BEGIN
    IF :NEW.price < 0 THEN
        RAISE_APPLICATION_ERROR(-20002, 'Product price cannot be negative');
    END IF;
END;
/

-- BEFORE INSERT 触发器示例：自动生成主键和验证数据
CREATE OR REPLACE TRIGGER trg_before_insert_product
BEFORE INSERT ON Products
FOR EACH ROW
BEGIN
    -- 如果没有提供产品ID，自动生成
    IF :NEW.product_id IS NULL THEN
        SELECT product_seq.NEXTVAL INTO :NEW.product_id FROM DUAL;
    END IF;
    
    -- 验证产品名称不能为空
    IF :NEW.product_name IS NULL OR LENGTH(TRIM(:NEW.product_name)) = 0 THEN
        RAISE_APPLICATION_ERROR(-20003, 'Product name cannot be empty');
    END IF;
    
    -- 设置创建时间
    :NEW.created_date := SYSDATE;
END;
/

-- AFTER DELETE 触发器示例：记录删除操作
CREATE OR REPLACE TRIGGER trg_after_delete_product
AFTER DELETE ON Products
FOR EACH ROW
BEGIN
    INSERT INTO Product_Delete_Log (
        deleted_product_id,
        deleted_product_name,
        deleted_by,
        delete_time
    ) VALUES (
        :OLD.product_id,
        :OLD.product_name,
        USER,
        SYSDATE
    );
END;
/
```

#### 触发器使用注意事项

* **性能影响**: 触发器是"隐式"执行的，会影响 DML 操作的性能
* **调试困难**: 触发器自动执行，调试时要特别小心
* **避免复杂逻辑**: 尽量避免在触发器中放置复杂的业务逻辑
* **执行顺序**: 如果多个触发器作用于同一张表和同一事件，要注意执行顺序
* **递归问题**: 避免触发器间的相互调用导致无限递归
* **事务一致性**: 触发器与触发它的语句在同一个事务中执行

#### 触发器管理

* **查看触发器**:
    ```sql
    -- Oracle
    SELECT trigger_name, table_name, triggering_event, status 
    FROM user_triggers;
    
    -- MySQL
    SHOW TRIGGERS;
    ```
* **禁用/启用触发器**:
    ```sql
    -- Oracle
    ALTER TRIGGER trigger_name DISABLE;
    ALTER TRIGGER trigger_name ENABLE;
    
    -- MySQL
    -- MySQL 不支持禁用单个触发器，只能删除后重建
    ```
* **删除触发器**:
    ```sql
    DROP TRIGGER trigger_name;
    ```


## 七、事务与并发控制（Transactions）

事务是数据库操作的逻辑单元，它包含一系列的 SQL 语句，这些语句要么全部成功执行，要么全部失败回滚。

### ACID 特性

事务的四大特性，确保数据的完整性和可靠性：

* **原子性（Atomicity）**: 事务是一个不可分割的工作单位。事务中的所有操作要么全部成功提交，要么全部失败回滚到事务开始前的状态。
* **一致性（Consistency）**: 事务执行前后，数据库从一个一致状态转移到另一个一致状态。数据完整性约束（如主键、外键、CHECK 约束）必须保持有效。
* **隔离性（Isolation）**: 多个并发事务的执行互不干扰。每个事务都感觉自己是系统中唯一运行的事务，其操作结果独立于其他并发事务。
* **持久性（Durability）**: 一旦事务成功提交，其对数据库的修改就是永久性的，即使系统发生故障也不会丢失。

### 事务控制

* **`COMMIT`**: 提交事务。将事务中所有操作永久保存到数据库。
    ```sql
    -- PL/SQL 中事务自动开始，无需显式声明
    INSERT INTO Accounts VALUES (1, 'Alice', 1000);
    UPDATE Accounts SET balance = balance - 100 WHERE account_id = 2;
    COMMIT;
    ```
* **`ROLLBACK`**: 回滚事务。撤销事务中所有未提交的操作，使数据库恢复到事务开始前的状态。
    ```sql
    INSERT INTO Accounts VALUES (3, 'Bob', 500);
    -- 发生错误
    ROLLBACK;
    ```
* **`SAVEPOINT`**: 设置保存点。允许你将事务回滚到事务中的某个特定点，而不是完全回滚整个事务。
    ```sql
    INSERT INTO Log (message) VALUES ('Operation 1 started');
    SAVEPOINT a;
    INSERT INTO Log (message) VALUES ('Operation 2 started');
    -- 假设 Operation 2 失败
    ROLLBACK TO a; -- 回滚到保存点 a
    COMMIT; -- 提交 Operation 1 的操作
    ```

### 隔离级别

隔离级别定义了多个并发事务如何互相影响，以及数据库如何处理这些影响。隔离级别越高，数据一致性越好，但并发性能可能越低。

* **`SERIALIZABLE` (可串行化)**: 最高隔离级别。确保事务完全隔离，避免所有并发问题（脏读、不可重复读、幻读）。通过加锁来实现，并发性能最低。
* **`REPEATABLE READ` (可重复读)**: 保证一个事务在多次读取同一数据时，结果始终一致。可以避免脏读和不可重复读，但可能出现幻读。
* **`READ COMMITTED` (读已提交)**: 只能读取已经提交的数据。可以避免脏读，但可能出现不可重复读和幻读。这是许多数据库的默认隔离级别。
* **`READ UNCOMMITTED` (读未提交)**: 最低隔离级别。允许读取其他事务尚未提交的数据，这可能导致“脏读”（Dirty Read），即读取到已被回滚的数据。


## 八、视图与索引（Views & Indexes）

### 视图（Views）

视图是一个虚拟的表，它的内容由查询定义。视图本身不存储数据，而是从一个或多个基本表派生出来。

* **虚拟视图**:
    * 不实际存储数据，每次查询视图时都会重新执行定义视图的查询。
    * 常用于简化复杂查询、限制用户访问特定数据、提供数据抽象。
    ```sql
    CREATE VIEW CanDrink AS
    SELECT name, address
    FROM Drinkers
    WHERE age >= 18;
    ```
* **物化视图（Materialized Views）**:
    * 实际存储查询结果的数据副本。
    * 通常用于数据仓库和OLAP系统，以提高查询性能。
    * 需要定期刷新以保持与基本数据的一致性。
    ```sql
    -- 语法因数据库而异，以下是概念示例
    CREATE MATERIALIZED VIEW SalesSummary
    BUILD IMMEDIATE -- 或 BUILD DEFERRED
    REFRESH COMPLETE -- 或 REFRESH FAST ON COMMIT/ON DEMAND
    AS SELECT product_id, SUM(quantity) AS total_quantity FROM OrderDetails GROUP BY product_id;
    ```
* **视图修改**:
    * **可更新视图**: 如果视图是基于单个表，且没有聚合函数、`DISTINCT`、`GROUP BY` 等复杂操作，通常可以直接通过视图进行 `INSERT`, `UPDATE`, `DELETE`。
    * **`INSTEAD OF` 触发器**: 对于复杂的、不可直接更新的视图，可以使用 `INSTEAD OF` 触发器来定义当用户尝试通过视图进行 DML 操作时，实际应该执行的操作。

### 索引（Indexes）

索引是一种特殊的查找表，数据库搜索引擎用它来加速数据检索。它类似于书籍的目录。

* **作用**:
    * 显著提高 `SELECT` 查询的性能，尤其是在 `WHERE` 子句、`JOIN` 条件和 `ORDER BY` 子句中使用的列上。
    * 以 B 树（B-Tree）结构为基础（最常见），提供高效的数据查找。
* **类型**:
    * **聚集索引（Clustered Index）**:
        * 决定了表中数据行的物理存储顺序。
        * 一个表只能有一个聚集索引。
        * 通常在主键列上创建，因为主键本身就是唯一的且经常用于查询。
    * **非聚集索引（Nonclustered Index）**:
        * 独立于数据的物理存储顺序。
        * 包含索引列的值和指向实际数据行的指针。
        * 一个表可以有多个非聚集索引。
* **创建语法**:
    ```sql
    CREATE INDEX idx_product_name ON Products(product_name);
    CREATE UNIQUE INDEX idx_customer_email ON Customers(email); -- 唯一索引
    CREATE INDEX idx_order_date_customer ON Orders(order_date DESC, customer_id ASC); -- 复合索引
    ```
:::details 适用索引的场景
在数据库设计中，**合理选择索引**是提升查询性能的关键。以下是选择索引时应遵循的**关键要点**，帮助你做出更科学、高效的决策：

#### ✅ 一、索引适用场景

##### 1. **频繁用于查询条件的列**
- 对于经常出现在 `WHERE` 子句中的列，创建索引可以显著提高查询效率。
- 示例：用户登录常用 `email` 字段，可为该字段加索引。

##### 2. **连接操作中常用的列（JOIN）**
- 在多表连接（JOIN）中频繁使用的列，如外键列，建议建立索引以加快关联速度。

##### 3. **排序和分组列（ORDER BY / GROUP BY）**
- 若某些列常用于排序或分组操作，为其建立索引可以避免额外的排序开销。

##### 4. **唯一性约束要求的列**
- 对于需要保证唯一性的列（如用户名、邮箱等），使用 **唯一索引（UNIQUE INDEX）** 不仅能加速查询，还能确保数据完整性。

#### ✅ 二、索引类型的选择

| 索引类型 | 特点 | 使用建议 |
|----------|------|----------|
| 聚集索引（Clustered） | 决定数据物理存储顺序，一个表只能有一个 | 建议为主键或最常查询的字段 |
| 非聚集索引（Nonclustered） | 指向实际数据行，一个表可有多个 | 适用于辅助查询字段 |
| 唯一索引（Unique） | 确保列值唯一 | 用户名、邮箱等字段 |
| 复合索引（Composite） | 多列组成的索引 | 查询条件涉及多个列时使用 |

> 💡 **复合索引使用注意**：
> - 符合“最左前缀原则”，即查询必须包含复合索引的最左边列才能命中索引。
> - 例如：`idx_order(customer_id, order_date)` 可被以下查询命中：
>   ```sql
>   WHERE customer_id = 100
>   WHERE customer_id = 100 AND order_date > '2024-01-01'
>   ```
>   但不会被以下查询命中：
>   ```sql
>   WHERE order_date > '2024-01-01'
>   ```


#### ✅ 三、索引优化技巧

##### 1. **避免过度索引**
- 每个索引都会占用磁盘空间，并影响插入、更新、删除的性能。
- 不要为低选择性的列（如性别、状态）建立索引。

##### 2. **关注查询频率与数据分布**
- 高频查询字段优先考虑建索引。
- 如果某列取值重复太多（如性别只有男女），即使高频查询也不适合建索引。

##### 3. **定期分析和维护索引**
- 使用 `EXPLAIN` 或执行计划查看是否命中索引。
- 定期重建或重组碎片化的索引，保持其高效性。

##### 4. **覆盖索引（Covering Index）**
- 将查询所需的所有字段都包括在索引中，避免回表查询，大幅提升性能。
- 示例：
  ```sql
  CREATE INDEX idx_user_email_name ON Users(email, name);
  SELECT name FROM Users WHERE email = 'test@example.com';
  -- 此查询只需访问索引即可完成
  ```


#### ✅ 四、不建议建索引的情况

| 场景 | 原因 |
|------|------|
| 数据量小的表 | 全表扫描比走索引更快 |
| 频繁修改的列 | 插入/更新代价高 |
| 低选择性列（如布尔值） | 索引区分度低，效果差 |
| 不常使用的查询字段 | 浪费资源，影响写性能 |


#### ✅ 五、总结：如何合理选择索引？

| 目标 | 建议 |
|------|------|
| 提升查询性能 | 为 `WHERE`, `JOIN`, `ORDER BY`, `GROUP BY` 中常用字段建索引 |
| 减少写操作开销 | 避免对频繁更新字段建索引 |
| 优化复杂查询 | 使用复合索引、覆盖索引 |
| 保障数据唯一性 | 使用唯一索引 |
| 维护索引健康 | 定期分析执行计划、清理无效索引 |

:::

## 九、数据操作（DML）与模式定义（DDL）

### 数据操作语言（DML）

DML 用于管理数据库中的数据，包括查询、插入、更新和删除数据。

* **插入（INSERT）**: 向表中添加新行。
    ```sql
    -- 插入所有列的值
    INSERT INTO Employees VALUES (101, 'Alice', 'Engineer', 50000);
    -- 插入指定列的值 (未指定的列将使用默认值或 NULL)
    INSERT INTO Products (product_name, price) VALUES ('Laptop', 1200.00);
    -- 从另一个查询结果插入数据
    INSERT INTO OldCustomers SELECT customer_id, customer_name FROM Customers WHERE registration_date < '2020-01-01';
    ```
* **更新（UPDATE）**: 修改表中现有行的值。
    ```sql
    UPDATE Products SET price = 1250.00 WHERE product_name = 'Laptop';
    UPDATE Employees SET salary = salary * 1.05 WHERE department = 'Sales';
    ```
* **删除（DELETE）**: 从表中删除行。
    ```sql
    DELETE FROM Orders WHERE order_date < '2024-01-01';
    DELETE FROM Customers; -- 删除表中所有行
    ```
    * **`TRUNCATE TABLE`**: 快速清空表中的所有数据，通常比 `DELETE` 更快，因为它不会记录每一行的删除操作（事务日志较少），且无法回滚。它会重置表的自增计数器。
        ```sql
        TRUNCATE TABLE LargeLogTable;
        ```

### 数据定义语言（DDL）

DDL 用于定义和管理数据库的结构，包括创建、修改和删除数据库对象（如表、视图、索引）。

* **表定义（CREATE TABLE）**: 创建新表。
    ```sql
    CREATE TABLE Products (
        product_id NUMBER PRIMARY KEY,
        product_name VARCHAR2(255) NOT NULL,
        category VARCHAR2(100) DEFAULT 'Uncategorized',
        price NUMBER(10, 2),
        stock_quantity NUMBER CHECK (stock_quantity >= 0),
        supplier_id NUMBER,
        created_date DATE DEFAULT SYSDATE,
        CONSTRAINT FK_Products_Supplier FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id)
    );
    ```
* **修改表（ALTER TABLE）**: 修改现有表的结构。
    ```sql
    -- 添加列
    ALTER TABLE Customers ADD email VARCHAR2(255);
    -- 删除列
    ALTER TABLE Employees DROP COLUMN old_salary;
    -- 修改列定义 (Oracle语法)
    ALTER TABLE Products MODIFY price DEFAULT 0.00;
    ALTER TABLE Products MODIFY price NUMBER(12, 2);
    -- 添加约束
    ALTER TABLE Orders ADD CONSTRAINT FK_Orders_Customer 
        FOREIGN KEY (customer_id) REFERENCES Customers(customer_id);
    -- 添加检查约束
    ALTER TABLE Products ADD CONSTRAINT CHK_Products_Price 
        CHECK (price >= 0);
    ```
* **删除表（DROP TABLE）**: 删除表及其所有数据。
    ```sql
    DROP TABLE OldOrdersBackup;
    ```


## 十、其他高级特性

### 动态 SQL

动态 SQL 允许你在运行时构建和执行 SQL 语句。这对于需要根据不同条件或用户输入生成不同查询的场景非常有用。

* **PL/SQL 示例**:
    ```sql
    -- Oracle PL/SQL 动态SQL
    DECLARE
        table_name_var VARCHAR2(128) := 'Products';
        sql_stmt VARCHAR2(4000);
        price_threshold NUMBER := 100;
    BEGIN
        -- 构建动态SQL语句
        sql_stmt := 'SELECT * FROM ' || table_name_var || ' WHERE price > :price_val';
        
        -- 使用游标执行动态SQL
        FOR rec IN (EXECUTE IMMEDIATE sql_stmt USING price_threshold) LOOP
            DBMS_OUTPUT.PUT_LINE('Product: ' || rec.product_name || ', Price: ' || rec.price);
        END LOOP;
    END;
    /
    
    -- 或者使用 EXECUTE IMMEDIATE 直接执行
    DECLARE
        table_name_var VARCHAR2(128) := 'Products';
        sql_stmt VARCHAR2(4000);
    BEGIN
        sql_stmt := 'UPDATE ' || table_name_var || ' SET price = price * 1.1 WHERE price > 100';
        EXECUTE IMMEDIATE sql_stmt;
        COMMIT;
    END;
    /
    ```
    * **预编译动态语句**: PL/SQL 中使用 `EXECUTE IMMEDIATE` 和绑定变量。
        ```sql
        DECLARE
            query_text VARCHAR2(4000) := 'SELECT COUNT(*) FROM employees WHERE salary > :sal';
            emp_count NUMBER;
            min_salary NUMBER := 50000;
        BEGIN
            EXECUTE IMMEDIATE query_text INTO emp_count USING min_salary;
            DBMS_OUTPUT.PUT_LINE('员工数量: ' || emp_count);
        END;
        /
        ```

### 聚合函数与分组（Grouping/Aggregation）

聚合函数对一组值执行计算，并返回单个值。`GROUP BY` 子句用于将行分组，以便对每个组执行聚合。

* **聚合函数**:
    * `SUM()`: 计算总和。
    * `AVG()`: 计算平均值。
    * `COUNT()`: 计算行数。
    * `MIN()`: 找出最小值。
    * `MAX()`: 找出最大值。
    ```sql
    SELECT AVG(price) AS average_price FROM Sells;
    SELECT COUNT(DISTINCT customer_id) AS total_customers FROM Orders;
    ```
* **分组（`GROUP BY`）**:
    * 将结果集中的行按照一个或多个列的值进行分组。
    * 聚合函数会为每个组返回一个结果。
    ```sql
    SELECT beer, AVG(price) AS average_price_per_beer
    FROM Sells
    GROUP BY beer;
    ```
* **分组过滤（`HAVING`）**:
    * 用于在 `GROUP BY` 子句之后筛选分组。
    * `WHERE` 子句在分组前筛选行，`HAVING` 子句在分组后筛选组。
    ```sql
    SELECT bar, COUNT(beer) AS num_beers_sold
    FROM Sells
    GROUP BY bar
    HAVING COUNT(beer) >= 3; -- 只显示销售了至少3种啤酒的酒吧
    ```
