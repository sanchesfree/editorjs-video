/**
 * Class for working with UI:
 *  - rendering base structure
 *  - show/hide preview
 */
export default class Ui {
    /**
     * @param {object} ui - image tool Ui module
     * @param {object} ui.api - Editor.js API
     * @param {ImageConfig} ui.config - user config
     * @param {Function} ui.onSelectVideo - callback for clicks on select video from list
     * @param {boolean} ui.readOnly - read-only mode flag
     */
    constructor({api, config, onSelectVideo, readOnly}) {
        this.api = api;
        this.config = config;
        
        this.onSelectVideo = onSelectVideo;
        this.readOnly = readOnly;
        this.nodes = {
            wrapper: make('div', [this.CSS.baseClass, this.CSS.wrapper]),
            imageContainer: make('div', [this.CSS.imageContainer]),
            fileButton: this.createVideosListButton(),
            imageEl: undefined,
            caption: make('div', [this.CSS.input, this.CSS.caption], {
                contentEditable: !this.readOnly,
            }),
        };

        /**
         * Create base structure
         *  <wrapper>
         *    <image-container>
         *    </image-container>
         *    <caption />
         *    <select-file-button />
         *  </wrapper>
         */
        this.nodes.caption.dataset.placeholder = this.config.captionPlaceholder;
        this.nodes.wrapper.appendChild(this.nodes.fileButton);
        this.nodes.wrapper.appendChild(this.nodes.imageContainer);
        this.nodes.wrapper.appendChild(this.nodes.caption);
    }

    /**
     * CSS classes
     *
     * @returns {object}
     */
    get CSS() {
        return {
            baseClass: this.api.styles.block,
            loading: this.api.styles.loader,
            input: this.api.styles.input,
            button: this.api.styles.button,

            /**
             * Tool's classes
             */
            wrapper: 'videos-from-list-tool',
            videoSelectList: 'videos-from-list-tool__select-video',
            imageContainer: 'videos-from-list-tool__image',
            videosList: 'videos-from-list-tool__list',
            imageEl: 'videos-from-list-tool__image-picture',
            caption: 'videos-from-list-tool__caption',
        };
    };

    /**
     * Ui statuses:
     * - empty
     * - uploading
     * - filled
     *
     * @returns {{EMPTY: string, UPLOADING: string, FILLED: string}}
     */
    static get status() {
        return {
            EMPTY: 'empty',
            UPLOADING: 'loading',
            FILLED: 'filled',
        };
    }

    /**
     * Renders tool UI
     *
     * @param {VideoFromListToolData} toolData - saved tool data
     * @returns {Element}
     */
    render(toolData) {
        if (!toolData.file || Object.keys(toolData.file).length === 0) {
            this.toggleStatus(Ui.status.EMPTY);
        } else {
            this.toggleStatus(Ui.status.UPLOADING);
            if(typeof toolData.file.videoId !== 'undefined') {
                $(this.nodes.fileButton).find('select').val(toolData.file.videoId);
            }
        }

        return this.nodes.wrapper;
    }

    /**
     * Creates upload-file button
     *
     * @returns {Element}
     */
    createVideosListButton() {
        const button = make('div', [this.CSS.button]);

        let optionsHtml = '<option value="0">' + this.config.selectVideoPlaceholder + '</option>';
        for (let i in this.config.videoList) {
            let video = this.config.videoList[i];
            optionsHtml += '<option data-preview="' + video.preview + '" value="' + video.id + '">' + video.name + '</option>';
        }

        button.innerHTML = '<select class="' + this.CSS.videoSelectList + '">' + optionsHtml + '</select>';

        button.addEventListener('change', (a,b,c) => {
            this.onSelectVideo({
                videoId: $(this.nodes.fileButton).find('select').val(),
                url: $(this.nodes.fileButton).find('select option:selected').data('preview')
            });
        });

        return button;
    }

    /**
     * Shows an image
     *
     * @param {string} url - image source
     * @returns {void}
     */
    fillImage(url) {
        /**
         * Check for a source extension to compose element correctly: video tag for mp4, img — for others
         */
        const tag = /\.mp4$/.test(url) ? 'VIDEO' : 'IMG';

        const attributes = {
            src: url,
        };

        /**
         * We use eventName variable because IMG and VIDEO tags have different event to be called on source load
         * - IMG: load
         * - VIDEO: loadeddata
         *
         * @type {string}
         */
        let eventName = 'load';
        
        /**
         * Compose tag with defined attributes
         *
         * @type {Element}
         */
        this.nodes.imageEl = make(tag, this.CSS.imageEl, attributes);

        /**
         * Add load event listener
         */
        this.nodes.imageEl.addEventListener(eventName, () => {
            this.toggleStatus(Ui.status.FILLED);
        });

        this.nodes.imageContainer.innerHTML = '';
        this.nodes.imageContainer.appendChild(this.nodes.imageEl);
    }

    /**
     * Shows caption input
     *
     * @param {string} text - caption text
     * @returns {void}
     */
    fillCaption(text) {
        if (this.nodes.caption) {
            this.nodes.caption.innerHTML = text;
        }
    }

    /**
     * Changes UI status
     *
     * @param {string} status - see {@link Ui.status} constants
     * @returns {void}
     */
    toggleStatus(status) {
        for (const statusType in Ui.status) {
            if (Object.prototype.hasOwnProperty.call(Ui.status, statusType)) {
                this.nodes.wrapper.classList.toggle(`${this.CSS.wrapper}--${Ui.status[statusType]}`, status === Ui.status[statusType]);
            }
        }
    }
}

/**
 * Helper for making Elements with attributes
 *
 * @param  {string} tagName           - new Element tag name
 * @param  {Array|string} classNames  - list or name of CSS class
 * @param  {object} attributes        - any attributes
 * @returns {Element}
 */
export const make = function make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
        el.classList.add(...classNames);
    } else if (classNames) {
        el.classList.add(classNames);
    }

    for (const attrName in attributes) {
        el[attrName] = attributes[attrName];
    }

    return el;
};
