import { levelsFromUE } from './levels.js';
import { templateLevelsList, templateLegend } from './templates.js';
import { parseLevelsStringFromUnreal, generateUnrealLevels } from './unreal.js';
import Editor from './editor.js';

const editor = new Editor({
    editorEl: document.querySelector('textarea.editor'),
    previewEl: document.querySelector('.preview'),
    onUpdate: updateUnrealCode
});

const app = {
    definitionPart: '',
    levels: [],
    currentIndex: 0,
    prevEditorValue: ''
};

// Prevents losing data on tab close/reload
window.onbeforeunload = function (event) {
  event.preventDefault();
  event.returnValue = true; // Included for legacy support, e.g. Chrome/Edge < 119 
};

// Listeners    
document.querySelector('.mirror').addEventListener('click', () => {
    editor.mirrorCode();
});

document.querySelector('.legend-toggle').addEventListener('click', () => {
    const el = document.querySelector('.legend-wrapper');
    el.style.display = (el.style.display === 'block')
        ? 'none'
        : 'block';
});

document.querySelector('.levels-list').addEventListener('click', (event) => {
    if (event.target.classList.contains('level-list-item')) {
        const index = Array.from(event.currentTarget.children).indexOf(event.target);
        clickOnListItem(index);
    }
});

// App init

init();

function init(levelIndex) {
    if (levelsFromUE) {
        document.querySelector('.levels-from-unreal').value = levelsFromUE.trim();
    }
    generateLegend();
    parseLevelsFromUnreal();
    editor.updatePreview();
}

async function clickOnListItem(levelIndex) {
    app.currentIndex = levelIndex;
    
    // Update the editor with the new level code
    const levelCode = app.levels[app.currentIndex];

    // Update the UI
    editor.setCode(levelCode);

    highlightListItem();
    await editor.updatePreview({
        enforcePreviewScroll: true,
        enforceEditorScroll: true
    });
    editor.addNewLines();
}

function parseLevelsFromUnreal() {
    const text = document.querySelector('.levels-from-unreal').value;
    const {definitionPart, levels} = parseLevelsStringFromUnreal(text);

    app.definitionPart = definitionPart;
    app.levels = levels;

    generateLevelsList();
    clickOnListItem(0);
}

function generateLevelsList() {
    document.querySelector('.levels-list').innerHTML = templateLevelsList(app.levels);
    highlightListItem();
}

function generateLegend() {
    document.querySelector('.legend').innerHTML = templateLegend(app.levels);
}

function highlightListItem() {
    for (const el of Array.from(document.querySelectorAll('.level-list-item'))) {
        el.classList.remove('active');
    }

    document.querySelectorAll('.level-list-item')[app.currentIndex].classList.add('active');
}

function updateUnrealCode() {
    app.levels[app.currentIndex] = editor.getCode();
    document.querySelector('.levels-from-unreal').value = generateUnrealLevels(app);
}
