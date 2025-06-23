const findUser = (id, data) => data.users.find(u => u.id === id) || { name: '未知用户', avatarUrl: '' };
const findObject = (type, id, data) => {
    const container = data.businessObjects[type + 's'];
    return container ? container.find(o => o.id === id) : null;
};

const getIconForNotification = (type) => {
    switch (type) {
        case 'task_assigned': return 'clipboard-plus';
        case 'review_request': return 'file-check-2';
        case 'mention': return 'at-sign';
        case 'simulation_completed': return 'bot';
        default: return 'bell';
    }
};

export function renderNotificationsPanel(container, user, data, markAsReadCallback) {
    const userNotifications = data.notifications
        .filter(n => n.recipientId === user.id)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const panelHtml = `
        <div class="notification-panel absolute right-8 top-24 w-96 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl z-50 text-gray-300">
            <div class="p-4 border-b border-gray-700">
                <h3 class="font-semibold text-white">通知中心</h3>
            </div>
            <ul class="max-h-96 overflow-y-auto">
                ${userNotifications.length > 0 ? userNotifications.map(notif => `
                    <li class="border-b border-gray-700/50 p-4 hover:bg-gray-700/50 transition-colors duration-200 ${notif.isRead ? 'opacity-60' : ''}">
                        <div class="flex items-start">
                            <i data-lucide="${getIconForNotification(notif.type)}" class="w-5 h-5 text-cyan-400 mr-4 mt-1 flex-shrink-0"></i>
                            <div class="flex-grow">
                                <p class="font-semibold text-sm text-white">${notif.title}</p>
                                <p class="text-xs text-gray-400 mb-1">${notif.content}</p>
                                <div class="flex justify-between items-center">
                                    <p class="text-xs text-gray-500">${new Date(notif.timestamp).toLocaleString()}</p>
                                    ${!notif.isRead ? `<button data-notif-id="${notif.id}" class="mark-as-read-btn text-xs text-cyan-400 hover:text-white">标记为已读</button>` : ''}
                                </div>
                            </div>
                        </div>
                    </li>
                `).join('') : '<li class="p-6 text-center text-gray-500">没有新的通知</li>'}
            </ul>
        </div>
    `;
    container.innerHTML = panelHtml;
    lucide.createIcons();

    container.querySelectorAll('.mark-as-read-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            markAsReadCallback(e.currentTarget.dataset.notifId);
        });
    });
}


export function renderIMPanel(container, user, data, createTaskCallback) {
    const allConversations = [...data.imData.channels, ...data.imData.directMessages];
    const userConversations = allConversations.filter(c => c.members.includes(user.id));
    const activeConversation = userConversations[0]; // default to first one
    const getSender = (senderId) => findUser(senderId, data);

    const panelHtml = `
        <div class="im-panel absolute right-8 top-24 w-[50rem] h-[40rem] bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl z-50 flex text-gray-300 overflow-hidden">
            <div class="w-1/3 border-r border-gray-700 flex flex-col">
                <div class="p-4 border-b border-gray-700"><h3 class="font-semibold text-white">即时通讯</h3></div>
                <ul class="flex-grow overflow-y-auto">
                    ${userConversations.map(convo => `
                        <li class="p-4 border-b border-gray-700/50 hover:bg-gray-700/50 cursor-pointer ${convo.id === activeConversation.id ? 'bg-gray-700' : ''}">
                            <p class="font-semibold text-white">${convo.name || getSender(convo.members.find(m => m !== user.id)).name}</p>
                            <p class="text-sm text-gray-400 truncate">${convo.messages.slice(-1)[0].content.text}</p>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div class="w-2/3 flex flex-col">
                <div class="p-4 border-b border-gray-700"><h3 class="font-semibold text-white">${activeConversation.name || getSender(activeConversation.members.find(m => m !== user.id)).name}</h3></div>
                <div class="flex-grow p-4 space-y-4 overflow-y-auto">
                    ${activeConversation.messages.map(msg => {
                        const sender = getSender(msg.senderId);
                        const isSystem = sender.role === undefined;
                        const isCurrentUser = msg.senderId === user.id;

                        if (isSystem) {
                            return `<div class="text-center text-xs text-cyan-400 my-2">--- ${msg.content.text} ---</div>`;
                        }
                        
                        return `
                        <div class="flex items-start gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}">
                            <img src="${sender.avatarUrl}" class="w-8 h-8 rounded-full">
                            <div class="max-w-md">
                                <div class="bg-gray-700 rounded-lg p-3">
                                    <p class="text-sm">${msg.content.text}</p>
                                </div>
                                <p class="text-xs text-gray-500 mt-1 px-1 ${isCurrentUser ? 'text-right' : ''}">${sender.name}, ${new Date(msg.timestamp).toLocaleTimeString()}</p>
                            </div>
                            ${msg.id === 'msg-ch-003' ? `<button data-message-content="${msg.content.text}" class="create-task-btn self-center text-cyan-400 hover:text-white" title="转为待办"><i data-lucide="plus-square"></i></button>` : ''}
                        </div>
                        `;
                    }).join('')}
                </div>
                <div class="p-4 border-t border-gray-700">
                    <div class="flex items-center bg-gray-900 rounded-lg px-3 py-2">
                        <input type="text" placeholder="输入消息..." class="bg-transparent w-full focus:outline-none text-white">
                        <button class="text-cyan-400 hover:text-white"><i data-lucide="send"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `;
    container.innerHTML = panelHtml;
    lucide.createIcons();

    container.querySelectorAll('.create-task-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const messageContent = e.currentTarget.dataset.messageContent;
            createTaskCallback(messageContent, user.id);
        });
    });
}
