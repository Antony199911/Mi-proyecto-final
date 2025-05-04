document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Cargar tareas existentes
    renderTasks();

    // Agregar tarea
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTask());

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({ id: Date.now(), text: taskText });
            saveTasks();
            renderTasks();
            taskInput.value = '';
            taskInput.focus();
        }
    }

    // Eliminar tarea
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    // Renderizar tareas
    function renderTasks() {
        taskList.innerHTML = tasks.map(task => `
            <li class="task-item">
                <span class="task-text">${task.text}</span>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Eliminar</button>
            </li>
        `).join('');
    }

    // Guardar en localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Hacer funciones accesibles globalmente
    window.deleteTask = deleteTask;
});