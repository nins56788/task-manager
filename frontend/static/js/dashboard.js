// ============================================
// DASHBOARD PAGE SCRIPTS
// ============================================

const API_BASE = 'http://localhost:5000/api';
let currentUser = null;
let allTasks = [];
let token = null;

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');
const logoutBtn = document.getElementById('logout-btn');
const logoutLink = document.getElementById('logout-link');
const newTaskBtn = document.getElementById('new-task-btn');
const taskModal = document.getElementById('task-modal');
const taskForm = document.getElementById('task-form');
const closeModalBtn = document.querySelector('.close-modal');
const modalCancelBtn = document.getElementById('modal-cancel');
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.querySelector('.sidebar');
const notification = document.getElementById('notification');

function clearAuthSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

function redirectToAuth() {
    window.location.href = 'auth.html';
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'auth.html';
        return;
    }

    currentUser = JSON.parse(localStorage.getItem('user'));
    await setupDashboard();
});

async function setupDashboard() {
    setupEventListeners();
    await loadUserProfile();
    await loadTasks();
    await loadStats();
    await loadRecommendations();
}

function setupEventListeners() {
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection(item.getAttribute('data-section'));
        });
    });

    // Logout
    logoutBtn.addEventListener('click', logout);
    logoutLink.addEventListener('click', logout);

    // Task Modal
    newTaskBtn.addEventListener('click', openTaskModal);
    closeModalBtn.addEventListener('click', closeTaskModal);
    modalCancelBtn.addEventListener('click', closeTaskModal);
    taskModal.addEventListener('click', (e) => {
        if (e.target === taskModal) closeTaskModal();
    });

    // Task Form
    taskForm.addEventListener('submit', handleCreateTask);

    // Filters
    document.getElementById('filter-status').addEventListener('change', filterTasks);
    document.getElementById('filter-priority').addEventListener('change', filterTasks);
    document.getElementById('filter-category').addEventListener('change', filterTasks);

    // Menu toggle
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Settings forms
    document.getElementById('profile-form').addEventListener('submit', handleUpdateProfile);
    document.getElementById('password-form').addEventListener('submit', handleChangePassword);
}

