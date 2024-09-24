import { levelsFromUE } from './levels.js';

import Editor from './editor.js';
import App from './app.js';

// Prevents losing data on tab close/reload
window.onbeforeunload = function (event) {
    event.preventDefault();
     // Included for legacy support, e.g. Chrome/Edge < 119 
    event.returnValue = true;
  };

const editor = new Editor({
    editorEl: document.querySelector('textarea.editor'),
    previewEl: document.querySelector('.preview')
});

const app = new App({ editor, levelsFromUE });