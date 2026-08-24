# 配置模型

SecAgent 在工作区的 `secagent.yaml` 中保存 Agent 配置。API key 通过 `apiKeyEnv` 指向 `.env` 中的环境变量。

## OpenAI Responses

```yaml
agent:
  provider: openai-responses
  model: gpt-5
  apiKeyEnv: OPENAI_API_KEY
  baseUrl: https://api.openai.com/v1
  endpoint: /responses
  maxTokens: 16384
```

## OpenAI 兼容端点

任何提供 Chat Completions 兼容接口的服务都可以使用这一配置：

```yaml
agent:
  provider: openai-compatible
  model: gpt-5
  apiKeyEnv: OPENAI_API_KEY
  baseUrl: https://api.openai.com/v1
  endpoint: /chat/completions
  maxTokens: 16384
```

## Anthropic Messages

```yaml
agent:
  provider: anthropic
  model: claude-sonnet-4-20250514
  apiKeyEnv: ANTHROPIC_API_KEY
  baseUrl: https://api.anthropic.com
  endpoint: /v1/messages
  anthropicVersion: "2023-06-01"
  maxTokens: 16384
```

## Google Gemini

```yaml
agent:
  provider: google
  model: gemini-2.5-flash
  apiKeyEnv: GEMINI_API_KEY
  baseUrl: https://generativelanguage.googleapis.com/v1beta
  endpoint: ""
  maxTokens: 16384
```

## 配置多个模型

在 `agent.models` 中列出多个模型后，桌面端可以在输入框右侧切换：

```yaml
agent:
  provider: openai-compatible
  model: gpt-5
  apiKeyEnv: OPENAI_API_KEY
  baseUrl: https://api.openai.com/v1
  endpoint: /chat/completions
  models:
    - id: gpt-5
      name: GPT-5
      provider: openai-compatible
      model: gpt-5
      apiKeyEnv: OPENAI_API_KEY
      baseUrl: https://api.openai.com/v1
      endpoint: /chat/completions
    - id: claude
      name: Claude Sonnet
      provider: anthropic
      model: claude-sonnet-4-20250514
      apiKeyEnv: ANTHROPIC_API_KEY
      baseUrl: https://api.anthropic.com
      endpoint: /v1/messages
```

## 安全建议

- 不要把 `.env` 提交到 Git
- 不要在 `secagent.yaml` 中直接写入 API key
- 为不同项目使用不同工作区
- 生产环境的 MCP 服务仍需自行校验权限、参数和业务状态
