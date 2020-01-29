
import Shapes from "../Shapes.js";
import Generator from "./Generator.js";

export default class ShapeGenerator extends Generator{
    constructor() {
        super(...arguments)
        this._shapes = new Shapes();
    }

    getRandom(){
        let index = this._getRandomNumber(this._shapes.length);
        return new this._shapes[index]();
    }
}