
import ViewElement from "./../ViewElement.js";

export default class MobileControls extends ViewElement{
    constructor() {
        super(...arguments);
    }

    render(){
        let content  = document.createElement('div')
            content.classList.add('game-controls');
        let html = `<button class='controls-button-left'>LEFT</button>
                    <button class='controls-button-rotate'>ROTATE</button>
                    <button class='controls-button-back-rotate'>BACK ROTATE</button>
                    <button class='controls-button-right'>RIGHT</button>
                    <button class='controls-button-soft-drop'>SOFT DROP</button>
                    <button class='controls-button-hard-drop'>HARD DROP</button>`;
        content.innerHTML = html;
        content.getElementsByClassName('controls-button-left')[0]
            .addEventListener('touchstart', ()=>{this.fire('action', 'moveLeft')});
        content.getElementsByClassName('controls-button-right')[0]
            .addEventListener('touchstart', ()=>{this.fire('action', 'moveRight')});
        content.getElementsByClassName('controls-button-rotate')[0]
            .addEventListener('touchstart', ()=>{this.fire('action', 'rotate')});
        content.getElementsByClassName('controls-button-back-rotate')[0]
            .addEventListener('touchstart', ()=>{this.fire('action', 'backRotate')});
        content.getElementsByClassName('controls-button-hard-drop')[0]
            .addEventListener('touchstart', ()=>{this.fire('action', 'hardDrop')});

        content.getElementsByClassName('controls-button-soft-drop')[0]
            .addEventListener('touchstart', ()=>{this.fire('action', 'softDrop')});
        content.getElementsByClassName('controls-button-soft-drop')[0]
            .addEventListener('touchend', ()=>{this.fire('cancel', 'softDrop')});
        this.content = content;

    }

    update(){
        this._state.container.append(this.content);
    }

}