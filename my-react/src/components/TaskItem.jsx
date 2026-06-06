import React from "react";

function TaskItem({ task = [], onEdit, onDelete }) {
    return (
        <div class="task-card d-flex align-items-center justify-content-between bg-white p-3 mb-1 rounded shadow-sm">
            <div class="w-25">
                <div class="small text-muted">Task</div>
                <div class="fw-normal">${}</div>
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
    )
}