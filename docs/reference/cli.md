# CLI 命令

SecAgent CLI 使用工作区保存会话、运行时事件和配置。

## 初始化

```bash
secagent init [--workspace <dir>]
```

也可以直接使用构建后的入口：

```bash
node dist/index.js init --workspace ./demo-workspace
```

## 单次运行

```bash
secagent run <message> \
  [--workspace <dir>] \
  [--session <id>] \
  [--model <id>] \
  [--reasoning <none|low|medium|high>]
```

模型请求失败时会保存错误消息，并返回非零退出码。

## 会话列表

```bash
secagent sessions list --workspace ./demo-workspace
```

## 交互式对话

```bash
secagent chat [--session <id>] --workspace ./demo-workspace
```

交互式命令：

- `:history`：查看当前会话
- `:use <session-id>`：切换会话
- `exit`：退出

## 调试输出

加上 `--verbose` 可以查看完整的模型请求、响应原始事件；普通模式会显示思考片段、工具调用、工具返回结果和最终答案。
