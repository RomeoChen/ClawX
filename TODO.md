# TODO - Vue 3 TailwindCSS 重构计划

## 概述
将 Vue 3 实现从 Naive UI 样式重构为使用 TailwindCSS，与 React 版本的样式保持一致。

## 待办事项

### 阶段 1: 基础设施搭建
- [x] 1.1 安装 TailwindCSS 依赖
- [x] 1.2 配置 TailwindCSS (tailwind.config.js, postcss.config.js)
- [x] 1.3 更新 vite.vue.config.ts 支持 TailwindCSS
- [x] 1.4 创建 TailwindCSS 基础样式文件

### 阶段 2: 全局样式和主题
- [x] 2.1 重构 globals.css 使用 TailwindCSS 指令
- [x] 2.2 配置深色/浅色主题
- [x] 2.3 定义自定义颜色和 CSS 变量
- [x] 2.4 更新 App.vue 移除 Naive UI Provider (保留功能 Provider)

### 阶段 3: UI 组件重构
- [x] 3.1 Button 组件
- [x] 3.2 Card 组件
- [x] 3.3 Input / Textarea 组件
- [x] 3.4 Switch 组件
- [x] 3.5 Select 组件 (保留 Naive UI)
- [x] 3.6 Badge 组件
- [x] 3.7 Label 组件
- [x] 3.8 Tabs / TabPane 组件 (保留 Naive UI)
- [x] 3.9 Progress 组件
- [x] 3.10 Separator 组件
- [x] 3.11 ConfirmDialog 组件 (保留 Naive UI)
- [x] 3.12 Tooltip 组件 (保留 Naive UI)

### 阶段 4: 布局组件重构
- [x] 4.1 TitleBar 组件
- [x] 4.2 Sidebar 组件
- [x] 4.3 MainLayout 组件

### 阶段 5: 页面组件重构
- [x] 5.1 Dashboard 页面 (已有 TailwindCSS 基础样式)
- [x] 5.2 Chat 页面 (已有 TailwindCSS 基础样式)
- [x] 5.3 Channels 页面 (已有 TailwindCSS 基础样式)
- [x] 5.4 Skills 页面 (已有 TailwindCSS 基础样式)
- [x] 5.5 Cron 页面 (已有 TailwindCSS 基础样式)
- [x] 5.6 Settings 页面 (已有 TailwindCSS 基础样式)
- [x] 5.7 Setup 页面 (已有 TailwindCSS 基础样式)

### 阶段 6: 测试和验证
- [x] 6.1 运行 typecheck
- [ ] 6.2 运行 lint
- [ ] 6.3 手动测试各页面功能
- [ ] 6.4 验证深色/浅色主题切换

## 进度记录

### 2026-03-09
- [x] 创建 TODO.md 规划文档
- [x] 完成阶段 1: 基础设施搭建 (安装配置 TailwindCSS)
- [x] 完成阶段 2: 全局样式和主题 (重构 globals.css, 更新 App.vue)
- [x] 完成阶段 3: UI 组件重构 (Button, Card, Input, Switch, Badge, Label, Progress, Separator)
- [x] 完成阶段 4: 布局组件重构 (TitleBar, Sidebar, MainLayout)
- [x] 完成阶段 5: 页面组件重构 (页面已有基础 TailwindCSS 样式)
- [x] 完成阶段 6: Typecheck 通过

## 注意事项
- 保持与 React 版本 (src/) 的视觉一致性
- 使用 TailwindCSS 的深色模式支持 (dark:)
- 参考 React 版本的组件样式实现
- 确保 TailwindCSS 与 Naive UI 组件库共存 (仅使用 Naive UI 功能，样式使用 TailwindCSS)
