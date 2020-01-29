import ViewElement from "./../../ViewElement.js";

export default class OverLayer extends ViewElement{
    constructor() {
        super(...arguments);
    }

    render(screenName) {

        let background = document.createElement('div');
        background.classList.add('layer-over-background');

        this.content = document.createElement('div');
        this.content.classList.add('layer-over');
        this.content.classList.add('hidden');
        if (screenName)  this.content.classList.add(screenName);

        this.content.append(background);

        let wrapper = document.createElement('div');
        wrapper.classList.add('layer-over-wrapper');
        wrapper.classList.add(screenName);
        this.content.append(wrapper);


        this._state.container.appendChild(this.content);
        this.container = this.content;
        this.content = wrapper;
    }

    update(data) {
    }

    show(){
        this.container.classList.remove('hidden');
    }

    hide(){
        this.container.classList.add('hidden');
    }
}