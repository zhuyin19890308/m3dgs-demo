# M3DGS: Modal 3D Gaussian Splatting for Video-Based Spectral Dynamics

独立的静态实验展示项目，包含已有交互模型、Lego 原始微运动证据、方法介绍及后续实验计划。

**发布操作见 [DEPLOY.md](DEPLOY.md)。**

```text
index.html              首页：原始证据、方法介绍与交互入口
style.css / app.js      页面样式与交互切换
demos/                  5 个独立交互 HTML，已内嵌模型和运动数据
assets/                 原始幅值动画、测试图、数据诊断配置
asset-manifest.json     导出资源的来源、大小与 SHA-256
.nojekyll               直接发布静态文件
scripts/check_site.py   本地资源、相对路径与完整性检查
DEPLOY.md               Windows / PowerShell 发布教程
```

本项目无需安装依赖、执行构建或重新训练；运行展示时不依赖原 M3DGS 研究项目目录。Python 仅用于可选的本地预览与资源检查，线上由浏览器运行 HTML、JavaScript 与 WebGL。

## 本地预览

在此目录打开 PowerShell：

```powershell
py scripts/check_site.py
py -m http.server 8000 --bind 127.0.0.1
```

打开 <http://127.0.0.1:8000/>，结束时按 Ctrl+C。如果没有 `py`，可改用 `python`。

## 已有实验

| 阶段 | 演示 | 说明 |
| --- | --- | --- |
| V1 | `demos/davis.html` | Davis / Wireman 二维模态交互 |
| V2 | `demos/gaussian-coarse.html` | Gaussian 粗初始化与共享运动场 |
| V2 | `demos/gaussian-hifi.html` | 同一阶段的高保真外观升级 |
| V3 | `demos/gaussian-vibration.html` | 逐 Gaussian 单频振动约束，保留泛化未改善的结果 |
| V4 | `demos/mechanics.html` | 合成代理系统中的力学模态逆渲染交互 |

交互 HTML 已内嵌浏览器所需数据。首页按需加载一个窗口，不需要训练 checkpoint、CUDA 或 Python 后端。

## 来源与范围

Lego 来自 [3D Motion Magnification（ICCV 2023）](https://3d-motion-magnification.github.io/)公开的 `lego_3Hz` 合成场景，原作者为 Brandon Y. Feng、Hadi AlZayer、Michael Rubinstein、William T. Freeman 和 Jia-Bin Huang。原始数据、场景和第三方素材归原作者所有。Davis / Wireman 视频来源与实现记录见[研究项目](https://github.com/zhuyin19890308/M3DGS)。本仓库未新增覆盖第三方素材的授权声明。

帧差不是位移真值，光流为估计值，作者的 50× 几何图仅供诊断。Lego 缺少标定力、质量和真实材料参数，不能单凭该数据宣称完成真实受力标定。

`asset-manifest.json` 中的 `source` 字段记录资源在原研究项目内的历史位置，只作来源记录，不是运行时需要访问的路径。

## 后续维护

修改介绍：编辑 `index.html`；修改交互条目：编辑 `app.js`；更新模型：替换 `demos/` 中的独立 HTML，并更新 `asset-manifest.json` 的文件大小与 SHA-256。新增实验时补充数据出处、原始证据、验证协议、结果和局限，然后按 DEPLOY.md 提交更新。
