import EmptyBlock from "./EmptyBlock.js";
import Block from "./Block.js";

export default class ShapeBlock extends Block {
    constructor(shapeName, color) {
        super(...arguments);
        this.names.push('Shape');
        this.names.push(shapeName);
        this.type = 'shape';
        this._color = color;
    }

    get color(){
        return this.color;
    }
}
