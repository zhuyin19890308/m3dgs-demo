# 发布到 GitHub Pages（Windows / PowerShell）

这个目录就是独立展示仓库的根目录，文件已齐全，无需研究项目、训练环境或 Node.js 依赖。

下面以账号 `zhuyin19890308`、仓库名 `m3dgs-demo` 为例。如使用其他名称，请相应替换命令和网址。

## 1. 创建空仓库

1. 登录 GitHub，打开 <https://github.com/new>。
2. Owner 选择自己的账号，Repository name 填 `m3dgs-demo`。
3. 选择 **Public**。GitHub Free 的 Pages 使用公开仓库。
4. **不要勾选 Add a README file，也不要初始化 .gitignore 或 License**。本地已准备好文件与提交，远端保持为空。
5. 点击 **Create repository**。

参考：[上传本地项目的官方说明](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)。

## 2. 推送独立项目

打开 PowerShell，逐行执行：

```powershell
Set-Location -LiteralPath 'E:\code_lab\m3dgs\m3dgs-demo'
git status
git remote add origin https://github.com/zhuyin19890308/m3dgs-demo.git
git push -u origin main
```

本地已初始化 `main` 并保存首次提交，不需要再次 `git init` 或重新提交。首次通过 HTTPS 推送时，如 Git 弹出登录窗口，请使用自己的 GitHub 账号完成登录。

推送后刷新仓库主页，确认直接看到 `index.html`、`demos/`、`assets/` 和 `.nojekyll`。**index.html 必须位于仓库根目录，不要再套一层 m3dgs-demo 文件夹。**

当前资源约 108 MiB，最大的 HTML 约 48.4 MiB。部分 HTML 超过网页上传的单文件 25 MiB 限制，因此用 Git 推送；当前单文件均小于普通 Git 仓库的 100 MiB 限制。

参考：[GitHub 文件大小限制](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)。

## 3. 开启 Pages

1. 仓库顶部点击 **Settings**。
2. 左侧点击 **Pages**。
3. 找到 **Build and deployment**。
4. Source 选择 **Deploy from a branch**。
5. Branch 选择 **main**，目录选择 **/(root)**。
6. 点击 **Save**。

无需配置域名、额外部署 YAML 或手动创建 gh-pages 分支，根目录已有 `.nojekyll`。

参考：[配置 Pages 发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

## 4. 查看发布结果

1. 打开顶部 **Actions**，查看 Pages 部署任务。
2. 等任务成功变绿，返回 **Settings → Pages**。
3. 点击 **Visit site**。

如果使用上述账号和仓库名，预期网址为：

<https://zhuyin19890308.github.io/m3dgs-demo/>

这是部署成功后的预期地址，不表示当前已上线。GitHub 官方说明推送后发布可能需要最多约 10 分钟。

打开后检查：原始动画与测试图能显示；选择方法后能加载交互；独立窗口能打开对应实验。三维交互需要启用 WebGL2；高保真与力学页面首次下载、初始化需等待。

参考：[创建与访问 Pages 网站](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。

## 5. 以后更新

修改文件后，在独立项目目录运行：

```powershell
py scripts/check_site.py
git add .
git commit -m "Update experiment demos"
git push
```

Pages 会按同一设置自动更新。检查脚本仅用 Python 标准库；没有 `py` 时可用 `python`。

替换资源后更新 `asset-manifest.json` 中对应的 `bytes` 与 `sha256`；新增方法时同时更新 `app.js` 方法条目与 `index.html` 选择按钮，保持相对路径。

## 常见问题

- **remote origin already exists**：执行 `git remote -v` 核对地址。如确需更正，执行 `git remote set-url origin https://github.com/zhuyin19890308/m3dgs-demo.git`。
- **Repository not found**：确认已创建仓库，且 Owner、名称与登录账号正确。
- **fetch first**：通常是远端初始化了 README 等文件。先检查远端内容、合并已有提交，不要强制推送。
- **Pages 中没有 main**：先完成推送，再刷新设置页。
- **404**：确认 Actions 成功、发布目录为 `/(root)`、根目录有 `index.html`；项目网址需包含 `/m3dgs-demo/`。
- **图片或交互 404**：检查文件已提交、路径大小写一致，并保持现有相对路径。
- **画布空白**：使用“独立窗口打开”查看提示，确认浏览器 WebGL2 和硬件加速可用，等待较大模型初始化。
