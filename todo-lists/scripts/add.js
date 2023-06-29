// Variable para almacenar las tareas
let todos = [];

// Elementos del DOM
const newTodoInput = document.getElementById('newTodoInput');
const todoList = document.getElementById('todoList');
const contador = document.getElementById('contador');
const checkboxInput = document.getElementById('checkbox');
const clearCompletedBtn = document.getElementById('clearCompleted');

function showNotification(message) {
  var notification = document.getElementById('notification');
  notification.innerText = message;
  notification.style.display = 'block';
  setTimeout(function() {
    notification.style.display = 'none';
  }, 3000); // Oculta la notificación después de 3 segundos (ajusta el tiempo según tus necesidades)
}

function showAlertMinLetters() {
  showNotification('Debes introducir al menos tres letras.');
}

function showAlertMaxLetters() {
  showNotification('Has alcanzado el límite de 70 letras.');
}

function updateItemCount() {
  const count = todos.reduce((count, todo) => {
    return todo.completed ? count : count + 1;
  }, 0);
  contador.textContent = `${count} items left`;
}

function createTodoElement(text, completed) {
  const newTodo = document.createElement('li');
  newTodo.classList.add('todo-item');

  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.checked = completed;

  const todoText = document.createElement('span');
  todoText.textContent = text;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'x';
  deleteButton.classList.add('delete-button');
  deleteButton.style.visibility = 'hidden';

  newTodo.addEventListener('mouseover', () => {
    deleteButton.style.visibility = 'visible';
  });
  newTodo.addEventListener('mouseout', () => {
    deleteButton.style.visibility = 'hidden';
  });

  deleteButton.addEventListener('click', () => {
    deleteTodo(newTodo);
  });

  newTodo.appendChild(checkbox);
  newTodo.appendChild(todoText);
  newTodo.appendChild(deleteButton);

  return newTodo;
}

todoList.addEventListener('change', event => {
  const checkbox = event.target;
  if (checkbox.matches('.todo-item input[type="checkbox"]')) {
    const todoItem = checkbox.closest('.todo-item');
    const index = Array.from(todoList.children).indexOf(todoItem);
    if (index !== -1) {
      todos[index].completed = checkbox.checked;
      updateItemCount();
      saveTodos();
    }
  }
});

checkboxInput.addEventListener('change', addTodo);

clearCompletedBtn.addEventListener('click', function() {
  todos = todos.filter(todo => !todo.completed);
  renderTodos();
  updateItemCount();
  saveTodos();
});

const listItems = document.querySelectorAll('.control__container ul li');

listItems.forEach(function(item) {
  item.addEventListener('click', function() {
    const selectedOption = item.textContent;
    todos.forEach(function(todo) {
      const todoItem = document.getElementById(`todo-${todos.indexOf(todo)}`);
      switch (selectedOption) {
        case 'All':
          todoItem.style.display = 'flex';
          break;
        case 'Active':
          todoItem.style.display = todo.completed ? 'none' : 'flex';
          break;
        case 'Complete':
          todoItem.style.display = todo.completed ? 'flex' : 'none';
          break;
      }
    });
  });
});

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
  const todosJSON = localStorage.getItem('todos');
  return todosJSON ? JSON.parse(todosJSON) : [];
}

function renderTodos() {
  todoList.innerHTML = '';

  if (todos.length === 0) {
    return;
  }

  todos.forEach((todo, index) => {
    const newTodo = createTodoElement(todo.text, todo.completed);
    newTodo.id = `todo-${index}`;

    todoList.appendChild(newTodo);
  });
}

newTodoInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    addTodo();
  }
});

function addTodo() {
  const text = newTodoInput.value.trim();
  const letterCount = text.length;

  if (letterCount < 3) {
    showAlertMinLetters();
    return;
  }

  if (letterCount > 70) {
    showAlertMaxLetters();
    newTodoInput.value = newTodoInput.value.slice(0, 70);

    return;
  }

  const newTodo = {
    text: text,
    completed: false
  };

  todos.push(newTodo);
  saveTodos();
  renderTodos();
  updateItemCount();

  newTodoInput.value = '';
}

function deleteTodo(todoElement) {
  const index = Array.from(todoList.children).indexOf(todoElement);
  if (index !== -1) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
    updateItemCount();
  }
}

const checkboxes = document.querySelectorAll('.todo-item input[type="checkbox"]');

function restoreCheckboxState() {
  const checkedValuesString = localStorage.getItem('checkedValues');
  if (checkedValuesString) {
    const checkedValues = JSON.parse(checkedValuesString);
    checkboxes.forEach((checkbox) => {
      if (checkedValues.includes(checkbox.value)) {
        checkbox.checked = true;
      }
    });
  }
}

function saveCheckboxState() {
  const checkedValues = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
  const checkedValuesString = JSON.stringify(checkedValues);
  localStorage.setItem('checkedValues', checkedValuesString);
}

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', saveCheckboxState);
});

document.addEventListener('DOMContentLoaded', () => {
  renderTodos();
  updateItemCount();
  restoreCheckboxState();
});
