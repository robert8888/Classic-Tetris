import ShapeController from "./ShapeController.js";
import MapController from "./MapController.js";

import EmptyBlock from "../Entries/Block/EmptyBlock.js";
import ShapeBlock from "../Entries/Block/ShapeBlock.js";

export default class MoveController {
    constructor(gameState) {
        this._gameState = gameState;
        this._shapeController = new ShapeController();
        this._mapController = new MapController(gameState.map);
    }

    //return false if is on bottom
    canDown(){
        const shape =  this._gameState.currentShape;
        const shapePosition = this._gameState.shapePosition;

        return this.canMoveDown(shape, shapePosition);
    }

    canMoveDown(shape, position){
        const shapePosition = position;

        for(let col = 0; col < shape.size  ; col++){
            let colHeight = this._shapeController.fieldHeight(shape, col);
            if(colHeight === -1){ continue; }
            let nextField = shapePosition.row + colHeight + 1;

            let cord = {
                row: nextField,
                col: shapePosition.col + col,
            };

            if(!this._mapController.isAccessible(cord)){
                return false;
            }
        }
        return  true;
    }

    canRightBy(position, columns){
        let answer = false;
        for(let n=0; n < columns; n++){
            answer = this.canRight({row: position.row, col:position.col + n});
        }
        return answer;
    }

    //right bound
    canRight(position){
        if(this._gameState.hardDrop){
            return  false;
        }
        const shape =  this._gameState.currentShape;
        const shapePosition = position || this._gameState.shapePosition;

        for(let row = 0 ; row < shape.size; row++){
            let rowWidth = this._shapeController.filedWidth(shape, row);
            if(rowWidth === -1){continue;}
            let nextField = shapePosition.col + rowWidth + 1;
            let cord = {
                col: nextField,
                row: shapePosition.row + row,
            }

            if(!this._mapController.isAccessible(cord)){
                return false;
            }
        }
        return true;
    }

    canLeftBy(position, columns){
        let answer = false;
        for(let n=0; n < columns; n++){
            answer = this.canLeft({row: position.row, col:position.col - n});
        }
        return answer;
    }

    //left bound
    canLeft(position){
        if(this._gameState.hardDrop){
            return  false;
        }
        const shape =  this._gameState.currentShape;
        const shapePosition = position || this._gameState.shapePosition;

        for(let row = 0 ; row < shape.size; row++){
            let rowWidth = this._shapeController.emptyWidth(shape, row);

            let nextField = shapePosition.col + rowWidth -1;
            let cord = {
                col: nextField,
                row: shapePosition.row + row
            };

            if(!this._mapController.isAccessible(cord)){
                return false;
            }
        }

        return true;
    }

    canRotate(sPosition) {
        if (this._gameState.hardDrop) {
            return false;
        }
        let shape = this._gameState.currentShape;
        let shapePosition = sPosition || this._gameState.shapePosition;

        let result = true;
        let reason = null;
        for(let el of shape.getAllBlocks())
        {
            if(this._shapeController.isBlockEmpty(shape, {col:el.col, row: el.row}) ){
                continue;
            } else {
                let cord = {
                    //    row: shapePosition.
                    row: el.col,
                    col: shape.size - el.row,
                }

                cord.row += shapePosition.row;
                cord.col += shapePosition.col;
                cord.col--;

                let {value: isAccessible, reason:r} = this._mapController.isAccessibleReason(cord);
                if(!isAccessible){
                    result = false;
                    reason = r;
                }
            }
        }

        return  {
            value: result,
            reason : reason
        };
    }

    canBackRotate(){
        if(this._gameState.hardDrop){
            return  false;
        }
        let shape = this._gameState.currentShape;
        let shapePosition = this._gameState.shapePosition;

        let result = true;
        let reason = null;
        for(let el of shape.getAllBlocks())
        {
            if(this._shapeController.isBlockEmpty(shape, {col:el.col, row: el.row}) ){
                continue;
            } else {
                let cord = {
                    //    row: shapePosition.
                    row: shape.size - el.col,
                    col: el.row,
                }

                cord.row += shapePosition.row;
                cord.col += shapePosition.col;

                let {value: isAccessible, reason:r} = this._mapController.isAccessibleReason(cord);
                if(!isAccessible){
                    result = false;
                    reason = r;
                }
            }
        }

        return  {
            value: result,
            reason : reason
        };
    }


    //counting hao many empty block is under shape in current rotation and position
    moveResult(){
        //throw new Error('to do --- good night');
        const map = this._gameState.map;
        const shape = this._gameState.currentShape;
        const shapePosition = {... this._gameState.shapePosition}; //copy of it
        //drop it
        while(this.canMoveDown(shape, shapePosition)) {shapePosition.row++};


        let emptyBlocks = 0;

        for(let col = shapePosition.col ; col < shapePosition.col + shape.size; col++){//for each of shape column in map
            let shapeCol = col -  shapePosition.col;
            if(this._shapeController.hasEmptyCol(shape, shapeCol)){//skip empty col of shape
                continue;
            }
            let flagFirstShapeBlock = false;

            for(let row = shapePosition.row ; row < map.rowCount ; row++) {
                let emptyShapeBlock;
                let emptyMapBlock;

                if((col >= shapePosition.col )
                 &&(col < shapePosition.col + shape.size)
                 &&(row >= shapePosition.row)
                 &&(row < shapePosition.row + shape.size)){
                    let block = shape.getBlockFrom({row: row - shapePosition.row ,col: col - shapePosition.col});
                    if(!flagFirstShapeBlock && block instanceof ShapeBlock){
                        flagFirstShapeBlock = true;
                        emptyShapeBlock = false;
                    } else if (flagFirstShapeBlock){
                        emptyShapeBlock = block instanceof EmptyBlock;
                    } else {
                        emptyShapeBlock = false;
                    }
                } else {
                    emptyShapeBlock = true;
                }

                emptyMapBlock = map.getBlockFrom({row: row, col: col}) instanceof EmptyBlock;
                if(!emptyMapBlock){
                    continue;
                }
                if((emptyMapBlock && emptyShapeBlock)){
                    emptyBlocks++
                }

            }
        }

        return emptyBlocks;

    }

}