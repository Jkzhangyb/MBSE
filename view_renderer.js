import { getData } from './data_loader.js';
import { createBurndownChart, createTasksChart } from './chart_utils.js';

export function renderPlaceholder(container, title, description = '此功能模块正在开发中，敬请期待。') {
    container.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <i data-lucide="construct" class="w-24 h-24 mb-6 text-gray-600"></i>
            <h2 class="text-3xl font-bold text-gray-300 mb-2">${title}</h2>
            <p>${description}</p>
        </div>
    `;
    lucide.createIcons();
}

export async function renderDashboard(container) {
    const data = await getData('dashboard_data');
    if (!data) {
        container.innerHTML = `<p>Error loading dashboard data.</p>`;
        return;
    }

    const kpiCards = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div class="card">
                <h3 class="text-gray-400 text-sm font-medium">项目总体状态</h3>
                <p class="text-3xl font-semibold text-white mt-2">${data.projectHealth.overallStatus}</p>
            </div>
            <div class="card">
                <h3 class="text-gray-400 text-sm font-medium">预算使用率</h3>
                <p class="text-3xl font-semibold text-white mt-2">${(data.projectHealth.budgetUsage * 100).toFixed(0)}%</p>
            </div>
            <div class="card">
                <h3 class="text-gray-400 text-sm font-medium">逾期任务</h3>
                <p class="text-3xl font-semibold text-red-400 mt-2">${data.projectHealth.overdueTasks}</p>
            </div>
            <div class="card">
                <h3 class="text-gray-400 text-sm font-medium">高风险项</h3>
                <p class="text-3xl font-semibold text-amber-400 mt-2">${data.projectHealth.risks.high}</p>
            </div>
        </div>
    `;

    const charts = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div class="card h-96 flex flex-col">
                <h3 class="text-lg font-semibold text-white mb-4">任务概览</h3>
                <div class="flex-grow"><canvas id="tasksChart"></canvas></div>
            </div>
            <div class="card h-96 flex flex-col">
                <h3 class="text-lg font-semibold text-white mb-4">资源燃尽图</h3>
                <div class="flex-grow"><canvas id="burndownChart"></canvas></div>
            </div>
        </div>
    `;

    const lists = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card">
                <h3 class="text-lg font-semibold text-white mb-4">团队成员</h3>
                <ul class="space-y-4">
                    ${data.teamMembers.map(member => `
                        <li class="flex items-center justify-between">
                            <div class="flex items-center">
                                <img class="w-10 h-10 rounded-full" src="https://i.pravatar.cc/150?u=${member.id}" alt="${member.name}">
                                <div class="ml-3">
                                    <p class="font-medium text-white">${member.name}</p>
                                    <p class="text-sm text-gray-400">${member.role}</p>
                                </div>
                            </div>
                            <span class="text-xs font-medium capitalize status-badge status-${member.status === 'online' ? 'completed' : 'on-hold'}">${member.status}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div class="card">
                <h3 class="text-lg font-semibold text-white mb-4">最新动态</h3>
                <ul class="space-y-4">
                     ${data.activityStream.map(activity => `
                        <li class="flex items-start">
                           <i data-lucide="zap" class="w-5 h-5 text-cyan-400 mt-1 mr-3 flex-shrink-0"></i>
                           <div>
                                <p class="text-sm"><span class="font-semibold text-white">${activity.user}</span> ${activity.action} <span class="font-semibold text-cyan-400">${activity.target}</span></p>
                                <p class="text-xs text-gray-500">${new Date(activity.timestamp).toLocaleString()}</p>
                           </div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `;

    container.innerHTML = kpiCards + charts + lists;
    createTasksChart(data.taskOverview);
    createBurndownChart(data.resourceBurndown);
}


export async function renderProjects(container) {
    const data = await getData('projects_data');
    if (!data) {
        container.innerHTML = `<p>Error loading projects data.</p>`;
        return;
    }
    const statusClasses = {
        "In Progress": "in-progress",
        "Completed": "completed",
        "On Hold": "on-hold",
        "Planning": "planning"
    };

    const projectCards = data.map(project => `
        <div class="card flex flex-col justify-between">
            <div>
                <div class="flex justify-between items-start">
                    <h3 class="text-xl font-bold text-white mb-2">${project.name}</h3>
                    <span class="status-badge status-${statusClasses[project.status] || 'gray'}">${project.status}</span>
                </div>
                <p class="text-gray-400 mb-4">项目经理: ${project.manager}</p>
            </div>
            <div>
                <div class="flex justify-between items-center mb-1 text-sm">
                    <span class="text-gray-400">进度</span>
                    <span class="font-semibold text-white">${project.progress}%</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fg" style="width: ${project.progress}%"></div>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">${projectCards}</div>`;
}

function renderModelNode(node) {
    const isFolder = node.type === 'folder';
    const icon = isFolder ? 'folder' : 'file-code-2';
    const childrenHtml = isFolder && node.children.length > 0 ? `<ul>${node.children.map(renderModelNode).join('')}</ul>` : '';

    return `
        <li>
            <div class="flex items-center py-2 hover:bg-gray-800/50 rounded-md px-2">
                <i data-lucide="${icon}" class="w-5 h-5 ${isFolder ? 'text-cyan-400' : 'text-gray-400'} mr-3"></i>
                <span class="font-medium text-white flex-grow">${node.name}</span>
                ${!isFolder ? `<span class="text-sm text-gray-500 mr-6">v${node.version}</span>` : ''}
                <span class="text-sm text-gray-400 mr-6">${isFolder ? '' : node.creator}</span>
                <span class="text-sm text-gray-500">${isFolder ? '' : new Date(node.lastModified).toLocaleDateString()}</span>
            </div>
            ${childrenHtml}
        </li>
    `;
}

export async function renderModels(container) {
    const data = await getData('models_data');
    if (!data) {
        container.innerHTML = `<p>Error loading models data.</p>`;
        return;
    }

    const modelTree = data.map(renderModelNode).join('');
    container.innerHTML = `<div class="card model-tree"><ul>${modelTree}</ul></div>`;
}

export async function renderSimulations(container) {
    const data = await getData('simulations_data');
    if (!data) {
        container.innerHTML = `<p>Error loading simulations data.</p>`;
        return;
    }

    const statusClasses = {
        "Completed": "completed",
        "Running": "running",
        "Failed": "failed",
        "Queued": "queued"
    };

    const tableRows = data.map(sim => `
        <tr>
            <td class="font-medium text-white">${sim.name}</td>
            <td><span class="status-badge status-${statusClasses[sim.status] || 'gray'}">${sim.status}</span></td>
            <td>${sim.initiator}</td>
            <td>${new Date(sim.createTime).toLocaleString()}</td>
            <td>${sim.duration || 'N/A'}</td>
            <td>
                <button class="text-cyan-400 hover:text-cyan-300 disabled:text-gray-600 disabled:cursor-not-allowed" ${!sim.resultSummaryUrl ? 'disabled' : ''}>
                    <i data-lucide="bar-chart-3"></i>
                </button>
            </td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="card overflow-x-auto p-0">
            <table class="table-custom">
                <thead>
                    <tr>
                        <th>任务名称</th>
                        <th>状态</th>
                        <th>发起人</th>
                        <th>创建时间</th>
                        <th>耗时</th>
                        <th>结果</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>
    `;
}
