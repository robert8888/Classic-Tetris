import Shape from "../Shape.js";

import shapeConfiguration from "../../../Configuration/ShapeConfiguration.js";

export default class TShape extends Shape{
    constructor() {
        super(shapeConfiguration.T);
    }

}