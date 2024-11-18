(function (Drupal, once) {
  Drupal.behaviors.todoList = {
    attach: function (context, settings) {
      const inputField = context.querySelector('#new-todo-item');
      const submitButton = context.querySelector('#add-todo-button');
      const todoListContainer = context.querySelector('#todo-list');

      if (!inputField || !submitButton || !todoListContainer) {
        return;
      }

      loadTodoList();

      once('todoSubmit', submitButton).forEach(function (button) {
        button.addEventListener('click', function () {
          const todoValue = inputField.value.trim();
          if (todoValue) {
            addTodoItem({ text: todoValue, completed: false });
            inputField.value = '';
          }
        });
      });

      function loadTodoList() {
        todoListContainer.innerHTML = '';
        const todoList = JSON.parse(localStorage.getItem('todoList')) || [];
        todoList.forEach((item, index) => {
          renderTodoItem(item, index);
        });
      }

      function addTodoItem(item) {
        const todoList = JSON.parse(localStorage.getItem('todoList')) || [];
        todoList.push(item);
        localStorage.setItem('todoList', JSON.stringify(todoList));
        renderTodoItem(item, todoList.length - 1);
      }

      function renderTodoItem(item, index) {
        const listItem = document.createElement('li');
        listItem.classList.add('todo-item');
        listItem.setAttribute('data-index', index);

        const itemStyle = item.completed ? 'text-decoration: line-through;' : '';

        listItem.innerHTML = `
          <input type="checkbox" class="todo-checkbox" ${item.completed ? 'checked' : ''} data-index="${index}">
          <span style="${itemStyle}">${item.text}</span>
          <button class="delete-button" data-index="${index}">Delete</button>
        `;

        todoListContainer.appendChild(listItem);

        listItem.querySelector('.todo-checkbox').addEventListener('change', function (e) {
          toggleTodoItem(index, e.target.checked);
        });

        listItem.querySelector('.delete-button').addEventListener('click', function () {
          deleteTodoItem(index);
        });
      }

      function toggleTodoItem(index, completed) {
        let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
        todoList[index].completed = completed;
        localStorage.setItem('todoList', JSON.stringify(todoList));
        loadTodoList();
      }

      function deleteTodoItem(index) {
        let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
        todoList.splice(index, 1);
        localStorage.setItem('todoList', JSON.stringify(todoList));
        loadTodoList();
      }
    }
  };
})(Drupal, once);
