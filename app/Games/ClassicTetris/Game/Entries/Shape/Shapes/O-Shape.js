import Shape from "../Shape.js";

import shapeConfiguration from "../../../Configuration/ShapeConfiguration.js";

export default class OShape extends Shape{
    constructor() {
        super(shapeConfiguration.O);
    }

}