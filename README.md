# SecAgent 官网

SecAgent 官方网站与文档，使用 VitePress 构建，部署到 GitHub Pages。

## 本地开发

```bash
npm install
npm run dev
```

## 构建与预览

```bash
npm run build
npm run preview
```

站点源文件位于 `docs/`，构建产物位于 `docs/.vitepress/dist`。

## 部署

推送到 `master` 分支后，`.github/workflows/deploy.yml` 会自动构建并发布到 GitHub Pages：

<https://sectl.github.io/secagent-website/>
