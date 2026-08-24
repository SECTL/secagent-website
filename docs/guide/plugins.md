# 插件与 Skill

SecAgent 通过插件把业务能力接入 Agent。插件可以注册工具、Skill、提示词和前置规则；Skill 负责告诉模型什么时候使用能力，以及如何安全地组织调用。

## 插件清单

一个原生 SecAgent 插件的最小清单如下：

```json
{
  "apiVersion": 1,
  "id": "my-app",
  "name": "我的应用",
  "version": "1.0.0",
  "main": "main.mjs",
  "permissions": ["agent.tools", "agent.skills", "agent.prompts", "network.http"]
}
```

SecAgent 也兼容 Agent Plugins 1.0.0 格式。该格式使用根目录 `plugin.json`，可选 `skills/<name>/SKILL.md` 和 `mcp.json`。

## 注册工具

插件入口导出 `activate(api)`：

```js
export async function activate(api) {
  api.registerTool({
    name: "create_item",
    description: "创建一条记录",
    inputSchema: {
      type: "object",
      required: ["title"],
      properties: { title: { type: "string" } }
    }
  }, async ({ title }) => ({ title }))

  return () => api.unregisterTool("create_item")
}
```

工具 key 会由宿主加上插件 ID 前缀，形式为 `<plugin-id>__<tool-name>`。

## 编写 Skill

Skill 文件应包含 YAML frontmatter：

```md
---
name: SecScore
description: 处理学生查询、积分加减分和撤销。
---
# SecScore

## 使用约束

执行写入操作前，先展示变更明细并等待用户确认。
```

SecAgent 会扫描工作目录三层以内的 `SKILL.md`，并把名称、描述和入口文件加入系统提示词。模型需要完整流程时，可以通过 `secagent__read_skill` 读取正文。

## 设计原则

- Skill 的 `description` 只负责帮助模型判断是否相关
- 完整工具名、参数、返回值和安全约束写在 Skill 正文中
- 工具端必须重新校验权限、参数和业务状态
- 写入类工具保留备份，或使用原子替换
- 不要把密钥或敏感数据写进提示词

更多约定见主项目中的 [`docs/plugins.md`](https://github.com/SECTL/SecAgent/blob/master/docs/plugins.md)。
