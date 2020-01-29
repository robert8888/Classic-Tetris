import Shape from "../Shape.js";

import shapeConfiguration from "../../../Configuration/ShapeConfiguration.js";

export default class LShape extends Shape{
    constructor() {
        super(shapeConfiguration.L);
    }

}