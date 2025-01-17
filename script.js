const themeSwitch = document.getElementById('themeSwitch');
const newNoteBtn = document.getElementById('newNoteBtn');
const notesContainer = document.getElementById('notesContainer');

let noteId = 0;

// Theme toggle
themeSwitch.addEventListener('change', () => {
  document.body.dataset.theme = themeSwitch.checked ? 'dark' : 'light';
});

// Create new note section
newNoteBtn.addEventListener('click', () => {
  const noteSection = document.createElement('div');
  noteSection.classList.add('note-section');
  noteSection.id = `note-${noteId++}`;

  const addItemBtn = document.createElement('button');
  addItemBtn.textContent = 'Add Item';
  addItemBtn.classList.add('btn');
  addItemBtn.addEventListener('click', () => addItem(noteSection));

  noteSection.appendChild(addItemBtn);
  notesContainer.appendChild(noteSection);
});

// Add item to the note section
function addItem(section) {
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
  confirmBtn.addEventListener('click', () => handleItemAddition(select.value, section));

  section.appendChild(select);
  section.appendChild(confirmBtn);
}

function handleItemAddition(type, section) {
  if (type === 'text') {
    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Enter text here...';
    section.appendChild(textarea);
  } else if (type === 'image') {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', (e) => {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(e.target.files[0]);
      img.style.maxWidth = '100%';
      section.appendChild(img);
    });
    section.appendChild(input);
  } else if (type === 'file') {
    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', (e) => {
      const fileName = e.target.files[0].name;
      const fileButton = document.createElement('button');
      fileButton.textContent = fileName;
      fileButton.classList.add('btn');
      section.appendChild(fileButton);
    });
    section.appendChild(input);
  } else if (type === 'link') {
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
      section.appendChild(link);
    });
    section.appendChild(linkInput);
    section.appendChild(linkBtn);
  }
}
