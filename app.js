import { getData } from './data_loader.js';
import { renderDesktop } from './desktop_renderer.js';
import { renderNotificationsPanel, renderIMPanel } from './component_renderer.js';

const state = {
    data: null,
    currentUser: null,
};

document.addEventListener('DOMContentLoaded', async () => {
    state.data = await getData('platform_data');
    if (!state.data) {
        document.body.innerHTML = 'Failed to load application data.';
        return;
    }
    
    setupUserMenu();
    setupHeaderActions();
    

    const initialUser = state.data.users.find(u => u.role === '项目经理');
    await switchUser(initialUser.id);

    lucide.createIcons();
});

function setupUserMenu() {
    const userMenu = document.getElementById('user-menu');
    userMenu.innerHTML = ''; // Clear static options
    state.data.users.forEach(user => {
        const userOption = document.createElement('a');
        userOption.href = '#';
        userOption.className = 'user-role-option block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50';
        userOption.dataset.userId = user.id;
        userOption.textContent = `${user.name} (${user.role})`;
        userOption.addEventListener('click', (e) => {
            e.preventDefault();
            switchUser(user.id);
            userMenu.classList.add('hidden');
            document.getElementById('user-menu-button').classList.remove('open');
        });
        userMenu.appendChild(userOption);
    });

    const userMenuButton = document.getElementById('user-menu-button');
    userMenuButton.addEventListener('click', () => {
        userMenu.classList.toggle('hidden');
        userMenuButton.classList.toggle('open');
    });

    document.addEventListener('click', (event) => {
        if (!userMenuButton.contains(event.target) && !userMenu.contains(event.target)) {
            userMenu.classList.add('hidden');
            userMenuButton.classList.remove('open');
        }
    });
}

function setupHeaderActions() {
    const notificationsBtn = document.getElementById('notifications-button');
    const imBtn = document.getElementById('im-button');
    const notificationPanelContainer = document.getElementById('notification-panel-container');
    const imPanelContainer = document.getElementById('im-panel-container');

    notificationsBtn.addEventListener('click', () => {
        const isHidden = notificationPanelContainer.classList.toggle('hidden');
        if (!isHidden) {
            renderNotificationsPanel(notificationPanelContainer, state.currentUser, state.data, markNotificationAsRead);
            imPanelContainer.classList.add('hidden');
        }
    });

    imBtn.addEventListener('click', () => {
        const isHidden = imPanelContainer.classList.toggle('hidden');
        if (!isHidden) {
            renderIMPanel(imPanelContainer, state.currentUser, state.data, createTaskFromIM);
            notificationPanelContainer.classList.add('hidden');
        }
    });
}

async function switchUser(userId) {
    state.currentUser = state.data.users.find(u => u.id === userId);
    if (!state.currentUser) return;

    updateHeaderUI();
    updateNotificationIndicator();

    const desktopContainer = document.getElementById('desktop-container');
    desktopContainer.innerHTML = `<div class=\"flex justify-center items-center h-full\"><div class=\"animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400\"></div></div>`;
    

    await new Promise(resolve => setTimeout(resolve, 50)); 
    
    renderDesktop(desktopContainer, state.currentUser, state.data);
    lucide.createIcons();
}

function updateHeaderUI() {
    document.getElementById('user-name').textContent = state.currentUser.name;
    document.getElementById('user-role').textContent = state.currentUser.role;
    document.getElementById('user-avatar').src = state.currentUser.avatarUrl;
}

function updateNotificationIndicator() {
    const unreadCount = state.data.notifications.filter(n => n.recipientId === state.currentUser.id && !n.isRead).length;
    const indicator = document.getElementById('notification-indicator');
    if (unreadCount > 0) {
        indicator.textContent = unreadCount;
        indicator.classList.remove('hidden');
    } else {
        indicator.classList.add('hidden');
    }
}

function markNotificationAsRead(notificationId) {
    const notif = state.data.notifications.find(n => n.id === notificationId);
    if (notif) {
        notif.isRead = true;
    }
    updateNotificationIndicator();

    const notificationPanelContainer = document.getElementById('notification-panel-container');
    if (!notificationPanelContainer.classList.contains('hidden')) {
        renderNotificationsPanel(notificationPanelContainer, state.currentUser, state.data, markNotificationAsRead);
    }
}

function createTaskFromIM(messageContent, assignerId) {
    const assignee = state.data.users.find(u => u.role === '建模工程师'); // Simulate assigning to modeler
    if (!assignee) return;

    const newTodoId = `todo-${Date.now()}`;
    const newTodo = {
        id: newTodoId,
        title: `来自IM: ${messageContent.substring(0, 30)}...`,
        assigneeId: assignee.id,
        creatorId: assignerId,
        projectId: "proj-xn23",
        status: "pending",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        description: `由 ${state.currentUser.name} 通过IM创建的任务: "${messageContent}"`
    };
    state.data.todos.push(newTodo);

    const newNotif = {
        id: `notif-${Date.now()}`,
        recipientId: assignee.id,
        type: "task_assigned",
        title: "您有一个来自IM的新任务",
        content: `${state.currentUser.name} 分配了新任务给您: ${messageContent.substring(0, 30)}...`,
        relatedObjectId: newTodoId,
        isRead: false,
        timestamp: new Date().toISOString()
    };
    state.data.notifications.push(newNotif);


    renderDesktop(document.getElementById('desktop-container'), state.currentUser, state.data);
    updateNotificationIndicator();


    const imPanelContainer = document.getElementById('im-panel-container');
    const confirmation = document.createElement('p');
    confirmation.className = 'text-center text-green-400 text-xs p-2';
    confirmation.textContent = `任务已创建并分配给 ${assignee.name}`;
    imPanelContainer.querySelector('.im-panel').appendChild(confirmation);
    setTimeout(() => confirmation.remove(), 3000);
}
