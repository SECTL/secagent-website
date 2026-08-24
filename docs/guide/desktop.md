# 桌面端

SecAgent 桌面端提供一个面向日常工作的 Agent 对话界面。它与 CLI 使用同一套运行时和工作区格式，适合边看过程、边调整配置。

## 开发运行

在 SecAgent 源码目录中：

```bash
npm install
npm run dev
```

## 工作区与会话

每个工作区可以包含：

- `secagent.yaml`：Agent、模型、MCP 与桌面端配置
- `.env`：模型和官方服务密钥
- `sessions/<session-id>/session.json`：会话内容
- `sessions/<session-id>/runtime.jsonl`：运行时事件流
- `audit/secagent.sqlite`：本地工具调用审计

CLI 和桌面端可以共享同一个工作区，因此调试时不需要手动复制上下文。

## 模型菜单

桌面端输入框右侧可以选择已配置的模型和推理强度：

- 不思考
- 低
- 中
- 高

OpenAI Responses 会映射到 `reasoning.effort`；Anthropic 与 Gemini 会映射到各自的 thinking 配置。

## 中文语音输入

桌面端麦克风按钮通过 SecAgent 官方服务的 WebSocket 接口进行云端识别。使用前需要登录官方服务，并配置：

```dotenv
SECTL_OFFICIAL_API_URL=https://secagent-api.sectl.cn/
SECTL_OFFICIAL_TOKEN=...
```

音频不会在本地使用 `sherpa-onnx` 模型处理。识别结果会实时插入输入框当前光标位置，再次点击麦克风即可结束录音。
