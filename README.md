# SecAgent 官网

SecAgent 官方网站与文档，使用 VitePress 构建，部署到 GitHub Pages。

## 本地开发

```bash
npm install
npm run dev
```

开发服务器固定运行在 `http://127.0.0.1:45396/`。启动前会检查该端口；如果已被占用，会先终止占用进程，不会回退到 5173 或自动切换端口。

## 构建与预览

```bash
npm run build
npm run preview
```

站点源文件位于 `docs/`，构建产物位于 `docs/.vitepress/dist`。

## 部署

推送到 `master` 分支后会触发两条部署流水线：

- `.github/workflows/deploy.yml`：构建并发布到 GitHub Pages：<https://sectl.github.io/secagent-website/>
- `.github/workflows/deploy-server.yml`：构建并以 `VITEPRESS_BASE=/` 部署（rsync）到自建服务器 `159.195.70.108:45372`，站点根目录为服务器上的 `/var/www/secagent-website`，由 nginx 提供静态服务

服务器部署使用仓库 secrets 中的专用 SSH 密钥（`SERVER_SSH_PRIVATE_KEY` / `SERVER_SSH_KNOWN_HOSTS`），密钥对的本地备份位于开发机 `~/.ssh/secagent-website-deploy`。
