import { Game } from "./game.js";

class GlobalEvents {
    _handleBlur = () => this.onBlur();
    _handleFocus = () => this.onFocus();
    _handleResize = (e) => this.onResize(e);
    _handleClick = (e) => this.onClick(e);
    _handleDestroy = () => this.onDestroy();

    constructor() {
        window.addEventListener("blur", this._handleBlur);
        window.addEventListener("focus", this._handleFocus);
        window.addEventListener("resize", this._handleResize);
        window.addEventListener("click", this._handleClick);
        window.addEventListener("mouseup", this._handleClick);
        window.addEventListener("mousedown", this._handleClick);
    }

    onBlur() {}
    onFocus() {}
    onResize() {}
    onClick(e) {}
    onDestroy() {}

    destroy() {
        Game.destroy(this);
        window.removeEventListener("blur", this._handleBlur);
        window.removeEventListener("focus", this._handleFocus);
        window.removeEventListener("resize", this._handleResize);
        window.removeEventListener("click", this._handleClick);
        window.removeEventListener("mouseup", this._handleClick);
        window.removeEventListener("mousedown", this._handleClick);
        this.onDestroy();
    }
}

export { GlobalEvents };
