const todoForm = document.querySelector("form");
const todoInput = document.getElementById("todo-input");
const todoListUL = document.getElementById("todo-list");
const errorMessage = document.getElementById("error-message");

let allTodos = getTodos();
updateTodoList();

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  addTodo();
});

function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText.length === 0) {
    errorMessage.textContent = "Task cannot be empty!";
    errorMessage.classList.add("show");
    todoInput.classList.add("error");
    setTimeout(() => {
      errorMessage.classList.remove("show");
      todoInput.classList.remove("error");
    }, 2000);
    return;
  }
  const todoObject = {
    text: todoText,
    completed: false,
    priority: false, // Added for priority feature
  };
  allTodos.push(todoObject);
  updateTodoList();
  saveTodos();
  todoInput.value = "";
}

function updateTodoList() {
  todoListUL.innerHTML = "";
  allTodos.forEach((todo, todoIndex) => {
    const todoItem = createTodoItem(todo, todoIndex);
    todoListUL.append(todoItem);
  });
}

function createTodoItem(todo, todoIndex) {
  const todoId = "todo-" + todoIndex;
  const todoLI = document.createElement("li");
  todoLI.className = "todo" + (todo.priority ? " high-priority" : "");
  todoLI.innerHTML = `
    <input type="checkbox" id="${todoId}">
    <label class="custom-checkbox" for="${todoId}">
      <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
      </svg>
    </label>
    <label for="${todoId}" class="todo-text">${todo.text}</label>
    <button class="edit-button">
      <svg fill="var(--accent-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 28-11t28 11l57 57q11 12 11 28t-11 28L233-250H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
      </svg>
    </button>
    <button class="delete-button">
      <svg fill="var(--danger-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
      </svg>
    </button>
  `;
  const deleteButton = todoLI.querySelector(".delete-button");
  deleteButton.addEventListener("click", () => deleteTodoItem(todoIndex));
  const checkbox = todoLI.querySelector("input");
  checkbox.addEventListener("change", () => {
    allTodos[todoIndex].completed = checkbox.checked;
    saveTodos();
  });
  const editButton = todoLI.querySelector(".edit-button");
  editButton.addEventListener("click", () => editTodoItem(todoIndex));
  const todoTextLabel = todoLI.querySelector(".todo-text");
  todoTextLabel.addEventListener("click", () => togglePriority(todoIndex));
  checkbox.checked = todo.completed;
  return todoLI;
}

function editTodoItem(todoIndex) {
  const newText = prompt("Edit task:", allTodos[todoIndex].text);
  if (newText !== null && newText.trim().length > 0) {
    allTodos[todoIndex].text = newText.trim();
    updateTodoList();
    saveTodos();
  } else if (newText !== null && newText.trim().length === 0) {
    alert("Task cannot be empty!");
  }
}

function togglePriority(todoIndex) {
  allTodos[todoIndex].priority = !allTodos[todoIndex].priority;
  updateTodoList();
  saveTodos();
}

function deleteTodoItem(todoIndex) {
  allTodos = allTodos.filter((_, i) => i !== todoIndex);
  saveTodos();
  updateTodoList();
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(allTodos));
}

function getTodos() {
  return JSON.parse(localStorage.getItem("todos") || "[]");
}