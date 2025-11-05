let editingItem = null; // <-- хранит ссылку на редактируемый <li>

function toggleCheck(el) {
  el.classList.toggle('checked');
  el.closest('.todo-item').classList.toggle('completed');
  checkEmpty();
}

function deleteNote(el) {
  el.closest('.todo-item').remove();
  checkEmpty();
}

function editNote(el) {
  const li = el.closest('.todo-item');
  const textEl = li.querySelector('.todo-text');

  editingItem = li; // <-- сохраняем ссылку
  const noteInput = document.getElementById('noteInput');
  noteInput.value = textEl.textContent;

  openModal();
}

function openModal() {
  document.getElementById('modal').classList.add('active');
  document.getElementById('noteInput').focus();
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
  document.getElementById('noteInput').value = '';
  editingItem = null;  // <-- сброс
}

function addNote() {
  const input = document.getElementById('noteInput');
  const text = input.value.trim();
  if (!text) return;

  // --- редактирование ---
  if (editingItem) {
    editingItem.querySelector('.todo-text').textContent = text;
    editingItem = null;
    closeModal();
    return;
  }

  // --- добавление ---
  const todoList = document.getElementById('todoList');
  const li = document.createElement('li');
  li.className = 'todo-item';

  li.innerHTML = `
    <div class="checkbox" onclick="toggleCheck(this)"></div>
    <span class="todo-text">${text}</span>
    <div class="todo-actions">
      <button class="icon-btn" onclick="editNote(this)">✏️</button>
      <button class="icon-btn" onclick="deleteNote(this)">🗑️</button>
    </div>
  `;

  todoList.appendChild(li);

  closeModal();
  checkEmpty();
}

function checkEmpty() {
  const todoList = document.getElementById('todoList');
  const emptyState = document.getElementById('emptyState');

  if (todoList.children.length === 0) {
    emptyState.style.display = 'block';
    todoList.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    todoList.style.display = 'block';
  }
}

// Поиск
document.getElementById('searchInput').addEventListener('input', function(e) {
  const search = e.target.value.toLowerCase();
  const items = document.querySelectorAll('.todo-item');
  
  items.forEach(item => {
    const text = item.querySelector('.todo-text').textContent.toLowerCase();
    item.style.display = text.includes(search) ? 'flex' : 'none';
  });
});

// Enter для добавления
document.getElementById('noteInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    addNote();
  }
});

// Закрытие модалки при клике вокруг
document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeModal();
  }
});
