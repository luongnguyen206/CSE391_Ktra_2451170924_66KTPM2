let tasks = [];

const tasksContainer = document.getElementById('tasksContainer');
const addTaskForm = document.getElementById('addTaskForm');
const taskNameInput = document.getElementById('taskName');
const priorityInput = document.getElementById('priority');
const statusInput = document.getElementById('status');
const priorityBtns = document.querySelectorAll('.priority-btn');

function saveLocal() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadFromLocal() {
    const data = localStorage.getItem('tasks');
    return data ? JSON.parse(data) : null;
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
}

// Load data
fetch('data.json')
    .then(r => {
        if (!r.ok) throw new Error('Không thể tải dữ liệu.');
        return r.json();
    })
    .then(data => {
        tasks = Array.isArray(data) ? data : (data.tasks || []);// Hỗ trợ cả mảng trực tiếp hoặc object có trường tasks
        const local = loadFromLocal();
        if (local && local.length) tasks = local;
        renderTasks();
    })
    .catch(err => {
        const local = loadFromLocal();
        if (local) { tasks = local; renderTasks(); }
        else console.error(err);
    });

function renderTasks() {
    tasksContainer.innerHTML = '';
    tasks.forEach(t => {
        const col = document.createElement('div');
        col.className = 'col-12';
        col.innerHTML = `
            <div class="task-card d-flex align-items-center justify-content-between bg-white p-3 mb-1 rounded shadow-sm">
                <div class="w-25">
                    <div class="small text-muted">Task</div>
                    <div class="fw-normal">${escapeHtml(t.name)}</div>
                </div>
                <div class="text-center w-25">
                    <div class="small text-muted">Priority</div>
                    <div class="${t.priority === 'High' ? 'text-danger' : t.priority === 'Medium' ? 'text-warning' : 'text-success'}">${t.priority}</div>
                </div>
                <div class="w-25">
                    <span class="badge bg-light text-dark border">${t.status}</span>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline-secondary me-2" data-id="${t.id}">Sửa</button>
                    <button class="btn btn-sm btn-outline-danger" data-id="${t.id}">Xóa</button>
                </div>
            </div>
        `;
        col.querySelector('.btn-outline-danger').addEventListener('click', () => deleteTask(t.id));
        col.querySelector('.btn-outline-secondary').addEventListener('click', () => editTask(t.id));
        tasksContainer.appendChild(col);
    });
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveLocal();
    renderTasks();
}

// Priority button selection
priorityBtns.forEach(b => b.addEventListener('click', e => {
    priorityBtns.forEach(x => x.classList.remove('active'));
    e.currentTarget.classList.add('active');
    priorityInput.value = e.currentTarget.dataset.priority;
}));

// Form submit thêm task mới
addTaskForm.addEventListener('submit', e => {
    e.preventDefault();// Ngăn form submit mặc định

    const name = taskNameInput.value.trim();
    const priority = priorityInput.value || 'Low';// Mặc định là Low nếu chưa chọn

    if (!name || name.length > 100) {// Validate tên task ít nhất 1 ký tự và tối đa 100 ký tự
        taskNameInput.classList.add('is-invalid');
        return;
    }
    taskNameInput.classList.remove('is-invalid');

    tasks.push({ id: Date.now(), name, priority, status });
    saveLocal();// Lưu vào localStorage
    renderTasks();

    addTaskForm.reset();
    priorityInput.value = 'Low';
    priorityBtns.forEach(x => x.classList.remove('active'));

    bootstrap.Modal.getInstance(document.getElementById('addTaskModal')).hide();
});

taskNameInput.addEventListener('input', () => taskNameInput.classList.remove('is-invalid'));