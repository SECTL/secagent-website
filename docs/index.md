---
layout: home
title: SecAgent
titleTemplate: 专注智教场景的 AI Agent
description: 专注智教场景的 AI Agent，联动 ClassIsland、SecRandom、Class Widgets、ICC-CE 等现有应用，实现课表、点名、画板、积分软件的全链路打通。
hero:
  name: SecAgent
  text: 从传统电教，走向 <span class="hero-gradient-purple">AI</span> 赋能的 <span class="hero-gradient-purple">智慧教育</span>
  tagline: 专注智教场景的 AI Agent，联动 ClassIsland、SecRandom、Class Widgets、ICC-CE 等现有应用，实现课表/点名/画板/积分软件全链路打通
  image:
    src: /icon.png
    alt: SecAgent logo
  actions:
    - theme: brand
      text: 开始使用
      link: /guide/quickstart
features:
  - icon: ⚡
    title: 自然语言驱动
    details: 从一句话开始，让 Agent 理解意图并组织工具调用，减少重复的界面操作。
  - icon: 🧩
    title: 插件化扩展
    details: 用插件、Skill 和 MCP 接入已有应用，把每个专业工具变成 Agent 能力。
  - icon: 🛡️
    title: 过程可追踪
    details: 思考片段、工具调用、返回结果和会话记录都有迹可循，适合真实业务落地。
  - icon: ↔
    title: 桌面端与 CLI
    details: 桌面端负责日常交互，CLI 适合自动化与调试，两者共享同一套会话运行时。
---

<section class="home-section">
  <div class="home-kicker">Agent runtime</div>
  <h2>不是聊天窗口，而是一条能落地的执行链。</h2>
  <div class="home-copy">SecAgent 将模型、工具、插件和工作区组织在一起。每一步都能被看见，每一个扩展点都能被替换。</div>
  <div class="signal-grid">
    <div class="signal-card">
      <h3>从意图到结果</h3>
      <div class="card-copy">把复杂的教育场景操作拆成清晰的 Agent 流程。</div>
      <div class="trace">
        <div class="trace-row">
          <span class="trace-index">01</span>
          <span class="trace-label">自然语言输入</span>
          <span class="trace-detail">“查询李明当前积分”</span>
        </div>
        <div class="trace-row">
          <span class="trace-index">02</span>
          <span class="trace-label">模型理解意图</span>
          <span class="trace-detail">选择合适的工具</span>
        </div>
        <div class="trace-row">
          <span class="trace-index">03</span>
          <span class="trace-label">工具返回结果</span>
          <span class="trace-detail">可追踪、可审计</span>
        </div>
      </div>
    </div>
    <div class="command-card">
      <h3>从 CLI 开始</h3>
      <div class="card-copy">几条命令启动一个工作区，保留每次交互的会话上下文。</div>
      <div class="command-code">npm install<br />npm run build:cli<br />node dist/index.js init --workspace ./demo-workspace<br />node dist/index.js run &quot;查询李明当前积分&quot; \<br />&nbsp;&nbsp;--workspace ./demo-workspace</div>
      <div class="link-row">
        <a href="/guide/quickstart">快速开始 →</a>
        <a href="/reference/cli">CLI 参考</a>
      </div>
    </div>
  </div>
</section>

<section class="home-section">
  <div class="home-kicker">Built to connect</div>
  <h2>把已有的优秀工具，接入同一套 Agent 体验。</h2>
  <div class="home-copy">SecAgent 不替代你的业务系统。它负责理解用户表达、协调工具执行，并把结果带回一个连续的工作区。</div>
  <div class="architecture-grid">
    <div class="architecture-card">
      <span class="number">01 / HOST</span>
      <h3>桌面端 &amp; CLI</h3>
      <div class="card-copy">在对话界面或终端中输入自然语言，持续复用同一份会话记录。</div>
    </div>
    <div class="architecture-card">
      <span class="number">02 / EXTENSION</span>
      <h3>插件 &amp; Skill</h3>
      <div class="card-copy">把领域规则、操作流程和业务约束写成可发现、可复用的能力。</div>
    </div>
    <div class="architecture-card">
      <span class="number">03 / TOOLING</span>
      <h3>MCP &amp; 本地工具</h3>
      <div class="card-copy">连接 SecScore、班级软件或任何符合约定的本地与远程工具服务。</div>
    </div>
  </div>
  <div class="home-callout">
    <div>
      <h3>准备把你的工具交给 Agent？</h3>
      <div class="card-copy">从插件清单、Skill frontmatter 和 MCP 接口约定开始。</div>
    </div>
    <div class="link-row">
      <a href="/guide/plugins">阅读插件文档 →</a>
    </div>
  </div>
</section>

<section class="home-section">
  <div class="home-kicker">Open source</div>
  <h2>和项目一起，把“会操作”做得更可靠。</h2>
  <div class="home-copy">SecAgent 正在持续连接更多教育工具与真实工作流。欢迎在 GitHub 查看源码、提交 Issue，或贡献一个插件。</div>
  <div class="link-row">
    <a href="https://github.com/SECTL/SecAgent">打开 SecAgent 仓库 →</a>
    <a href="https://github.com/SECTL">浏览 SECTL 组织</a>
  </div>
</section>
