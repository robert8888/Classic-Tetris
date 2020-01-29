import MatrixGenerator from "../../../Hellpers/Matrix/MatrixGenerator.js";
import EmptyBlock from "../Block/EmptyBlock.js";

export default class GameMap {
    constructor(size) {

        this._size = size;

        this.build(size);
    }

    set size(size){
        this._size = size;
    }

    get size(){
        return this._size;
    }

    get rowCount(){
        return this._internalMatrix.length;
    }

    get colCount(){
        return this._internalMatrix[0].length;
    }

    //to do - napraw to
    build(size){
        size = size || this._size;
        this._internalMatrix = (new MatrixGenerator()).getEmptyMatrix(size.row, size.col)
            .map((row) => row = row.map((col) => col = new EmptyBlock()));
    }

    setBlockOn(block, cord){
        this._internalMatrix[cord.row][cord.col] = block;
    }

    getBlockFrom(cord){
        return this._internalMatrix[cord.row][cord.col];
    }
}