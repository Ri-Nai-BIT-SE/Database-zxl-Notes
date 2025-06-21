# 📘XML 课程知识点梳理（含完整示例）


## 一、XML 基础

### 1. Well-Formed XML（格式良好的 XML）

XML 文档必须满足以下规则才能被称为格式良好：

- 必须以声明开头：
  ```xml
  <?xml version="1.0" standalone="yes"?>
  ```
- 标签必须成对出现，或使用自闭合标签 `<tag/>`
- 标签名称区分大小写
- 所有内容必须嵌套在根元素中

✅ 示例：
```xml
<?xml version="1.0" standalone="yes"?>
<BARS>
  <BAR>
    <NAME>Joe's Bar</NAME>
    <BEER>
      <NAME>Bud</NAME>
      <PRICE>2.50</PRICE>
    </BEER>
    <BEER>
      <NAME>Miller</NAME>
      <PRICE>3.00</PRICE>
    </BEER>
  </BAR>
</BARS>
```


### 2. Valid XML（有效的 XML）

有效的 XML 不仅要格式良好，还必须符合某个 DTD 或 XML Schema 的定义。

- 引用 DTD 时需设置 `standalone="no"`
- 可以内联定义 DTD，也可以引用外部文件

✅ 示例（内联 DTD）：
```xml
<?xml version="1.0" standalone="no"?>
<!DOCTYPE BARS [
  <!ELEMENT BARS (BAR*)>
  <!ELEMENT BAR (NAME, BEER+)>
  <!ELEMENT NAME (#PCDATA)>
  <!ELEMENT BEER (NAME, PRICE)>
  <!ELEMENT PRICE (#PCDATA)>
]>
<BARS>
  <BAR>
    <NAME>Joe's Bar</NAME>
    <BEER>
      <NAME>Bud</NAME>
      <PRICE>2.50</PRICE>
    </BEER>
  </BAR>
</BARS>
```


## 二、DTD（Document Type Definition）

### 1. DTD 声明结构

DTD 使用如下结构定义文档结构：
```dtd
<!DOCTYPE 根元素名 [
  <!ELEMENT 元素名 (子元素列表)>
  ...
]>
```


### 2. 元素定义

- 子元素顺序必须一致
- 数量可以用符号表示：
  - `*`：零个或多个
  - `+`：一个或多个
  - `?`：零个或一个

✅ 示例：
```dtd
<!ELEMENT BARS (BAR*)>
<!ELEMENT BAR (NAME, BEER+)>
<!ELEMENT NAME (#PCDATA)>
<!ELEMENT BEER (NAME, PRICE)>
<!ELEMENT PRICE (#PCDATA)>
```


### 3. 属性定义（`ATTLIST`）

- 使用 `<!ATTLIST>` 定义属性
- 类型可以是 `CDATA`、`ID`、`IDREF` 等

✅ 示例：
```dtd
<!ATTLIST BAR kind CDATA #IMPLIED>
```


### 4. ID 和 IDREF

- `ID`：唯一标识符
- `IDREF`：引用另一个元素的 ID

✅ 示例：
```xml
<BARS>
  <BAR name="JoesBar">
    <SELLS theBeer="Bud">2.50</SELLS>
  </BAR>
  <BEER name="Bud"/>
</BARS>
```

对应的 DTD：
```dtd
<!ATTLIST BAR name ID #REQUIRED>
<!ATTLIST SELLS theBeer IDREF #REQUIRED>
```


### 5. 空元素

- 没有内容的元素可以用 `<element/>` 表示
- 在 DTD 中声明为 `EMPTY`

✅ 示例：
```dtd
<!ELEMENT BEER EMPTY>
```

对应的 XML：
```xml
<BEER name="Bud"/>
```


### 6. DTD 的引入方式

#### a) 内联方式：
```xml
<?xml version="1.0" standalone="no"?>
<!DOCTYPE BARS [
  <!ELEMENT BARS (BAR*)>
  <!ELEMENT BAR (NAME, BEER+)>
  ...
]>
<BARS>
  <BAR><NAME>Joe's Bar</NAME></BAR>
</BARS>
```

#### b) 外部文件方式：
```xml
<?xml version="1.0" standalone="no"?>
<!DOCTYPE BARS SYSTEM "bar.dtd">
<BARS>
  <BAR><NAME>Joe's Bar</NAME></BAR>
</BARS>
```

其中 `bar.dtd` 文件内容为：
```dtd
<!ELEMENT BARS (BAR*)>
<!ELEMENT BAR (NAME, BEER+)>
...
```


## 三、XML Schema

### 1. XML Schema 基本结构

```xml
<?xml version="1.0"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  ...
</xs:schema>
```


### 2. 元素定义（`xs:element`）

