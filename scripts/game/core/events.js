class GlobalEvents {
    constructor() {
        this._handleBlur = this._handleBlur.bind(this);
        this._handleFocus = this._handleFocus.bind(this);
        this._handleResize = this._handleResize.bind(this);
        window.addEventListener("blur", this._handleBlur);
        window.addEventListener("focus", this._handleFocus);
        window.addEventListener("resize", this._handleResize);
    }

    _handleBlur() {
        this.onBlur();
    }

    _handleFocus() {
        this.onFocus();
    }

    _handleResize() {
        this.onResize();
    }

    start() {}
    onBlur() {}
    onFocus() {}
    onResize() {}
    onDestroy() {}

    destroy() {
        window.removeEventListener("blur", this._handleBlur);
        window.removeEventListener("focus", this._handleFocus);
        this.onDestroy();
    }
}

export { GlobalEvents };
