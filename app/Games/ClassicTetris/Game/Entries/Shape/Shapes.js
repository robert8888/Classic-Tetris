import IShape from "./Shapes/I-Shape.js";
import JShape from "./Shapes/J-Shape.js";
import LShape from "./Shapes/L-Shape.js";
import OShape from "./Shapes/O-Shape.js";
import TShape from "./Shapes/T-Shape.js";
import ZShape from "./Shapes/Z-Shape.js";
import SShape from "./Shapes/S-Shape.js";

export default class Shapes extends Array{
    constructor() {
        super();
        this.push(IShape);
        this.push(JShape);
        this.push(LShape);
        this.push(OShape);
        this.push(SShape);
        this.push(TShape);
        this.push(ZShape);
    }
}