import { levelsFromUE } from './levels.js';
import { templateLevel, templateLevelsList, templateLegend } from './templates.js';
import { parseLevelsStringFromUnreal, generateUnrealLevels } from './unreal.js';
import { mirrorMap } from './legend.js';
import ScrollSync from './scrollsync.js';

const editorEl = document.querySelector('textarea.editor');
const previewEl = document.querySelector('.preview');

const app = {
    definitionPart: '',
    levels: [],
    currentIndex: 0,
    prevEditorValue: ''
};

const scrollSync = new ScrollSync({
    previewEl: previewEl,
    editorEl: editorEl,
    scrollRatio:  1.35
});

// Prevents losing data on tab close/reload
window.onbeforeunload = function (event) {
  event.preventDefault();
  event.returnValue = true; // Included for legacy support, e.g. Chrome/Edge < 119 
};

// Listeners

editorEl.addEventListener('input', async () => {
    const addedCodeBelow = editorEl.value.startsWith(app.prevEditorValue);
    await updatePreview({enforcePreviewScroll: addedCodeBelow});
    app.prevEditorValue = editorEl.value;
});
editorEl.addEventListener('scroll', scrollSync.editor2PreviewSync());
editorEl.addEventListener('blur', () => { updateUnrealCode(); });

previewEl.addEventListener('scroll', scrollSync.preview2EditorSync());

document.querySelector('.mirror').addEventListener('click', () => {
    const convertedLines = makeMirror(levelCode2Array(editorEl.value));
    editorEl.value = linesToString(convertedLines);
    updatePreview({enforceEditorScroll: true});
    updateUnrealCode();
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
    updatePreview();
}

function updatePreview({enforcePreviewScroll = false, enforceEditorScroll = false} = {}) {
    const lines = levelCode2Array(editorEl.value);
    const scrollTop = previewEl.scrollTop;
    
    previewEl.innerHTML = templateLevel(lines);
    document.querySelector('.row-count').textContent = lines.length;
    document.querySelector('.glass-count').textContent = getGlassCount(lines);
    
    scrollSync.disabled = true;

    return new Promise((resolve) => {
        setTimeout(() => {

            previewEl.scrollTop = (scrollTop === 0 || enforcePreviewScroll) ? 100000000 : scrollTop;
            if (enforceEditorScroll) {
                editorEl.scrollTop = 100000000;
            }

            scrollSync.startEditorScroll =  editorEl.scrollTop;
            scrollSync.startPreviewScroll =  previewEl.scrollTop;
            
            scrollSync.disabled = false;
            resolve();
        });
    });
}

function levelCode2Array(str) {
    return str
        .split('|')
        .map(v => v.trim())
        .filter((v) => v) // compact
        .map(v => v.split(''));
}

function linesToString(lines) {
    return lines.reduce((str, line, lineIndex) => {
        str += line.join('') + '|';
        if (lineIndex !== lines.length - 1) {
            str += '\n';
        }
        return str;
    }, '');
}

function getGlassCount(lines) {
    let glassCount = 0;

    for (const line of lines) {
        for (const symbol of line) {
            if (symbol === 'g' || symbol === 'G') {
                glassCount++;
            }
        }
    }

    return glassCount;
}

async function clickOnListItem(levelIndex) {
    app.currentIndex = levelIndex;
    
    // Update the editor with the new level code
    const levelCode = app.levels[app.currentIndex];

    // Update the UI
    editorEl.value = levelCode;
    highlightListItem();
    await updatePreview({
        enforcePreviewScroll: true,
        enforceEditorScroll: true
    });
    addNewLines();
}

function addNewLines() {
    editorEl.value = linesToString(levelCode2Array(editorEl.value));
}

function makeMirror(lines) {
    return lines.map((line) => {
        return line.reverse().map((char, charIndex) => {
            return mirrorMap[char] || char;
        });    
    });
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
    app.levels[app.currentIndex] = editorEl.value;
    document.querySelector('.levels-from-unreal').value = generateUnrealLevels(app);
}
