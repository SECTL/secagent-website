---
layout: home
title: SecAgent
titleTemplate: 专注智教场景的 AI Agent
description: 专注智教场景的 AI Agent，联动 ClassIsland、SecRandom、Class Widgets、ICC-CE 等现有应用，实现课表、点名、画板、积分软件的全链路打通。
hero:
  name: SecAgent
  text: 从传统电教，走向<br /><span class="hero-gradient-purple">AI</span> 赋能的 <span class="hero-gradient-purple">智慧教育</span>
  tagline: 专注智教场景的 AI Agent，联动 ClassIsland、SecRandom、Class Widgets、ICC-CE 等现有应用，实现课表/点名/画板/积分软件全链路打通
  image:
    src: /icon.png
    alt: SecAgent logo
  actions:
    - theme: brand
      text: 开始使用
      link: '#quick-start'
features:
  - icon: '<span class="feature-icon-pair"><img src="./classisland-icon.png" alt="ClassIsland" /><img src="./cw-icon.png" alt="Class Widgets" /></span>'
    title: 课表软件联动
    details: '<span class="feature-prompts"><span>“明天数学课跟音乐课换了”</span><span>“下节课是啥”</span></span>'
  - icon: '<img class="feature-icon-single" src="./iccce-logo.png" alt="ICC-CE" />'
    title: 批注画板操作
    details: '<span class="feature-prompts"><span>“将杜甫的基本信息插入画板”</span><span>“将圆柱和圆锥的面积公式插入画板”</span></span>'
  - icon: '<img class="feature-icon-single" src="./secrandom-logo.png" alt="SecRandom" />'
    title: 一句话随机抽人
    details: '<span class="feature-prompts"><span>“抽个人回答问题”</span></span>'
  - icon: '<img class="feature-icon-single" src="./SecScore.png" alt="SecScore" />'
    title: 课堂积分操作
    details: '<span class="feature-prompts"><span>“给张三加两份，昨天主动帮忙值日”</span></span><span class="feature-note">———— 自动调用积分软件操作分数并填写对应理由</span>'
---

<section id="quick-start" class="home-section quick-start-section">
  <div class="home-kicker">Quick start</div>
  <h2>三步开始使用 SecAgent。</h2>
  <div class="home-copy">先下载客户端，再准备账号或模型服务配置，最后打开软件开始你的第一句话。</div>
    <div class="quick-start-steps">
      <article class="quick-start-step download-step">
        <div class="quick-start-step-number">01</div>
        <div class="quick-start-step-content">
          <div class="download-step-intro">
            <h3><i class="fa-solid fa-download step-title-icon" aria-hidden="true"></i>下载安装包</h3>
            <p class="quick-start-description">首先，选择适合您的平台和打包方式。正式 Release 发布前，普通下载按钮暂不可用。</p>
          </div>
          <div class="download-grid">
            <div class="download-platform">
              <h4><i class="fa-brands fa-windows platform-icon" aria-hidden="true"></i><span>Windows</span></h4>
              <p class="platform-description">Windows 10 及更高版本</p>
              <div class="download-actions">
                <button class="download-button is-disabled" type="button" disabled title="Release 发布后可用"><i class="fa-solid fa-download" aria-hidden="true"></i><span>绿色版</span></button>
                <button class="download-button is-disabled" type="button" disabled title="Release 发布后可用"><i class="fa-solid fa-download" aria-hidden="true"></i><span>安装包</span></button>
            </div>
            </div>
            <div class="download-platform">
              <h4><i class="fa-brands fa-linux platform-icon" aria-hidden="true"></i><span>Linux</span></h4>
              <p class="platform-description">Debian 10 或其衍生版</p>
              <div class="download-actions">
                <button class="download-button is-disabled" type="button" disabled title="Release 发布后可用"><i class="fa-solid fa-download" aria-hidden="true"></i><span>绿色版</span></button>
                <button class="download-button is-disabled" type="button" disabled title="Release 发布后可用"><i class="fa-solid fa-download" aria-hidden="true"></i><span>安装包</span></button>
            </div>
            </div>
            <div class="download-platform">
              <h4><i class="fa-brands fa-apple platform-icon" aria-hidden="true"></i><span>macOS</span></h4>
              <p class="platform-description">macOS Big Sur 11 及更高版本</p>
              <div class="download-actions">
                <button class="download-button is-disabled" type="button" disabled title="Release 发布后可用"><i class="fa-solid fa-download" aria-hidden="true"></i><span>绿色版</span></button>
                <button class="download-button is-disabled" type="button" disabled title="Release 发布后可用"><i class="fa-solid fa-download" aria-hidden="true"></i><span>安装包</span></button>
            </div>
          </div>
        </div>
        <a class="ci-download-link" href="https://github.com/SECTL/SecAgent/actions/workflows/build.yml" target="_blank" rel="noopener noreferrer">
          <i class="fa-solid fa-diamond ci-special-icon" aria-hidden="true"></i>
          <i class="fa-brands fa-github" aria-hidden="true"></i>
          <span>下载 CI 构建</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
    <article class="quick-start-step">
      <div class="quick-start-step-number">02</div>
      <div class="quick-start-step-content">
        <h3><i class="fa-solid fa-user step-title-icon" aria-hidden="true"></i>准备账号或模型配置</h3>
        <p class="quick-start-description">根据你的使用方式，准备 SECTL 账号，或者填写自定义 LLM 供应商信息。</p>
        <div class="quick-start-options">
          <div class="quick-start-option">
            <h4>使用 SECTL 账号</h4>
            <p>趁等待客户端下载的时间，前往 SECTL 登录或注册账号。</p>
            <a class="quick-start-link" href="https://sectl.cn/" target="_blank" rel="noopener noreferrer">前往 SECTL 登录 / 注册 →</a>
          </div>
          <div class="quick-start-divider">如果您有自定义LLM</div>
          <div class="quick-start-option">
            <h4>使用自定义 LLM</h4>
            <p>提前准备供应商的端点、API Key、模型名称等配置信息。</p>
            <span class="config-hint">Endpoint · API Key · Model</span>
          </div>
        </div>
      </div>
    </article>
    <article class="quick-start-step">
      <div class="quick-start-step-number">03</div>
      <div class="quick-start-step-content">
        <h3><i class="fa-solid fa-circle-check step-title-icon" aria-hidden="true"></i>打开软件，开始使用</h3>
        <p class="quick-start-description">启动 SecAgent，完成首次配置，然后直接输入自然语言指令，让 Agent 帮你完成课堂操作。</p>
        <div class="launch-flow">
          <span>打开 SecAgent</span>
          <span aria-hidden="true">→</span>
          <span>完成配置</span>
          <span aria-hidden="true">→</span>
          <span>输入第一句话</span>
        </div>
      </div>
    </article>
  </div>
</section>
