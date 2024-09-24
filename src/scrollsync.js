import { throttle, debounce } from './helpers.js';

class ScrollSync {
    constructor({previewEl, editorEl, scrollRatio = 1}) {
        this.previewEl = previewEl;
        this.editorEl = editorEl;
        this.scrollRatio = scrollRatio;

        this.initListeners();
    }

    #scrollSource = {editor: false, preview: false}
    #disabled = false

    stopSyncFrom = debounce((key) => {
        this.#scrollSource[key] = false;
    }, 300);
        
    startEditorScroll = 0;
    startPreviewScroll = 0;

    initListeners() {
        this.editorEl.addEventListener('scroll', throttle(this.editor2PreviewSync.bind(this), 20));
        this.previewEl.addEventListener('scroll', throttle(this.preview2EditorSync.bind(this), 20));
    }

    enable() {
        this.#disabled = false;
    }

    disable() {
        this.#disabled = true;
    }

    editor2PreviewSync() {
        if (this.#disabled) return;
        if (this.#scrollSource.preview) return;

        this.#scrollSource.editor = true;
        this.previewEl.scrollTop = this.startPreviewScroll - ((this.startEditorScroll - this.editorEl.scrollTop) * this.scrollRatio);
        this.stopSyncFrom('editor');
    }
    
    preview2EditorSync() {
        if (this.#disabled) return;
        if (this.#scrollSource.editor) return;
        
        this.#scrollSource.preview = true;
        this.editorEl.scrollTop = this.startEditorScroll - ((this.startPreviewScroll - this.previewEl.scrollTop) * 1 / this.scrollRatio);
        this.stopSyncFrom('preview');
    }
}

export default ScrollSync;