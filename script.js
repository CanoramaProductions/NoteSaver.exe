// Render note item
function renderNoteItem(item, container, note) {
  const noteItem = document.createElement('div');
  noteItem.classList.add('note-item');

  // Expand/Collapse Button
  const expandBtn = document.createElement('button');
  expandBtn.classList.add('expand-btn');
  expandBtn.addEventListener('click', () => {
    menu.classList.toggle('active');
    expandBtn.classList.toggle('expanded');
  });

  // Collapsible Menu
  const menu = document.createElement('div');
  menu.classList.add('collapsible');

  if (item.type === 'text') {
    const textarea = document.createElement('textarea');
    textarea.value = item.content;
    textarea.style.resize = 'none';
    textarea.style.width = '100%';
    textarea.addEventListener('input', () => {
      item.content = textarea.value;
      saveNotes();

      // Adjust the height dynamically
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });

    setTimeout(() => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });

    menu.appendChild(textarea);
  } else if (item.type === 'image') {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', (e) => {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(e.target.files[0]);
      img.style.maxWidth = '100%';
      menu.appendChild(img);
      item.content = img.src;
      saveNotes();
    });

    menu.appendChild(input);

    if (item.content) {
      const img = document.createElement('img');
      img.src = item.content;
      img.style.maxWidth = '100%';
      menu.appendChild(img);
    }
  } else if (item.type === 'file') {
    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', (e) => {
      const fileName = e.target.files[0].name;
      const fileButton = document.createElement('button');
      fileButton.textContent = fileName;
      fileButton.classList.add('btn');
      menu.appendChild(fileButton);
      item.content = fileName;
      saveNotes();
    });

    menu.appendChild(input);

    if (item.content) {
      const fileButton = document.createElement('button');
      fileButton.textContent = item.content;
      fileButton.classList.add('btn');
      menu.appendChild(fileButton);
    }
  } else if (item.type === 'link') {
    const linkInput = document.createElement('input');
    linkInput.type = 'text';
    linkInput.placeholder = 'Enter URL';
    const linkBtn = document.createElement('button');
    linkBtn.textContent = 'Save Link';
    linkBtn.classList.add('btn');
    linkBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      const url = linkInput.value.startsWith('http')
        ? linkInput.value
        : `https://${linkInput.value}`;
      link.href = url;
      link.target = '_blank';
      link.textContent = linkInput.value || 'Link';
      menu.appendChild(link);
      item.content = url;
      saveNotes();
    });

    menu.appendChild(linkInput);
    menu.appendChild(linkBtn);

    if (item.content) {
      const link = document.createElement('a');
      link.href = item.content;
      link.target = '_blank';
      link.textContent = item.content;
      menu.appendChild(link);
    }
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('btn', 'btn-delete');
  deleteBtn.addEventListener('click', () => {
    note.items = note.items.filter(i => i.id !== item.id);
    saveNotes();
    noteItem.remove();
  });

  noteItem.appendChild(expandBtn);
  noteItem.appendChild(deleteBtn);
  noteItem.appendChild(menu);
  container.appendChild(noteItem);
}
