import { mirrorMap } from './legend.js';
import { templateLevel } from './templates.js';

import ScrollSync from './scrollsync.js';


class Editor {
    #prevEditorValue = '';

    constructor({ editorEl, previewEl, scrollRatio = 1.35, onUpdate = () => {} }) {
        this.editorEl = editorEl;
        this.previewEl = previewEl;
        this.onUpdate = onUpdate;

        this.scrollSync = new ScrollSync({ previewEl, editorEl, scrollRatio });
        this.initListeners();
    }

    setCode(code) {
        this.editorEl.value = code;
    }

    getCode() {
        return this.editorEl.value;
    }

    mirrorCode() {
        this.setCode(this.#linesToString(this.#makeMirror(this.#levelCode2Array(this.getCode()))));
        this.updatePreview({enforceEditorScroll: true});
    }

    initListeners() {
        this.editorEl.addEventListener('input', async () => {
            const addedCodeBelow = this.getCode().startsWith(this.#prevEditorValue);
            await this.updatePreview({enforcePreviewScroll: addedCodeBelow});
            this.#prevEditorValue = this.getCode();
        });
    }

    updatePreview({enforcePreviewScroll = false, enforceEditorScroll = false} = {}) {
        const scrollTop = this.previewEl.scrollTop;
        
        const lines = this.#levelCode2Array(this.getCode());
        this.previewEl.innerHTML = templateLevel(lines);
        
        document.querySelector('.row-count').textContent = lines.length;
        document.querySelector('.glass-count').textContent = this.#getGlassCount(lines);
        
        this.scrollSync.disabled = true;
    
        return new Promise((resolve) => {
            setTimeout(() => {
    
                this.previewEl.scrollTop = (scrollTop === 0 || enforcePreviewScroll) ? 100000000 : scrollTop;
                if (enforceEditorScroll) {
                    this.editorEl.scrollTop = 100000000;
                }
    
                this.scrollSync.startEditorScroll =  this.editorEl.scrollTop;
                this.scrollSync.startPreviewScroll =  this.previewEl.scrollTop;
                this.scrollSync.disabled = false;

                this.onUpdate();
                resolve();
            });
        });
    }

    addNewLines() {
        this.setCode(this.#linesToString(this.#levelCode2Array(this.getCode())));
    }

    #levelCode2Array(str) {
        return str
            .split('|')
            .map(v => v.trim())
            .filter((v) => v) // compact
            .map(v => v.split(''));
    }
    
    #linesToString(lines) {
        return lines.reduce((str, line, lineIndex) => {
            str += line.join('') + '|';
            if (lineIndex !== lines.length - 1) {
                str += '\n';
            }
            return str;
        }, '');
    }
    
    #getGlassCount(lines) {
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

    #makeMirror(lines) {
        return lines.map((line) => {
            return line.reverse().map((char, charIndex) => {
                return mirrorMap[char] || char;
            });    
        });
    }
}

export default Editor;