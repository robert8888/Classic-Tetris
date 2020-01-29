import ShapeBlock from "../Block/ShapeBlock.js";
import EmptyBlock from "../Block/EmptyBlock.js";
import MatrixGenerator from "../../../Hellpers/Matrix/MatrixGenerator.js";

export default class Shape {
    constructor(shapeConfig, color) {

        this._size = shapeConfig.shape.length;
        this._color = shapeConfig.color;
        this._name = shapeConfig.name;
        this._rotation = 0;

        this._internalMatrix = (new MatrixGenerator()).getEmptySquareMatrix(this._size);
        for(let row = 0 ; row < this._size; row++){
            for(let col = 0; col < this.size; col++){
                if(shapeConfig.shape[row][col]){
                    this._internalMatrix[row][col] = new ShapeBlock(this.name, this.color);
                }
                else {
                    this._internalMatrix[row][col] = new EmptyBlock();
                }
            }
        }

        
    }



    get size(){
        return this._size;
    }

    get name(){
        return this._name;
    }

    get color(){
       return this._color;
    }

    get rotation(){
        return this._rotation;
    }

    set rotation(r){
        this._rotation = r;
    }

    *getBlockByRow(row){
        for(let col = 0 ; col < this.size; col++){
            yield this.getBlockFrom({col: col, row:row});
        }
    }

    *getBlockByCol(col){
        for(let row = 0; row < this.size; row++) {
            yield this.getBlockFrom({col: col, row: row});
        }
    }

    *getAllBlocks(){
        for(let row = 0; row < this.size; row++){
            for(let col = 0; col < this.size; col++){
                yield {
                    row: row,
                    col: col,
                    block: this.getBlockFrom({col: col, row: row})
                }
            }
        }
    }

    getBlockFrom(cord){
        return this._internalMatrix[cord.row][cord.col];
    }
}