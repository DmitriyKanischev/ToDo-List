const taskForm = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const listOfTask = document.querySelector('#tasksList');
const modalWindow = document.querySelector('#modalwindow');
const modalInput = document.querySelector('.modal__input');

let tasks = [];
let changedTasks = [];

if(localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach( (task) => renderTask(task))
}

checkEmptyList();

taskForm.addEventListener('submit', addTask);

listOfTask.addEventListener('click', deleteTask);

listOfTask.addEventListener('click', doneTask);

listOfTask.addEventListener('click', renderModal);

modalWindow.addEventListener('click', closeWindow);

modalWindow.addEventListener('submit', changeTaskText);

// Функции
function addTask(event) {
    event.preventDefault();

    let taskText = taskInput.value;

    //Создаём объект задачи
    let newTask = {
        id: Date.now(),
        done: false,
        changed: false,
        text: taskText
    }
    tasks.push(newTask);
    addToLocalStorage();

    //Рендерим задачу стр. 91
    renderTask(newTask);

    taskInput.value = '';
    taskInput.focus();

    checkEmptyList()
}
function deleteTask(event){
    if(event.target.dataset.action === 'delete') {
        const parentNode = event.target.closest('li');
        
        //Определяем id задачи на которой произошло событие
        const id = Number(parentNode.id);
        // Находим индекс этой задачи в массиве
        const index = tasks.findIndex((task) => task.id === id);
        // Удаляем задачу из массива по индексу
        tasks.splice(index, 1);
        addToLocalStorage();
        
        parentNode.remove();

        checkEmptyList()
    }
}
function doneTask(event){
    if(event.target.dataset.action === 'done') {
        const parentNode = event.target.closest('li');
        const taskTitle = parentNode.querySelector('.task-title');
        taskTitle.classList.toggle('task-title--done');
        
        //Определяем id задачи на которой произошло событие
        const id = Number(parentNode.id);
        // Находим задачу с нужным id
        let task = tasks.find( (task) => task.id === id);
        // Меняем статус done на противоположный
        task.done = !task.done;
        addToLocalStorage();
    }
}
function checkEmptyList() {
    if(tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
                                    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                                    <div class="empty-list__title">Список дел пуст</div>
                                </li>`

        listOfTask.insertAdjacentHTML('afterbegin', emptyListHTML)
    }
    if(tasks.length > 0) {
        const emptyList = document.querySelector('#emptyList');
        emptyList ? emptyList.remove() : null;
    }
}
function addToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function renderTask(task) {

    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    let taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${task.text}</span>
    <div class="task-item__buttons">
        <button type="button" data-action="change" class="btn-action">
			<img src="./img/pen.svg" alt="Done" width="18" height="18">
		</button>
        <button type="button" data-action="done" class="btn-action">
            <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
            <img src="./img/cross.svg" alt="Done" width="18" height="18">
        </button>
    </div>
</li>`

listOfTask.insertAdjacentHTML('beforeend', taskHTML);

}
function renderModal(event) {
    if(event.target.dataset.action === 'change') {
        modalWindow.classList.remove('none');
        // Определяем ближайший li на котором произошло открытие окна
        const parentNode = event.target.closest('li');

        const id = Number(parentNode.id);
        // При открытии окна, id изменяемого элемента добавляется в массив.
        // !! В массиве всегда только один элемент, все что закрывает окно - очищает массив
        changedTasks.push(id)
    }
}
function closeWindow(event) {
    if(event.target.dataset.action === 'close') {
        // !! В массиве всегда только один элемент, все что закрывает окно - очищает массив
        changedTasks.length = 0;
        // Обнуляем значение в input и прячем окно
        modalInput.value = '';
        modalWindow.classList.add('none');
    }
}
function changeTaskText(event) {
        event.preventDefault();
        //Получаем id задачи на которой происходило событие изменения
        const changedId = changedTasks[0];

        //Находим элемент с нужным id  в разметке
        const changedNode = document.getElementById(`${changedId}`);

        // Находим задачу в массиве
        let task = tasks.find( (task) => task.id === changedId);

        // Перезаписываем значения в объекте
        task.text = modalInput.value;

        //Находим span в котором содержится текст задачи и меняем его
        changedNode.children[0].textContent = modalInput.value;

        addToLocalStorage()

        // !! В массиве всегда только один элемент, все что закрывает окно - очищает массив
        changedTasks.length = 0;
        modalInput.value = '';
        modalWindow.classList.add('none');  
}