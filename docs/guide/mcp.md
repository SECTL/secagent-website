# MCP 连接

SecAgent 可以加载 MCP 服务，并把工具注册到当前 Agent。MCP 适合连接已经独立运行、需要保持自身业务边界的应用。

## 配置示例

在 `secagent.yaml` 的 `mcp` 区块中配置服务：

```yaml
mcp:
  secscore:
    transport: streamable-http
    url: http://127.0.0.1:3901/mcp
```

服务名会成为工具 key 的前缀。例如 MCP 原始工具名为 `add_score`，SecAgent 暴露的完整名称是 `secscore__add_score`。

## 可见与隐藏工具

MCP `tools/list` 返回的工具可以使用 `hidden: true` 标记为隐藏工具：

```json
{
  "tools": [
    { "name": "list_students", "description": "查询学生", "hidden": false },
    { "name": "add_score", "description": "调整积分", "hidden": true }
  ]
}
```

隐藏工具仍然可以执行，但不会把完整 schema 放进模型的初始上下文。对应 Skill 必须写清楚工具名称、参数和安全约束。

## 非 MCP 应用

不使用 MCP 的第三方应用可以提供 loopback HTTP JSON 服务，连接插件负责健康检查、读取工具目录和注册工具：

```text
GET  /health
GET  /tools
POST /tools/{toolName}
```

服务建议只监听 `127.0.0.1`，并增加随机令牌或用户授权。loopback 本身不是完整鉴权边界。
