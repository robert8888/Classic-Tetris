import Shape from "../Shape.js";

import shapeConfiguration from "../../../Configuration/ShapeConfiguration.js";

export default class ZShape extends Shape{
    constructor() {
        super(shapeConfiguration.Z);
    }

}