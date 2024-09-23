import { throttle, debounce } from './helpers.js';

class ScrollSync {
    constructor({previewEl, editorEl, scrollRatio = 1}) {
        this.previewEl = previewEl;
        this.editorEl = editorEl;
        this.scrollRatio = scrollRatio;
    }

    #scrollSource = {editor: false, preview: false}

    disabled = false

    stopSyncFrom = debounce((key) => {
        this.#scrollSource[key] = false;
    }, 300);
        
    startEditorScroll = 0;
    startPreviewScroll = 0;

    editor2PreviewSync() {
        return throttle(() => {
            if (this.disabled) return;
            if (this.#scrollSource.preview) return;
            console.log('editor scroll')
            this.#scrollSource.editor = true;
            this.previewEl.scrollTop = this.startPreviewScroll - ((this.startEditorScroll - this.editorEl.scrollTop) * this.scrollRatio);
            this.stopSyncFrom('editor');
        }, 20);
    }
    
    preview2EditorSync() {
        return throttle(() => {
            if (this.disabled) return;
            if (this.#scrollSource.editor) return;
            console.log('preview scroll')
            this.#scrollSource.preview = true;
            this.editorEl.scrollTop = this.startEditorScroll - ((this.startPreviewScroll - this.previewEl.scrollTop) * 1 / this.scrollRatio);
            this.stopSyncFrom('preview');
        }, 20);
    }
}

export default ScrollSync;