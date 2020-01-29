import Shape from "../Shape.js";

import shapeConfiguration from "../../../Configuration/ShapeConfiguration.js";

export default class IShape extends Shape{
    constructor() {
        super(shapeConfiguration.I);
    }

}