let color = document.getElementById('color');
let createBtn = document.getElementById('createBtn');
let list = document.getElementById('notes');
let zIndexCounter = 1;

// Load notes from localStorage on page load
window.onload = () => {
    let savedNotes = JSON.parse(localStorage.getItem('stickyNotes')) || [];
    savedNotes.forEach(note => {
        addNoteToDOM(note);
    });
};

// Save notes to localStorage
const saveNotes = () => {
    let allNotes = [];
    document.querySelectorAll('.note').forEach(note => {
        allNotes.push({
            content: note.querySelector('textarea').value,
            color: note.style.borderColor,
            position: {
                top: note.style.top,
                left: note.style.left
            },
            zIndex: note.style.zIndex
        });
    });
    localStorage.setItem('stickyNotes', JSON.stringify(allNotes));
};

// Add a new note to the DOM
const addNoteToDOM = (noteData = { content: '', color: '#e6b905', position: {}, zIndex: 1 }) => {
    const { content = '', color = '#e6b905', position = {}, zIndex = 1 } = noteData;
    const { top = '60px', left = '50px' } = position;

    let newNote = document.createElement('div');
    newNote.classList.add('note');
    newNote.innerHTML = `
    <span class="close">x</span>
    <textarea
    placeholder="Write here..."
    rows="12" cols="30">${content}</textarea>`;
    newNote.style.borderColor = color;
    newNote.style.top = top;
    newNote.style.left = left;
    newNote.style.zIndex = zIndex;
    list.appendChild(newNote);
    saveNotes();

    // Add click listener to bring the note to the top
    newNote.addEventListener('mousedown', () => {
        zIndexCounter++;
        newNote.style.zIndex = zIndexCounter;
        saveNotes();
    });
};

// Create a new note when the button is clicked
createBtn.onclick = () => {
    zIndexCounter++;
    addNoteToDOM({ color: color.value, zIndex: zIndexCounter });
};

// Remove a note
document.addEventListener('click', event => {
    if (event.target.classList.contains('close')) {
        event.target.parentNode.remove();
        saveNotes();
    }
});

// Drag and drop functionality
let cursor = { x: null, y: null };
let note = { dom: null, x: null, y: null };

document.addEventListener('mousedown', event => {
    if (event.target.classList.contains('note')) {
        cursor = {
            x: event.clientX,
            y: event.clientY
        };
        note = {
            dom: event.target,
            x: event.target.getBoundingClientRect().left,
            y: event.target.getBoundingClientRect().top
        };

        // Bring the clicked note to the top
        zIndexCounter++;
        note.dom.style.zIndex = zIndexCounter;
        saveNotes();
    }
});

document.addEventListener('mousemove', event => {
    if (note.dom == null) return;
    let currentCursor = {
        x: event.clientX,
        y: event.clientY
    };
    let distance = {
        x: currentCursor.x - cursor.x,
        y: currentCursor.y - cursor.y
    };
    note.dom.style.left = note.x + distance.x + 'px';
    note.dom.style.top = note.y + distance.y + 'px';
    note.dom.style.cursor = 'grab';
});

document.addEventListener('mouseup', () => {
    if (note.dom == null) return;
    note.dom.style.cursor = 'auto';
    note.dom = null;
    saveNotes();
});
