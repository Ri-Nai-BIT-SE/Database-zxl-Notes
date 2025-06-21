# 数据库设计与开发 课程笔记 / Database Design & Development Course Notes

本项目是数据库设计与开发课程的学习笔记，使用 VitePress 构建，支持中英文双语。

This project contains course notes for Database Design & Development, built with VitePress and supports both Chinese and English.

## 🌐 多语言支持 / Multi-language Support

- **中文文档**: [https://your-domain.com/zh/](https://your-domain.com/zh/)
- **English Documentation**: [https://your-domain.com/](https://your-domain.com/)

## 📚 内容概览 / Content Overview

### 中文版本
- [数据库系统导论](./docs/zh/chapters/1-intro.md)
- [实体关系模型](./docs/zh/chapters/2-er.md)
- [函数依赖与关系模式设计](./docs/zh/chapters/3-fds.md)

### English Version
- [Database System Introduction](./docs/chapters/1-intro.md)
- [Entity-Relationship Model](./docs/chapters/2-er.md)
- [Functional Dependencies & Schema Design](./docs/chapters/3-fds.md)

## 🚀 快速开始 / Quick Start

### 安装依赖 / Install Dependencies
```bash
pnpm install
```

### 本地开发 / Local Development
```bash
pnpm dev
```

### 构建项目 / Build Project
```bash
pnpm build
```

### 预览构建结果 / Preview Build
```bash
pnpm preview
```

## 📁 项目结构 / Project Structure

```
notes/
├── docs/
│   ├── index.md                    # 英文首页 / English Homepage
│   ├── chapters/                   # 英文章节 / English Chapters
│   │   ├── 1-intro.md
│   │   ├── 2-er.md
│   │   └── 3-fds.md
│   └── zh/                         # 中文版本 / Chinese Version
│       ├── index.md                # 中文首页 / Chinese Homepage
│       └── chapters/               # 中文章节 / Chinese Chapters
│           ├── 1-intro.md
│           ├── 2-er.md
│           └── 3-fds.md
├── .vitepress/
│   └── config.mts                  # VitePress 配置 / VitePress Config
└── README.md
```

## 🛠️ 技术栈 / Tech Stack

- **VitePress**: 静态站点生成器 / Static Site Generator
- **Vue 3**: 前端框架 / Frontend Framework
- **TypeScript**: 类型安全 / Type Safety
- **Mermaid**: 图表支持 / Diagram Support
- **Math**: 数学公式支持 / Mathematical Formula Support

## 📖 使用指南 / Usage Guide

### 添加新章节 / Adding New Chapters

1. 在 `docs/chapters/` 目录下创建英文版本
2. 在 `docs/zh/chapters/` 目录下创建中文版本
3. 更新 `.vitepress/config.mts` 中的导航和侧边栏配置

### 切换语言 / Language Switching

网站右上角有语言切换按钮，可以在中英文之间切换。

The language switcher is located in the top-right corner of the website.

## 🤝 贡献 / Contributing

欢迎提交 Issue 和 Pull Request！

Issues and Pull Requests are welcome!

## 📄 许可证 / License

本项目采用 MIT 许可证。

This project is licensed under the MIT License. 
