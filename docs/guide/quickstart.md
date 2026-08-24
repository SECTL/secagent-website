# 快速开始

SecAgent 当前同时提供桌面端和 CLI。下面先用 CLI 跑通一条最小流程，再根据需要启动桌面端。

## 环境要求

- Node.js 22 或更高版本
- 一个可用的模型 API key
- 如果要操作业务数据，还需要对应的 MCP 服务或插件

## 安装与构建

从 [SecAgent 仓库](https://github.com/SECTL/SecAgent) 获取源码后：

```bash
npm install
npm run build:cli
```

## 初始化工作区

工作区保存配置、模型密钥、会话和审计记录。建议为不同项目使用不同目录：

```bash
node dist/index.js init --workspace ./demo-workspace
```

初始化后，在工作区的 `.env` 中填写模型 key，例如：

```dotenv
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
GEMINI_API_KEY=...
```

密钥只保存在工作区环境文件中，不会写进 `secagent.yaml`。

## 发送第一条消息

```bash
node dist/index.js run "查询李明当前积分" --workspace ./demo-workspace
```

命令结束时会输出当前会话 ID。后续可以继续复用它：

```bash
node dist/index.js run "把刚才的结果总结一下" \
  --session <session-id> \
  --workspace ./demo-workspace
```

也可以进入交互式对话：

```bash
node dist/index.js chat --session <session-id> --workspace ./demo-workspace
```

在 `chat` 中输入 `:history` 查看历史，输入 `:use <session-id>` 切换会话，输入 `exit` 退出。

## 启动桌面端

```bash
npm run dev
```

桌面端与 CLI 共享工作区中的会话文件，因此可以在终端调试后回到桌面端继续处理。

## 下一步

- [配置模型](/guide/configuration)：选择 OpenAI、Anthropic、Gemini 或兼容端点
- [插件与 Skill](/guide/plugins)：接入领域能力
- [MCP 连接](/guide/mcp)：连接外部工具服务
- [CLI 命令](/reference/cli)：查看完整命令参数
