'use strict';
const methods = {
  davis: {title:'V1 · Davis 二维模态交互', file:'davis.html', text:'从视频中提取候选振动分量，用二维模态叠加产生拖拽后的振动响应。该实验使用 Wireman 小人，作为视频模态交互的起点。', limit:'在画布上拖拽并松手观察响应。阻尼为手设参数；这是二维交互，不与 Lego 的三维误差直接排名。'},
  coarse: {title:'V2 · 三维 Gaussian 粗初始化', file:'gaussian-coarse.html', text:'从多视角外壳初始化 Gaussian，将原始微位移拟合为共享三维复数运动场，通过阻尼振子实现可转视角的交互反馈。', limit:'支持旋转视角、拖拽、轻敲与运动回放。外观仅为粗初始化，尚未进行光度优化和增密；不代表真实材料辨识。'},
  hifi: {title:'V2 · 高保真 Gaussian 外观与共享运动场', file:'gaussian-hifi.html', text:'先优化静态 3DGS 外观，再冻结外观，从原始微位移拟合共享三维复数运动场。它是 V2 的外观升级，与粗初始化属于同一研究阶段。', limit:'支持自由转视角、拖拽、轻敲和阻尼 / 频率调节。交互强度与阻尼不能解释为已标定的真实受力响应。'},
  vibration: {title:'V3 · 逐 Gaussian 单频振动约束', file:'gaussian-vibration.html', text:'冻结高保真静态外观，直接优化每个 Gaussian 的三维复振动系数，用时间差分 RGB、轨迹辅助和空间先验约束运动。', limit:'当前仅验证观测到的约 3 Hz 分量。原实验中训练差分误差略降，但动态留出相机误差增加约 34.72%，尚未通过泛化检验。动画中的 50× 放大仅供显示，不参与定量评价。'},
  mechanics: {title:'V4 · 力学模态参与逆渲染', file:'mechanics.html', text:'由固定质量和受支撑约束的弹簧图构造刚度系统，求解本征模态；输入驱动的阻尼动力学产生三维形变，再统一 Gaussian 渲染并辨识参数。', limit:'交互使用已知输入合成验证中拟合的代理系统，支持冲量激发和多模态响应。它不是 Lego 的真实受力标定；未见加载结论限于当前假定模型族，不能宣称全部物理参数均可靠恢复。'}
};
let selected = 'hifi';
const stage = document.getElementById('demo-stage');
const status = document.getElementById('demo-status');
const unload = document.getElementById('unload-demo');
function clearDemo() {
  stage.replaceChildren();
  const p = document.createElement('p');
  p.className = 'placeholder';
  p.textContent = '选择上方方法开始交互。';
  stage.append(p);
  unload.hidden = true;
  status.textContent = '';
}
document.querySelectorAll('[data-method]').forEach(button => {
  button.addEventListener('click', () => {
    selected = button.dataset.method;
    const m = methods[selected];
    document.querySelectorAll('[data-method]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    const title = document.createElement('h3'); title.textContent = m.title;
    const text = document.createElement('p'); text.textContent = m.text;
    const limit = document.createElement('p'); limit.className = 'small'; limit.textContent = m.limit;
    document.getElementById('method-description').replaceChildren(title, text, limit);
    document.getElementById('standalone').href = 'demos/' + m.file;
    loadDemo();
  });
});
function loadDemo() {
  const m = methods[selected];
  const frame = document.createElement('iframe');
  frame.title = m.title;
  frame.src = 'demos/' + m.file;
  frame.allowFullscreen = true;
  frame.addEventListener('load', () => {
    if (stage.firstElementChild !== frame) return;
    status.textContent = '交互页面已载入。若画布为空，请稍等或在独立窗口打开。';
  });
  stage.replaceChildren(frame);
  unload.hidden = false;
  status.textContent = '正在加载 ' + m.title + '…';
}
unload.addEventListener('click', clearDemo);
loadDemo();
