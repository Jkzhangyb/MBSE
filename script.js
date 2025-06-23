
let currentRole = '';
const roleConfig = {

  admin: {
    title: '平台管理员',
    sidebar: ['系统监控','成员管理','角色分配'],
    messages: ['系统已更新','有新的用户申请'],
    extra: '系统日志\n安全审计'
  },
  pm: {
    title: '项目经理',
    sidebar: ['项目总览','任务燃尽','资源面板'],
    messages: ['项目A 截止日期临近','请检查资源分配'],
    extra: '提醒中心'
  },
  architect: {
    title: '系统架构师',
    sidebar: ['项目列表','架构编辑','版本比对'],
    messages: ['模型库更新','请同步最新需求'],
    extra: 'SSP 导出'
  },
  sim: {
    title: '仿真工程师',
    sidebar: ['仿真任务','流程编辑','结果面板'],
    messages: ['仿真B 运行完成','诊断报告生成'],
    extra: '仿真助手'
  },
  model: {
    title: '建模工程师',
    sidebar: ['建模任务','模型库','上传工具'],
    messages: ['新的模型任务分配'],
    extra: '快速建模模板'
  }
};

function login() {
  const role = document.getElementById('roleSelect').value;
  showConsole(role);
}

function showConsole(role) {
  const cfg = roleConfig[role];

  currentRole = role;
  document.getElementById('login').classList.add('hidden');
  document.getElementById('console').classList.remove('hidden');
  document.getElementById('roleTitle').textContent = cfg.title + ' 控制台';

  buildSidebar(cfg);
  buildTabs();
  createModules(cfg);
  document.getElementById('extra').textContent = cfg.extra;

  const msgs = cfg.messages || [];
  document.getElementById('messageCenter').textContent = `消息(${msgs.length})`;
  document.getElementById('messageList').innerHTML = msgs.map(m=>`<li>${m}</li>`).join('');

  loadLayout(role);
}

function buildSidebar(cfg) {
  const sb = document.getElementById('sidebar');
  sb.innerHTML = '';
  cfg.sidebar.forEach(name => {
    const div = document.createElement('div');
    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.checked = true;
    chk.onchange = () => toggleModule(name, chk.checked);
    div.appendChild(chk);
    const span = document.createElement('span');
    span.textContent = ' ' + name;
    div.appendChild(span);
    sb.appendChild(div);
  });
}

function createModules(cfg) {
  const container = document.getElementById('tab-overview');
  container.innerHTML = '';
  cfg.sidebar.forEach(name => {
    const sec = document.createElement('section');
    sec.id = 'mod-' + name;
    sec.textContent = name + ' 内容区域';

    sec.draggable = true;
    sec.ondragstart = dragStart;
    sec.ondragover = dragOver;
    sec.ondrop = drop;

    container.appendChild(sec);
  });
}


function toggleModule(name, show) {
  const id = 'mod-' + name;
  const el = document.getElementById(id);
  if (el) el.style.display = show ? 'block' : 'none';
  saveLayout();
}

function toggleMessages() {
  document.getElementById('messages').classList.toggle('hidden');
}

function closeMessages() {
  document.getElementById('messages').classList.add('hidden');
}

function logout() {
  document.getElementById('console').classList.add('hidden');
  document.getElementById('login').classList.remove('hidden');
}

function buildTabs() {
  document.querySelectorAll('#tabs li').forEach(li => {
    li.onclick = () => activateTab(li.dataset.tab);
  });
}

function activateTab(name) {
  document.querySelectorAll('#tabs li').forEach(li => {
    li.classList.toggle('active', li.dataset.tab === name);
  });
  document.querySelectorAll('.tab').forEach(div => {
    div.classList.toggle('hidden', div.id !== 'tab-' + name);
  });
}


let dragSrc;
function dragStart(e) {
  dragSrc = e.currentTarget;
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  if (dragSrc && dragSrc !== e.currentTarget) {
    const container = dragSrc.parentNode;
    container.insertBefore(dragSrc, e.currentTarget.nextSibling);
    saveLayout();
  }
}


function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : '');
}

function loadLayout(role) {
  const layout = JSON.parse(localStorage.getItem('layout-' + role) || '{}');

  if (layout.order) {
    const container = document.getElementById('tab-overview');
    layout.order.forEach(name => {
      const sec = document.getElementById('mod-' + name);
      if (sec) container.appendChild(sec);
    });
  }
  if (layout.visibility) {
    Object.keys(layout.visibility).forEach(k => {
      toggleModule(k, layout.visibility[k]);
      const chk = Array.from(document.querySelectorAll('#sidebar input')).find(i => i.nextSibling.textContent.trim() === k);
      if (chk) chk.checked = layout.visibility[k];
    });
  }

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') document.body.classList.add('dark');
}

function saveLayout() {

  const role = currentRole;
  const visibility = {};
  document.querySelectorAll('#sidebar div').forEach(div => {
    const name = div.querySelector('span').textContent.trim();
    const checked = div.querySelector('input').checked;
    visibility[name] = checked;
  });
  const order = Array.from(document.querySelectorAll('#tab-overview section')).map(sec => sec.id.replace('mod-',''));
  localStorage.setItem('layout-' + role, JSON.stringify({order, visibility}));

}

window.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') document.body.classList.add('dark');
});