用于定义 XML 元素及其类型

✅ 示例：
```xml
<xs:element name="NAME" type="xs:string"/>
```


### 3. 复杂类型（`xs:complexType`）

用于定义包含子元素的类型

✅ 示例：
```xml
<xs:complexType name="beerType">
  <xs:sequence>
    <xs:element name="NAME" type="xs:string" minOccurs="1" maxOccurs="1"/>
    <xs:element name="PRICE" type="xs:float" minOccurs="0" maxOccurs="1"/>
  </xs:sequence>
</xs:complexType>
```


### 4. 属性定义（`xs:attribute`）

用于定义复杂类型的属性

✅ 示例：
```xml
<xs:complexType name="barType">
  <xs:sequence>
    <xs:element name="NAME" type="xs:string"/>
  </xs:sequence>
  <xs:attribute name="license" type="licenseType" use="required"/>
</xs:complexType>
```


### 5. 简单类型限制（`xs:simpleType`）

用于枚举值或限制范围

✅ 示例（枚举）：
```xml
<xs:simpleType name="licenseType">
  <xs:restriction base="xs:string">
    <xs:enumeration value="Full"/>
    <xs:enumeration value="Beer only"/>
    <xs:enumeration value="Sushi"/>
  </xs:restriction>
</xs:simpleType>
```

✅ 示例（数值范围）：
```xml
<xs:simpleType name="priceType">
  <xs:restriction base="xs:float">
    <xs:minInclusive value="1.00"/>
    <xs:maxExclusive value="5.00"/>
  </xs:restriction>
</xs:simpleType>
```


### 6. 键与外键约束

#### 主键（`xs:key`）
确保某字段在范围内唯一

✅ 示例：
```xml
<xs:key name="barKey">
  <xs:selector xpath="BEER"/>
  <xs:field xpath="@name"/>
</xs:key>
```

#### 外键（`xs:keyref`）
引用主键

✅ 示例：
```xml
<xs:keyref name="barRef" refers="barKey">
  <xs:selector xpath="DRINKER/FREQ"/>
  <xs:field xpath="@bar"/>
</xs:keyref>
```


## 四、完整示例对比

### ✅ DTD 完整示例

```dtd
<!ELEMENT BARS (BAR*, BEER*)>
<!ELEMENT BAR (NAME, BEER+)>
<!ATTLIST BAR name ID #REQUIRED>
<!ELEMENT BEER EMPTY>
<!ATTLIST BEER name ID #REQUIRED soldBy IDREFS #IMPLIED>
<!ELEMENT SELLS (#PCDATA)>
<!ATTLIST SELLS theBeer IDREF #REQUIRED>
```

```xml
<BARS>
  <BAR name="JoesBar">
    <NAME>Joe's Bar</NAME>
    <BEER name="Bud" soldBy="JoesBar SuesBar"/>
    <SELLS theBeer="Bud">2.50</SELLS>
  </BAR>
</BARS>
```


### ✅ XML Schema 完整示例

```xml
<?xml version="1.0"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

  <xs:simpleType name="licenseType">
    <xs:restriction base="xs:string">
      <xs:enumeration value="Full"/>
      <xs:enumeration value="Beer only"/>
      <xs:enumeration value="Sushi"/>
    </xs:restriction>
  </xs:simpleType>

  <xs:complexType name="barType">
    <xs:sequence>
      <xs:element name="NAME" type="xs:string"/>
    </xs:sequence>
    <xs:attribute name="license" type="licenseType" use="required"/>
  </xs:complexType>

  <xs:element name="BAR" type="barType"/>

</xs:schema>
```


## 五、总结对比表

| 特性         | DTD          | XML Schema       |
| ------------ | ------------ | ---------------- |
| 语法         | 自定义       | XML 语法         |
| 数据类型支持 | 不支持       | 支持             |
| 命名空间支持 | 不支持       | 支持             |
| 主键/外键    | 不支持       | 支持             |
| 属性约束     | 支持基本属性 | 支持更复杂的约束 |
| 空元素定义   | 支持         | 支持             |


## 六、关键概念总结

1. **Well-Formed XML**：语法正确即可。
2. **Valid XML**：必须符合 DTD 或 Schema 的结构要求。
3. **DTD vs XML Schema**：Schema 更强大，支持命名空间、复杂类型、主键/外键等高级特性。
4. **ID / IDREF**：实现元素之间的引用关系。
5. **空元素**：没有内容，只有属性。
6. **XML Schema 结构**：基于 XML 语法，提供更强的表达能力。
7. **键与外键**：Schema 提供了类似数据库的约束机制。


如需进一步扩展内容，例如 XPath 查询、XSLT 转换等，请告诉我，我可以继续补充。
