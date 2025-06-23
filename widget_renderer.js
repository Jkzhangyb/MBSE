import { createBarChart, createLineChart } from './chart_utils.js';

export function renderPlaceholderWidget(container, user, data, widgetDef) {
    container.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <i data-lucide="construct" class="w-16 h-16 mb-4 text-gray-600"></i>
            <p class="text-gray-400">${widgetDef.title}</p>
            <p class="text-sm">${widgetDef.description}</p>
        </div>
    `;
}

export function renderTodoWidget(container, user, data) {
    const userTodos = data.todos.filter(t => t.assigneeId === user.id);
    const pending = userTodos.filter(t => t.status === 'pending');
    const inProgress = userTodos.filter(t => t.status === 'in-progress');
    const completed = userTodos.filter(t => t.status === 'completed');

    const createTodoList = (title, todos, dotClass) => `
        <div class="mb-3">
            <h4 class="text-sm font-semibold text-gray-400 mb-2">${title} (${todos.length})</h4>
            <ul class="space-y-2">
            ${todos.length > 0 ? todos.map(todo => `
                <li class="todo-list-item text-sm">
                    <span class="todo-status-dot ${dotClass}"></span>
                    <span class="flex-grow">${todo.title}</span>
                </li>
            `).join('') : '<li class="text-xs text-gray-500">无</li>'}
            </ul>
        </div>
    `;

    container.innerHTML = `
        <div class="overflow-y-auto h-full pr-2">
            ${createTodoList('待处理', pending, 'dot-pending')}
            ${createTodoList('进行中', inProgress, 'dot-in-progress')}
            ${createTodoList('已完成', completed, 'dot-completed')}
        </div>
    `;
}

export function renderInstantMessageWidget(container, user, data) {
    const channel = data.imData.channels[0];
    const findUser = (id) => data.users.find(u => u.id === id) || { name: '系统' };

    container.innerHTML = `
        <div class="h-full flex flex-col">
            <h4 class="text-sm font-semibold text-gray-400 mb-2">${channel.name}</h4>
            <ul class="flex-grow space-y-3 overflow-y-auto pr-2">
                ${channel.messages.slice(-5).map(msg => `
                    <li class="text-sm">
                        <p><span class="font-bold text-cyan-400">${findUser(msg.senderId).name}:</span> ${msg.content.text}</p>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
}

export function renderModelLibraryWidget(container, user, data) {
    const models = data.businessObjects.models;
    container.innerHTML = `
        <ul class="space-y-3 overflow-y-auto h-full pr-2">
            ${models.map(model => `
                <li class="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-800/50">
                    <div>
                        <i data-lucide="file-code-2" class="inline w-4 h-4 mr-2 text-gray-400"></i>
                        <span>${model.name}</span>
                        <span class="ml-2 text-xs text-gray-500">v${model.version}</span>
                    </div>
                    <span class="status-badge status-${model.status === 'approved' ? 'completed' : 'pending'}">${model.status}</span>
                </li>
            `).join('')}
        </ul>
    `;
}

export function renderSimulationQueueWidget(container, user, data) {
    const simulations = data.businessObjects.simulations;
    const statusClasses = { "completed": "completed", "queued": "queued" };
    container.innerHTML = `
        <ul class="space-y-3 overflow-y-auto h-full pr-2">
             ${simulations.map(sim => `
                <li class="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-800/50">
                    <div>
                        <i data-lucide="play-circle" class="inline w-4 h-4 mr-2 text-gray-400"></i>
                        <span>${sim.name}</span>
                    </div>
                    <span class="status-badge status-${statusClasses[sim.status] || 'gray'}">${sim.status}</span>
                </li>
            `).join('')}
        </ul>
    `;
}

export function renderSystemMonitorWidget(container) {
    const canvasId = `sys-monitor-${Date.now()}`;
    container.innerHTML = `<canvas id="${canvasId}"></canvas>`;
    setTimeout(() => {
        createLineChart(canvasId, 'CPU Usage', ['-60s', '-45s', '-30s', '-15s', 'Now'], [45, 50, 62, 58, 75]);
    }, 50);
}

export function renderServiceHealthWidget(container) {
    const services = [
        { name: 'API Gateway', status: 'ok' },
        { name: 'Model Repository', status: 'ok' },
        { name: 'Simulation Engine', status: 'degraded' },
        { name: 'Auth Service', status: 'ok' },
        { name: 'Database', status: 'ok' },
    ];
    const statusIcon = { ok: 'check-circle', degraded: 'alert-triangle' };
    const statusColor = { ok: 'text-green-400', degraded: 'text-yellow-400' };

    container.innerHTML = `
        <ul class="space-y-3 h-full pr-2">
            ${services.map(s => `
                <li class="flex items-center justify-between text-sm">
                    <span>${s.name}</span>
                    <span class="flex items-center ${statusColor[s.status]}">
                        <i data-lucide="${statusIcon[s.status]}" class="w-4 h-4 mr-2"></i>
                        <span>${s.status === 'ok' ? 'Operational' : 'Degraded'}</span>
                    </span>
                </li>
            `).join('')}
        </ul>
    `;
}

export function renderUserActivityWidget(container) {
    const canvasId = `user-activity-${Date.now()}`;
    container.innerHTML = `<canvas id="${canvasId}"></canvas>`;
    setTimeout(() => {
        createBarChart(canvasId, 'Users', ['Admin', 'PM', 'Architect', 'Simulator', 'Modeler'], [1, 5, 8, 12, 15]);
    }, 50);
}
