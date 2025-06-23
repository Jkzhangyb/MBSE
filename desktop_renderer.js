import {
    renderTodoWidget,
    renderInstantMessageWidget,
    renderModelLibraryWidget,
    renderSimulationQueueWidget,
    renderSystemMonitorWidget,
    renderServiceHealthWidget,
    renderUserActivityWidget,
    renderPlaceholderWidget
} from './widget_renderer.js';

const widgetRenderers = {
    TodoWidget: renderTodoWidget,
    InstantMessageWidget: renderInstantMessageWidget,
    ModelLibraryWidget: renderModelLibraryWidget,
    SimulationQueueWidget: renderSimulationQueueWidget,
    SystemMonitorWidget: renderSystemMonitorWidget,
    ServiceHealthWidget: renderServiceHealthWidget,
    UserActivityWidget: renderUserActivityWidget,
    ProjectGanttWidget: renderPlaceholderWidget,
    TaskKanbanWidget: renderPlaceholderWidget,
    NotificationCenterWidget: renderPlaceholderWidget,
};

export function renderDesktop(container, user, data) {
    const layoutConfig = data.desktopLayouts[user.id];
    if (!layoutConfig) {
        container.innerHTML = `<div class="p-8 text-center text-gray-500">No desktop layout configured for this role.</div>`;
        return;
    }

    container.innerHTML = '';
    container.className = 'flex-1 overflow-y-auto p-8 desktop-grid';
    container.style.gridTemplateRows = `repeat(${Math.max(...layoutConfig.map(w => w.y + w.h))}, minmax(100px, auto))`;

    layoutConfig.forEach(widgetPos => {
        const widgetDef = data.widgetLibrary.find(w => w.id === widgetPos.widgetId);
        if (!widgetDef) return;

        const widgetWrapper = document.createElement('div');
        widgetWrapper.className = 'widget card flex flex-col';
        widgetWrapper.style.gridColumn = `${widgetPos.x + 1} / span ${widgetPos.w}`;
        widgetWrapper.style.gridRow = `${widgetPos.y + 1} / span ${widgetPos.h}`;

        const widgetHeader = document.createElement('h3');
        widgetHeader.className = 'text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700/50';
        widgetHeader.textContent = widgetDef.title;
        widgetWrapper.appendChild(widgetHeader);
        
        const widgetContent = document.createElement('div');
        widgetContent.className = 'flex-grow overflow-hidden';
        widgetWrapper.appendChild(widgetContent);

        const renderer = widgetRenderers[widgetDef.componentName] || renderPlaceholderWidget;
        renderer(widgetContent, user, data, widgetDef);

        container.appendChild(widgetWrapper);
    });

    lucide.createIcons();
}