function switchSection(sectionName) {
    // Hide all sections
    contentSections.forEach(section => {
        section.classList.remove('active');
    });

    // Remove active from nav items
    navItems.forEach(item => {
        item.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Mark nav item as active
    const navItem = document.querySelector(`[data-section="${sectionName}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }

    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'tasks': 'My Tasks',
        'analytics': 'Analytics',
        'recommendations': 'AI Suggestions',
        'settings': 'Settings'
    };
    document.getElementById('page-title').textContent = titles[sectionName] || 'Dashboard';

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
    }
}

async function loadUserProfile() {
    try {
        const response = await fetch(`${API_BASE}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(currentUser));

            // Update UI
            document.getElementById('user-avatar').src = `https://ui-avatars.com/api/?name=${currentUser.first_name}+${currentUser.last_name}&background=3498db&color=fff`;

            // Load settings form
            document.getElementById('setting-firstname').value = currentUser.first_name || '';
            document.getElementById('setting-lastname').value = currentUser.last_name || '';
            document.getElementById('setting-email').value = currentUser.email || '';
            document.getElementById('setting-timezone').value = currentUser.timezone || 'UTC';
        } else if (response.status === 401 || response.status === 422) {
            clearAuthSession();
            redirectToAuth();
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function loadTasks() {
    try {
        const response = await fetch(`${API_BASE}/tasks/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            allTasks = data.tasks;
            renderTasks(allTasks);
            loadRecentTasks();
        } else if (response.status === 401 || response.status === 422) {
            clearAuthSession();
            redirectToAuth();
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        showNotification('Failed to load tasks', 'error');
    }
}

function renderTasks(tasks) {
    const tbody = document.getElementById('tasks-table-body');

    if (tasks.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="7" class="text-center">No tasks found</td></tr>';
        return;
    }

    tbody.innerHTML = tasks.map(task => `
        <tr>
            <td>
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div class="task-meta">${task.description ? task.description.substring(0, 50) + '...' : 'No description'}</div>
            </td>
            <td>${escapeHtml(task.category || 'General')}</td>
            <td><span class="task-badge badge-${task.priority}">${task.priority}</span></td>
            <td>
    <input 
        type="checkbox"
        ${task.completed ? 'checked' : ''}
        onchange="toggleTaskComplete(${task.id}, this.checked)"
    >
    ${getStatusBadge(task.status)}
</td>
            <td>${formatDate(task.due_date)}</td>
            <td>${task.ml_suggested_best_time || '---'}</td>
            <td>
                <div class="task-actions">
                    <button class="btn-icon" title="Edit" onclick="editTask(${task.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon danger" title="Delete" onclick="deleteTask(${task.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function loadRecentTasks() {
    const recentContainer = document.getElementById('recent-tasks');
    const recent = allTasks.slice(0, 5);

    if (recent.length === 0) {
        recentContainer.innerHTML = '<p class="empty-state">No tasks yet. Create your first task!</p>';
        return;
    }

    recentContainer.innerHTML = recent.map(task => `
        <div class="task-item">
            <div class="task-info">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div class="task-meta">
                    <span class="task-badge badge-${task.priority}">${task.priority}</span>
                    <span>${formatDate(task.due_date)}</span>
                </div>
            </div>
            <span class="task-badge badge-${task.priority}">${task.status}</span>
        </div>
    `).join('');
}

async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/tasks/stats/summary`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = response.json();
            data.then(stats => {
                document.getElementById('total-tasks').textContent = stats.total_tasks;
                document.getElementById('completed-tasks').textContent = stats.completed;
                document.getElementById('pending-tasks').textContent = stats.pending;
                document.getElementById('completion-rate').textContent = Math.round(stats.completion_rate) + '%';
            });
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadRecommendations() {
    try {
        const response = await fetch(`${API_BASE}/tasks/recommendations`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const recommendations = data.recommendations;

            // Display recommendations
            displayRecommendations(recommendations);
            displayDashboardRecommendations(recommendations);
        }
    } catch (error) {
        console.error('Error loading recommendations:', error);
    }
}

function displayDashboardRecommendations(recommendations) {
    const container = document.getElementById('ai-recommendations');

    if (!recommendations.optimize_schedule || recommendations.optimize_schedule.length === 0) {
        container.innerHTML = '<p class="empty-state">Recommendations will appear as you add tasks</p>';
        return;
    }

    container.innerHTML = recommendations.optimize_schedule.map(rec => `
        <div class="recommendation-item">
            <div class="task-title">💡 ${rec}</div>
        </div>
    `).join('');
}

function displayRecommendations(recommendations) {
    // Immediate action
    const immediateContainer = document.getElementById('immediate-action');
    if (recommendations.immediate_action && recommendations.immediate_action.length > 0) {
        immediateContainer.innerHTML = recommendations.immediate_action.map(item => `
            <div class="recommendation-item">
                <div class="task-title">⚡ ${escapeHtml(item.title)}</div>
                <div class="task-meta">${item.reason}</div>
            </div>
        `).join('');
    }

    // Weekly focus
    const weeklyContainer = document.getElementById('weekly-focus');
    if (recommendations.this_week && recommendations.this_week.length > 0) {
        weeklyContainer.innerHTML = recommendations.this_week.map(task => `
            <div class="recommendation-item">
                <div class="task-title">📅 ${escapeHtml(task)}</div>
            </div>
        `).join('');
    }

    // Productivity tips
    const tipsContainer = document.getElementById('productivity-tips');
    const tips = [
        '✅ Focus on high-priority tasks in the morning when you\'re most fresh',
        '📊 Track your completed tasks to build consistent habits',
        '⏰ Use the AI suggestions to schedule tasks at optimal times',
        '🎯 Break large tasks into smaller, manageable subtasks'
    ];
    tipsContainer.innerHTML = tips.map(tip => `
        <div class="recommendation-item">
            <div class="task-title">${tip}</div>
        </div>
    `).join('');
}

function filterTasks() {
    const status = document.getElementById('filter-status').value;
    const priority = document.getElementById('filter-priority').value;
    const category = document.getElementById('filter-category').value;

    let filtered = allTasks;

    if (status) {
        filtered = filtered.filter(t => t.status === status);
    }
    if (priority) {
        filtered = filtered.filter(t => t.priority === priority);
    }
    if (category) {
        filtered = filtered.filter(t => t.category === category);
    }

    renderTasks(filtered);
}

function openTaskModal() {
    document.getElementById('modal-title').textContent = 'Create New Task';
    taskForm.reset();
    taskForm.dataset.taskId = '';
    taskModal.classList.add('active');
}

function closeTaskModal() {
    taskModal.classList.remove('active');
}

async function handleCreateTask(e) {
    e.preventDefault();

    const taskId = taskForm.dataset.taskId;

    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const category = document.getElementById('task-category').value;
    const priority = document.getElementById('task-priority').value;
    const estimatedHours = parseFloat(document.getElementById('task-hours').value);
    const dueDate = document.getElementById('task-due-date').value;
    const tags = document.getElementById('task-tags').value;

    // CHECKBOX
    const completed = document.getElementById('task-completed').checked;

    // TASK DATA
    const taskData = {
        title,
        description,
        category,
        priority,
        estimated_hours: estimatedHours,
        due_date: dueDate,
        tags,

        // NEW
        completed,
        status: completed ? 'completed' : 'pending'
    };

    try {
const method = taskId ? 'PUT' : 'POST';

const url = taskId
    ? `${API_BASE}/tasks/${taskId}`
    : `${API_BASE}/tasks/`;

const response = await fetch(url, {
    method,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },

    body: JSON.stringify(taskData)
});

        if (response.ok) {

            showNotification(
                taskId
                    ? 'Task updated successfully'
                    : 'Task created successfully',
                'success'
            );

            closeTaskModal();

            await loadTasks();
            await loadStats();
            await loadRecommendations();

        } else if (
            response.status === 401 ||
            response.status === 422
        ) {

            clearAuthSession();

            showNotification(
                'Session expired. Please sign in again.',
                'error'
            );

            setTimeout(() => redirectToAuth(), 1000);

        } else {

            showNotification(
                'Failed to save task',
                'error'
            );
        }

    } catch (error) {

        console.error('Error saving task:', error);

        showNotification(
            'Error saving task',
            'error'
        );
    }
}

async function editTask(taskId) {
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;

    document.getElementById('modal-title').textContent = 'Edit Task';
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-description').value = task.description || '';
    document.getElementById('task-category').value = task.category || 'general';
    document.getElementById('task-priority').value = task.priority || 'medium';
    document.getElementById('task-hours').value = task.estimated_hours || 1;
    document.getElementById('task-completed').checked = task.completed || false;
    document.getElementById('task-due-date').value = task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '';
    document.getElementById('task-tags').value = task.tags || '';

    taskForm.dataset.taskId = taskId;
    taskModal.classList.add('active');
}

async function deleteTask(taskId) {
    
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            showNotification('Task deleted successfully', 'success');
            await loadTasks();
            await loadStats();
        } else {
            showNotification('Failed to delete task', 'error');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        showNotification('Error deleting task', 'error');
    }
}

async function toggleTaskComplete(taskId, isChecked) {
 const task = allTasks.find(t => t.id === taskId);

    if (!task) return;

    try {

        const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':` Bearer ${token}`
            },

            body: JSON.stringify({
                ...task,
                completed: isChecked,
                status: isChecked ? 'completed' : 'pending'
            })
        });

        if (response.ok) {

            showNotification(
                isChecked
                    ? 'Task completed!'
                    : 'Task pending!',
                'success'
            );

            await loadTasks();
            await loadStats();

        } else {

            showNotification(
                'Failed to update task',
                'error'
            );
        }

    } catch (error) {

        console.error(error);

        showNotification(
            'Error updating task',
            'error'
        );
    }
}
async function handleUpdateProfile(e) {
    e.preventDefault();

    const firstName = document.getElementById('setting-firstname').value;
    const lastName = document.getElementById('setting-lastname').value;
    const timezone = document.getElementById('setting-timezone').value;

    try {
        const response = await fetch(`${API_BASE}/auth/update-profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                timezone
            })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('user', JSON.stringify(data.user));
            showNotification('Profile updated successfully', 'success');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('Error updating profile', 'error');
    }
}

async function handleChangePassword(e) {
    e.preventDefault();

    const oldPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                old_password: oldPassword,
                new_password: newPassword
            })
        });

        if (response.ok) {
            showNotification('Password changed successfully', 'success');
            e.target.reset();
        } else {
            showNotification('Current password is incorrect', 'error');
        }
    } catch (error) {
        console.error('Error changing password:', error);
        showNotification('Error changing password', 'error');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'auth.html';
}

function showNotification(message, type) {
    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '---';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function getStatusBadge(status) {
    const badges = {
        'pending': '<span class="task-badge badge-low">Pending</span>',
        'in_progress': '<span class="task-badge badge-medium">In Progress</span>',
        'completed': '<span class="task-badge badge-high" style="background: rgba(46, 204, 113, 0.2); color: #2ecc71;">Completed</span>',
        'cancelled': '<span class="task-badge" style="background: rgba(149, 165, 166, 0.2); color: #95a5a6;">Cancelled</span>'
    };
    return badges[status] || status;
}

// Auto-refresh every 30 seconds
setInterval(async () => {
    if (document.visibilityState === 'visible') {
        await loadTasks();
        await loadStats();
    }
}, 30000);
