import { templateLevelsList, templateLegend } from './templates.js';
import { parseLevelsStringFromUnreal, generateUnrealLevels } from './unreal.js';

class App {
    definitionPart = '';
    levels = [];
    currentIndex = 0;
    prevEditorValue = '';

    constructor({editor, levelsFromUE = ''}) {
        if (!editor) throw new Error('An editor instance must be provided.')

        editor.onUpdate = () => { this.updateUnrealCode(); };
        this.editor = editor;

        this.initListeners();
        this.generateLegend();
        
        if (levelsFromUE) {
            const unrealCode = levelsFromUE.trim();
            document.querySelector('.levels-from-unreal').value = unrealCode;
            this.parseLevelsFromUnreal(unrealCode);
        }

        this.editor.updatePreview();
    }
    
    initListeners() {
        document.querySelector('.levels-list').addEventListener('click', (event) => {
            if (event.target.classList.contains('level-list-item')) {
                const index = Array.from(event.currentTarget.children).indexOf(event.target);
                this.clickOnListItem(index);
            }
        });
        
        document.querySelector('.mirror').addEventListener('click', () => {
            this.editor.mirrorCode();
        });
        
        document.querySelector('.import-unreal-code').addEventListener('click', () => {
            this.parseLevelsFromUnreal(document.querySelector('.levels-from-unreal').value);
        });
        
        document.querySelector('.legend-toggle').addEventListener('click', () => {
            const el = document.querySelector('.legend-wrapper');
            el.style.display = (el.style.display === 'block') ? 'none' : 'block';
        });
    }

    generateLevelsList() {
        document.querySelector('.levels-list').innerHTML = templateLevelsList(this.levels);
        this.highlightListItem();
    }

    async clickOnListItem(levelIndex) {
        this.currentIndex = levelIndex;
        
        const levelCode = this.levels[this.currentIndex];
        this.editor.setCode(levelCode);

        this.highlightListItem();

        await this.editor.updatePreview({ enforcePreviewScroll: true, enforceEditorScroll: true });
        this.editor.addNewLines();
    }

    generateLegend() {
        document.querySelector('.legend').innerHTML = templateLegend(this.levels);
    }

    highlightListItem() {
        for (const el of Array.from(document.querySelectorAll('.level-list-item'))) {
            el.classList.remove('active');
        }

        document.querySelectorAll('.level-list-item')[this.currentIndex].classList.add('active');
    }

    parseLevelsFromUnreal(levelsFromUE) {
        if (!levelsFromUE) return;

        try {
            const {definitionPart, levels} = parseLevelsStringFromUnreal(levelsFromUE);
            this.definitionPart = definitionPart;
            this.levels = levels;

            this.generateLevelsList();
            this.clickOnListItem(0);

        } catch (err) {
            alert(err);
        }
    }

    updateUnrealCode() {
        this.levels[this.currentIndex] = this.editor.getCode();
        document.querySelector('.levels-from-unreal').value = generateUnrealLevels({
            definitionPart: this.definitionPart,
            levels: this.levels
        });
    }
}

export default App;