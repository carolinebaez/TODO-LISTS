
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

// Llamada a la función para mostrar la notificación de palabras mínimas
function showAlertMinLetters() {
  showNotification('Debes introducir al menos tres letras.');
}

// Llamada a la función para mostrar la notificación de palabras máximas
function showAlertMaxLetters() {
  showNotification('Has alcanzado el límite de 70 letras.');
}


// Función para actualizar el contador y mostrar las tareas sin hacer
function updateItemCount() {
  const count = todos.reduce((count, todo) => {
    return todo.completed ? count : count + 1;
  }, 0);
  contador.textContent = `${count} items left`;
}

// Función para crear un nuevo elemento de todo
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
  deleteButton.style.visibility = 'hidden'; // Oculta el botón inicialmente

  // Mostrar/Ocultar el botón "x" al pasar el cursor sobre el elemento
  newTodo.addEventListener('mouseover', () => {
    deleteButton.style.visibility = 'visible';
  });
  newTodo.addEventListener('mouseout', () => {
    deleteButton.style.visibility = 'hidden';
  });

  // Eliminar el elemento al hacer clic en el botón "x"
  deleteButton.addEventListener('click', () => {
    deleteTodo(newTodo);
  });

  newTodo.appendChild(checkbox);
  newTodo.appendChild(todoText);
  newTodo.appendChild(deleteButton);

  return newTodo;
}

// Evento para manejar el cambio en el checkbox
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

// Evento para manejar el cambio en el checkbox
checkboxInput.addEventListener('change', addTodo);

// Evento para manejar el clic en el botón "Clear Completed"
clearCompletedBtn.addEventListener('click', function() {
  todos = todos.filter(todo => !todo.completed);
  renderTodos();
  updateItemCount();
  saveTodos();
});

// Obtén una referencia a los elementos de la lista
const listItems = document.querySelectorAll('.control__container ul li');

// Recorre cada elemento de la lista y agrega un manejador de eventos
listItems.forEach(function(item) {
  item.addEventListener('click', function() {
    // Obtén el texto del elemento seleccionado
    const selectedOption = item.textContent;

    // Recorre todos los elementos de la lista de tareas y muestra/oculta según la opción seleccionada
    todos.forEach(function(todo) {
      const todoItem = document.getElementById(`todo-${todos.indexOf(todo)}`);
      switch (selectedOption) {
        case 'All':
          // Muestra todos los elementos
          todoItem.style.display = 'flex';
          break;
        case 'Active':
          // Muestra los elementos que no están marcados como completados
          todoItem.style.display = todo.completed ? 'none' : 'flex';
          break;
        case 'Complete':
          // Muestra los elementos que están marcados como completados
          todoItem.style.display = todo.completed ? 'flex' : 'none';
          break;
      }
    });
  });
});

// Función para guardar los todos en el local storage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Función para obtener los todos desde el local storage
function getTodos() {
  const todosJSON = localStorage.getItem('todos');
  return todosJSON ? JSON.parse(todosJSON) : [];
}

// Función para renderizar los todos en la lista
function renderTodos() {
  todoList.innerHTML = ''; // Limpiar la lista antes de renderizar los todos

  todos.forEach((todo, index) => {
    const newTodo = createTodoElement(todo.text, todo.completed);
    newTodo.id = `todo-${index}`;

    todoList.appendChild(newTodo);
  });
}

// Evento para manejar la pulsación de la tecla "Enter" en el campo de entrada
newTodoInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    addTodo();
  }
});

// Función para agregar una nueva tarea
function addTodo() {
  const text = newTodoInput.value.trim();
  const letterCount = text.length;

  if (letterCount < 3) {
      showAlertMinLetters();
      return;
  }

  if (letterCount > 70) {
      showAlertMaxLetters();
      newTodoInput.value = newTodoInput.value.slice(0, 70); // Limitar el contenido a 70 caracteres

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

  

// Función para eliminar una tarea
function deleteTodo(todoElement) {
  const index = Array.from(todoList.children).indexOf(todoElement);
  if (index !== -1) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
    updateItemCount();
  }
}

// Obtener los checkboxes
const checkboxes = document.querySelectorAll('.todo-item input[type="checkbox"]');

// Recuperar el estado guardado en el Local Storage
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

// Guardar el estado en el Local Storage
function saveCheckboxState() {
  const checkedValues = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
  const checkedValuesString = JSON.stringify(checkedValues);
  localStorage.setItem('checkedValues', checkedValuesString);
}

// Escuchar los cambios en los checkboxes y guardar el estado
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', saveCheckboxState);
});

// Restaurar el estado al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  todos = getTodos();
  renderTodos();
  updateItemCount();
  restoreCheckboxState();
});




