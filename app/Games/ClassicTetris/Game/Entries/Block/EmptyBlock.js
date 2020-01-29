import Block from "./Block.js";

export default class EmptyBlock extends Block{
    constructor() {
        super(...arguments);
        this.names.push('empty');
        this.type = 'empty';
    }
}