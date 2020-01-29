import MatrixGenerator from "../../Hellpers/Matrix/MatrixGenerator.js";

import EmptyBlock from "../Entries/Block/EmptyBlock.js";
import ShapeController from "../Controllers/ShapeController.js";

export default class ShapeUpdater {
    constructor() {
        this._shapeControler = new ShapeController();
    }


    rotateTo(shape, rotation){
        while(shape.rotation !== parseInt(rotation)){
            this.rotate(shape);
        }
    }

    backRotateTo(shape, rotation){
        while(shape.rotation !== parseInt(rotation)){
            this.backRotate(shape);
        }
    }

    //clock side direction
    rotate(shape){
        let tempMatrix = (new MatrixGenerator()).getEmptySquareMatrix(shape.size);
        for(let row = 0 ; row < shape.size; row++){
            for(let col = 0; col < shape.size; col++) {
                tempMatrix[row][shape.size -1 - col] = shape.getBlockFrom({row:col, col:row});
            }
        }
        shape._internalMatrix = tempMatrix;

        //move to right
        this._shiftRight(shape);

        this._shiftUp(shape);
        shape.rotation  = (shape.rotation + 1) % 4;
    }


    backRotate(shape){
        //flip
        let tempMatrix = (new MatrixGenerator()).getEmptySquareMatrix(shape.size);
        for(let row = 0 ; row < shape.size; row++){
            for(let col = 0; col < shape.size; col++) {
                tempMatrix[shape.size -1  - col][row] = shape.getBlockFrom({row:row, col:col});
            }
        }
        shape._internalMatrix = tempMatrix;

        //move to left
        this._shiftLeft(shape);
        this._shiftUp(shape);

        shape.rotation  = ((shape.rotation  === 0 ) ? 3 : shape.rotation -1 );
    }

    _shiftRight(shape) {
        while (this._shapeControler.hasEmptyCol(shape, shape.size - 1)) {
            //moving
            for (let row = 0; row < shape.size; row++) {
                for (let col = shape.size - 1; col > 0; col--) {
                    shape._internalMatrix[row][col] = shape._internalMatrix[row][col - 1];
                }
                //puting empty
                shape._internalMatrix[row][0] = new EmptyBlock();
            }
        }
    }


    _shiftLeft(shape) {
        while (this._shapeControler.hasEmptyCol(shape, 0)) {
            //moving
            for (let row = 0; row < shape.size; row++) {
                for (let col = 1; col < shape.size; col++) {
                    shape._internalMatrix[row][col - 1] = shape._internalMatrix[row][col];
                }
                //puting empty
                shape._internalMatrix[row][shape.size - 1] = new EmptyBlock();
            }
        }
    }

    _shiftUp(shape) {
        while (this._shapeControler.hasEmptyRow(shape, 0)) {
            for (let row = 1; row <= shape.size; row++) {
                for (let col = 0; col < shape.size; col++) {
                    if (row === shape.size) {
                        shape._internalMatrix[shape.size - 1][col] = new EmptyBlock();
                    } else {
                        shape._internalMatrix[row - 1][col] = shape._internalMatrix[row][col];
                    }
                }
                //puting empty

            }
        }
    }

}

