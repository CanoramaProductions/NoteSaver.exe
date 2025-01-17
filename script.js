const themeSwitch = document.getElementById('themeSwitch');
const newNoteBtn = document.getElementById('newNoteBtn');
const notesContainer = document.getElementById('notesContainer');
let notes = JSON.parse(localStorage.getItem('notes')) || [];

// Initialize theme
document.body.dataset.theme = localStorage.getItem('theme') || 'light';
themeSwitch.checked = document.body.dataset.theme === 'dark';

// Theme toggle
themeSwitch.addEventListener('change', () => {
  const theme = themeSwitch.checked ? 'dark' : 'light';
  document.body.dataset.theme = theme;
  localStorage.setItem('theme', theme);
});

// Load notes on page load
window.onload = () => {
  notes.forEach(note => renderNoteSection(note));
};

// Create new note section
newNoteBtn.addEventListener('click', () => {
  const newNote = { id: Date.now(), items: [] };
  notes.push(newNote);
  saveNotes();
  renderNoteSection(newNote);
});

// Render note section
function renderNoteSection(note) {
  const noteSection = document.createElement('div');
  noteSection.classList.add('note-section');
  noteSection.dataset.id = note.id;

  // Actions: Add Item, Delete Section
  const actions = document.createElement('div');
  actions.classList.add('actions');

  const addItemBtn = document.createElement('button');
  addItemBtn.textContent = 'Add Item';
  addItemBtn.classList.add('btn');
  addItemBtn.addEventListener('click', () => addItem(note, noteSection));

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete Section';
  deleteBtn.classList.add('btn', 'btn-delete');
  deleteBtn.addEventListener('click', () => deleteNoteSection(note, noteSection));

  actions.appendChild(addItemBtn);
  actions.appendChild(deleteBtn);
  noteSection.appendChild(actions);

  // Items container
  const itemsContainer = document.createElement('div');
  itemsContainer.classList.add('items-container');
  noteSection.appendChild(itemsContainer);

  // Render existing items
  note.items.forEach(item => renderNoteItem(item, itemsContainer, note));

  notesContainer.appendChild(noteSection);
}

// Add item to the note section
function addItem(note, noteSection) {
  const select = document.createElement('select');
  select.innerHTML = `
    <option value="text">Text</option>
    <option value="image">Image</option>
    <option value="file">File</option>
    <option value="link">Link</option>
  `;

  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = 'Add';
  confirmBtn.classList.add('btn');
  confirmBtn.addEventListener('click', () => {
    const itemType = select.value;
    const newItem = { id: Date.now(), type: itemType, content: '' };
    note.items.push(newItem);
    saveNotes();

    const itemsContainer = noteSection.querySelector('.items-container');
    renderNoteItem(newItem, itemsContainer, note);
    select.remove();
    confirmBtn.remove();
  });

  noteSection.appendChild(select);
  noteSection.appendChild(confirmBtn);
}

// Render note item
function renderNoteItem(item, container, note) {
  const noteItem = document.createElement('div');
  noteItem.classList.add('note-item');

  if (item.type === 'text') {
    const textarea = document.createElement('textarea');
    textarea.value = item.content;
    textarea.style.resize = 'none';
    textarea.style.width = '100%';
    textarea.addEventListener('input', (e) => {
      item.content = textarea.value;
      saveNotes();

      // Adjust the height dynamically
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });

    // Initial height adjustment for saved data
    setTimeout(() => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });

    noteItem.appendChild(textarea);
  } else if (item.type === 'image') {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', (e) => {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(e.target.files[0]);
      img.style.maxWidth = '100%';
      noteItem.appendChild(img);
      item.content = img.src;
      saveNotes();
    });
    noteItem.appendChild(input);
  } else if (item.type === 'file') {
    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', (e) => {
      const fileName = e.target.files[0].name;
      const fileButton = document.createElement('button');
      fileButton.textContent = fileName;
      fileButton.classList.add('btn');
      noteItem.appendChild(fileButton);
      item.content = fileName;
      saveNotes();
    });
    noteItem.appendChild(input);
  } else if (item.type === 'link') {
    const linkInput = document.createElement('input');
    linkInput.type = 'text';
    linkInput.placeholder = 'Enter URL';
    const linkBtn = document.createElement('button');
    linkBtn.textContent = 'Add Link';
    linkBtn.classList.add('btn');
    linkBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.href = linkInput.value;
      link.target = '_blank';
      link.textContent = linkInput.value || 'Link';
      noteItem.appendChild(link);
      item.content = linkInput.value;
      saveNotes();
    });
    noteItem.appendChild(linkInput);
    noteItem.appendChild(linkBtn);
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('btn', 'btn-delete');
  deleteBtn.addEventListener('click', () => {
    note.items = note.items.filter(i => i.id !== item.id);
    saveNotes();
    noteItem.remove();
  });

  noteItem.appendChild(deleteBtn);
  container.appendChild(noteItem);
}

// Delete note section
function deleteNoteSection(note, noteSection) {
  notes = notes.filter(n => n.id !== note.id);
  saveNotes();
  noteSection.remove();
}

// Save notes to localStorage
function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}
