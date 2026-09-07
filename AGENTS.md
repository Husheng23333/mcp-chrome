# mcp-chrome 项目说明

## 项目概述

本项目是一个基于 Chrome 扩展的 MCP Server，通过 Native Messaging 将 MCP 客户端与用户正在使用的 Chrome 浏览器连接起来。项目使用 pnpm workspace 管理多个应用和共享包。

## 目录结构

- `app/chrome-extension/`：Chrome 扩展，使用 WXT、Vue 3、TypeScript 和 Chrome Extension API。
  - `entrypoints/`：扩展入口，包括 background、content script、web editor 等。
  - `components/`、`pages/`、`composables/`：扩展界面和前端逻辑。
  - `common/`：消息类型、工具处理器和常量。
  - `utils/`：内容索引、向量数据库、截图和 CDP 等工具。
  - `tests/`：Vitest 测试。
- `app/native-server/`：Node.js Native Messaging Host，负责 MCP 服务、HTTP/stdio 传输和 Agent 能力。
  - `src/mcp/`：MCP Server 实现和工具注册。
  - `src/server/`：HTTP Server 和 MCP HTTP 路由。
  - `src/agent/`：Agent、会话、项目和存储能力。
  - `src/scripts/`：构建、注册 Native Messaging Host 和诊断脚本。
- `packages/shared/`：扩展端和服务端共享的类型、工具 schema、消息常量和节点定义。
- `packages/wasm-simd/`：Rust 编写的 WebAssembly SIMD 向量计算模块。
- `docs/`：架构、工具、排障和贡献文档。
- `prompt/`：示例提示词。
- `releases/`：发布产物和发布说明。

## 环境要求

- Node.js `>=20.0.0`
- pnpm `8.15.9`
- Chrome 浏览器

项目依赖使用 pnpm 管理，不需要全局安装 `mcp-chrome-bridge`。

## 环境初始化与构建

在项目根目录执行以下命令初始化依赖、构建工作区并注册 Native Messaging Host：

```bash
corepack enable && corepack prepare pnpm@8.15.9 --activate && pnpm install --frozen-lockfile --ignore-scripts && pnpm build:shared && pnpm build:native && pnpm build:extension && pnpm --filter mcp-chrome-bridge register:dev
```

首次安装保留 `--ignore-scripts`，以跳过依赖安装阶段对尚未生成的 native server 构建产物的调用。

如检测到旧的全局安装，可清理：

```bash
npm uninstall -g mcp-chrome-bridge
```

构建产物：

- 扩展：`app/chrome-extension/.output/chrome-mv3`
- Native Messaging Host：`app/native-server/dist/run_host.sh`（Windows 为对应的 `.bat` 文件）

`register:dev` 会将 Native Messaging manifest 写入当前用户的浏览器配置目录，并使其指向上述工作区产物。

Native server 的 HTTP 端点为：

```text
http://127.0.0.1:12306
```

## 常用构建命令

在项目根目录执行：

```bash
# 安装依赖
pnpm install

# 构建全部项目
pnpm build

# 分模块构建
pnpm build:shared
pnpm build:native
pnpm build:extension
pnpm build:wasm

# 重新注册本地 Native Messaging Host
pnpm --filter mcp-chrome-bridge register:dev
```

修改 `packages/shared/` 后，先执行 `pnpm build:shared`。修改 `packages/wasm-simd/` 后，执行 `pnpm build:wasm`。

## 开发命令

```bash
pnpm dev
pnpm dev:native
pnpm dev:extension
pnpm dev:shared
```

## 验证和测试命令

```bash
# 检查本地 native server 是否运行
curl http://127.0.0.1:12306/ping

# 扩展类型检查
pnpm --filter chrome-mcp-server compile

# 扩展测试
pnpm --filter chrome-mcp-server test

# native server 类型检查
pnpm --filter mcp-chrome-bridge exec tsc --noEmit

# native server 测试
pnpm --filter mcp-chrome-bridge test

# WASM 测试
pnpm --filter @chrome-mcp/wasm-simd test
```

正常的服务检查结果为：

```json
{ "status": "ok", "message": "pong" }
```
