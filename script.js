let editingItem = null;

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

  editingItem = li;
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
  editingItem = null;
}

function addNote() {
  const input = document.getElementById('noteInput');
  const text = input.value.trim();
  if (!text) return;

  if (editingItem) {
    editingItem.querySelector('.todo-text').textContent = text;
    editingItem = null;
    closeModal();
    checkEmpty();
    return;
  }

  const todoList = document.getElementById('todoList');
  const li = document.createElement('li');
  li.className = 'todo-item';

  li.innerHTML = `
    <div class="checkbox" onclick="toggleCheck(this)"></div>
    <span class="todo-text">${text}</span>
    <div class="todo-actions">
      <button class="icon-btn" onclick="editNote(this)"><img src="image5.png" alt="image5"/></button>
      <button class="icon-btn" onclick="deleteNote(this)"><img src="image6.png" alt="image6"/></button>
    </div>
  `;

  todoList.appendChild(li);

  closeModal();
  checkEmpty();
}

function checkEmpty() {
  const todoList = document.getElementById('todoList');
  const emptyState = document.getElementById('emptyState');

  const visibleItems = Array.from(todoList.children)
    .filter(item => item.style.display !== 'none');

  if (visibleItems.length === 0) {
    emptyState.style.display = 'block';
    todoList.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    todoList.style.display = 'block';
  }
}

document.getElementById('searchInput').addEventListener('input', function(e) {
  const search = e.target.value.toLowerCase();
  const items = document.querySelectorAll('.todo-item');
  
  items.forEach(item => {
    const text = item.querySelector('.todo-text').textContent.toLowerCase();
    item.style.display = text.includes(search) ? 'flex' : 'none';
  });

  checkEmpty();
});

document.getElementById('noteInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    addNote();
  }
});

document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeModal();
  }
});

checkEmpty();


const themeToggle = document.getElementById('themeToggle');


if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
}


themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');

 
  if (document.body.classList.contains('light')) {
    localStorage.setItem('theme', 'light');
  } else {
    localStorage.setItem('theme', 'dark');
  }
});
