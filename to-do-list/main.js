document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('task-form').addEventListener('submit', addTask);

function addTask(e) {
    e.preventDefault();

    // Get form values
    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-desc').value;
    const date = document.getElementById('task-date').value;
    const priority = document.getElementById('task-priority').value;

    // Create task object
    const task = {
        title,
        desc,
        date,
        priority,
        completed: false,
    };

    // Save task to localStorage
    saveTask(task);

    // Clear form
    document.getElementById('task-form').reset();

    // Display task
    displayTask(task);
}

function saveTask(task) {
    let tasks = localStorage.getItem('tasks');
    if (tasks) {
        tasks = JSON.parse(tasks);
    } else {
        tasks = [];
    }

    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = localStorage.getItem('tasks');
    if (tasks) {
        tasks = JSON.parse(tasks);
        tasks.forEach(task => displayTask(task));
    }
}

function displayTask(task) {
    const taskList = document.getElementById('task-list');

    // Create list item
    const li = document.createElement('article');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.checked = task.completed ? 'checked' : 'unchecked';
    li.innerHTML = `
        <span>${task.title} - ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority</span>
        <div class="task-actions">
            <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    taskList.appendChild(li);

    // Add event listeners to buttons
    li.querySelector('.complete-btn').addEventListener('click', () => toggleCompleteTask(task, li));
    li.querySelector('.edit-btn').addEventListener('click', () => editTask(task, li));
    li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task, li));
}

function toggleCompleteTask(task, li) {
    task.completed = !task.completed;
    updateTaskInLocalStorage(task);
    li.classList.toggle('completed');
    li.dataset.checked = task.completed ? 'checked' : 'unchecked';
    li.querySelector('.complete-btn').textContent = task.completed ? 'Undo' : 'Complete';
}

function editTask(task, li) {
    // Fill the form with task data
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-desc').value = task.desc;
    document.getElementById('task-date').value = task.date;
    document.getElementById('task-priority').value = task.priority;

    // Remove task from localStorage
    deleteTask(task, li);
}

function deleteTask(task, li) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.filter(t => t.title !== task.title || t.date !== task.date);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Remove task from DOM
    li.remove();
}

function updateTaskInLocalStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    const index = tasks.findIndex(t => t.title === task.title && t.date === task.date);
    tasks[index] = task;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
