let editingItem = null;

// Загружаем задачи при старте
window.onload = function () {
  loadNotes();
  checkEmpty();
};

// Сохранение всех задач
function saveNotes() {
  const items = document.querySelectorAll('.todo-item');

  const data = [];

  items.forEach(item => {
    data.push({
      text: item.querySelector('.todo-text').textContent,
      completed: item.classList.contains('completed')
    });
  });

  localStorage.setItem('notes', JSON.stringify(data));
}

// Загрузка задач
function loadNotes() {
  const saved = JSON.parse(localStorage.getItem('notes') || "[]");
  const todoList = document.getElementById('todoList');

  saved.forEach(note => {
    const li = document.createElement('li');
    li.className = 'todo-item';

    if (note.completed) {
      li.classList.add('completed');
    }

    li.innerHTML = `
      <div class="checkbox ${note.completed ? 'checked' : ''}" onclick="toggleCheck(this)"></div>
      <span class="todo-text">${note.text}</span>
      <div class="todo-actions">
        <button class="icon-btn" onclick="editNote(this)"><img src="image5.png" alt="edit"/></button>
        <button class="icon-btn" onclick="deleteNote(this)"><img src="image6.png" alt="delete"/></button>
      </div>
    `;

    todoList.appendChild(li);
  });
}

// ---------- Другие функции (твои) ----------

function toggleCheck(el) {
  el.classList.toggle('checked');
  el.closest('.todo-item').classList.toggle('completed');
  saveNotes();
  checkEmpty();
}

function deleteNote(el) {
  el.closest('.todo-item').remove();
  saveNotes();
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
    saveNotes();
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
      <button class="icon-btn" onclick="editNote(this)"><img src="image5.png"/></button>
      <button class="icon-btn" onclick="deleteNote(this)"><img src="image6.png"/></button>
    </div>
  `;

  todoList.appendChild(li);

  closeModal();
  saveNotes();
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

// ------------------------------------
//        ТЕМА СОХРАНЕНИЕ
// ------------------------------------

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
  themeIcon.src = 'image9.png';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');

  if (document.body.classList.contains('light')) {
    localStorage.setItem('theme', 'light');
    themeIcon.src = 'image9.png';
  } else {
    localStorage.setItem('theme', 'dark');
    themeIcon.src = 'image8.png';
  }
});



// async function loadSuggestions() {
//     let input = document.getElementById("taskInput").value;
    
//     if (input.length < 2) {
//         document.getElementById("suggestions").innerHTML = "";
//         return;
//     }

//     // Запрос к Datamuse API
//     const response = await fetch(`https://api.datamuse.com/sug?s=${input}`);
//     const suggestions = await response.json();

//     let list = "";
//     suggestions.slice(0, 5).forEach(s => {
//         list += <li onclick="useSuggestion('${s.word}')">${s.word}</li>;
//     });

//     document.getElementById("suggestions").innerHTML = list;
// }

// function useSuggestion(word) {
//     document.getElementById("taskInput").value = word;
//     document.getElementById("suggestions").innerHTML = "";
// }

