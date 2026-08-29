# 自定义服务提供商

不使用官方模型服务时，可以在 SecAgent 中接入自己的模型服务。客户端支持以下 **4 种 API 协议**：

| 协议 | 典型服务 | 默认端点 |
|---|---|---|
| OpenAI Chat 兼容 | DeepSeek、火山方舟（豆包）、阿里云百炼（Qwen）、智谱 GLM、OpenRouter、本地 Ollama / vLLM 等 | `/chat/completions` |
| OpenAI Responses | OpenAI 官方及提供 Responses 兼容接口的服务 | `/responses` |
| Anthropic | Claude 官方 API 及兼容服务 | `/v1/messages` |
| Google Gemini | Google AI Studio | 自动拼接 `/models/<模型>:streamGenerateContent` |

四种协议均支持**流式输出**、**工具调用**（Agent 工具生态）与**图片输入**，思考强度（不思考 / 低 / 中 / 高）会按协议自动映射。

## OpenAI Chat 兼容

最通用的协议，市面上绝大多数模型服务与本地推理框架都提供兼容端点：

- 使用 `Authorization: Bearer <API Key>` 鉴权，端点默认 `/chat/completions`
- 思考强度按模型自动映射：DeepSeek、豆包、Qwen、GLM、Step 等模型使用各自的思考参数，GPT / o 系列使用 `reasoning_effort`，其余模型使用通用参数
- 任何「OpenAI 兼容」的中转或聚合服务都可以直接使用

## OpenAI Responses

对应 OpenAI 的 Responses API：

- 使用 `Authorization: Bearer <API Key>` 鉴权，端点默认 `/responses`
- 思考强度映射为 `reasoning.effort`

## Anthropic

对应 Claude 的 Messages API：

- 使用 `x-api-key` + `anthropic-version` 请求头鉴权（协议版本默认 `2023-06-01`，可配置）
- 端点默认 `/v1/messages`
- 思考强度映射为 thinking 配置

## Google Gemini

对应 Google AI Studio 的 Gemini API：

- 使用 `x-goog-api-key` 请求头鉴权，端点自动按模型名拼接
- 只填写 API Key 时，客户端可**自动列出账号下可用的 Gemini 文本模型**，无需手动维护模型列表
- 思考强度映射为 thinkingConfig

## 在客户端添加提供商

1. 打开设置，在「SecAgent 官方服务」卡片中开启**自定义模型模式**（关闭时自定义提供商不生效，需登录官方服务使用模型）
2. 点击「添加提供商」，选择协议并填写 Base URL、API Key 与模型列表；也可以从内置的提供商预设一键填充
3. API Key 仅保存在本地工作区的环境文件中，不会写入配置文件

::: tip 工作区配置
CLI 与桌面端也可以直接在工作区 `secagent.yaml` 中配置模型，各协议的完整字段见主项目 [README 的「模型配置」](https://github.com/SECTL/SecAgent#模型配置)。
:::
