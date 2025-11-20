let editingItem = null;


   window.onload = function () {
    loadNotes();
    checkEmpty();
};


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

function loadNotes() {
    const saved = JSON.parse(localStorage.getItem('notes') || "[]");
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    saved.forEach(note => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        if (note.completed) li.classList.add('completed');

        li.innerHTML = `
            <div class="checkbox ${note.completed ? 'checked' : ''}" onclick="toggleCheck(this)"></div>
            <span class="todo-text">${note.text}</span>
            <div class="todo-actions">
                <button class="icon-btn" onclick="editNote(this)"><img src="image5.png"/></button>
                <button class="icon-btn" onclick="deleteNote(this)"><img src="image6.png"/></button>
            </div>
        `;
        todoList.appendChild(li);
    });
}


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
    document.getElementById('suggestionsContainer').innerHTML = '';
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
    if (e.key === 'Enter') addNote();
});


document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});


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
const noteInputField = document.getElementById("noteInput");
const suggestionsBox = document.getElementById("suggestionsContainer");

const popularWords = ["work","home","school","office","book","task","note","idea","plan","event"];

async function loadSuggestions(query = "") {
    suggestionsBox.innerHTML = '';

    let suggestions = [];

    if (!query) {
        popularWords.slice(0,5).forEach(word => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = word;
            div.style.padding = "8px 12px";
            div.style.cursor = "pointer";
            div.style.borderBottom = "1px solid #3a3a3a";

            div.addEventListener("mouseenter", () => div.style.background = "#3a3a3a");
            div.addEventListener("mouseleave", () => div.style.background = "#2a2a2a");

            div.onclick = () => {
                noteInputField.value = word;
                addNote();
                suggestionsBox.innerHTML = '';
            };

            suggestionsBox.appendChild(div);
        });
        return;
    }

    try {
        const response = await fetch(`https://api.datamuse.com/sug?s=${query}`);
        suggestions = await response.json();

        suggestions.slice(0,5).forEach(s => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = s.word;
            div.style.padding = "8px 12px";
            div.style.cursor = "pointer";
            div.style.borderBottom = "1px solid #3a3a3a";

            div.addEventListener("mouseenter", () => div.style.background = "#3a3a3a");
            div.addEventListener("mouseleave", () => div.style.background = "#2a2a2a");

            div.onclick = () => {
                noteInputField.value = s.word;
                addNote();
                suggestionsBox.innerHTML = '';
            };

            suggestionsBox.appendChild(div);
        });

    } catch(err) {
        console.error(err);
    }
}


noteInputField.addEventListener("input", () => {
    loadSuggestions(noteInputField.value.trim());
});

noteInputField.addEventListener("mouseenter", () => {
    loadSuggestions(noteInputField.value.trim());
});
