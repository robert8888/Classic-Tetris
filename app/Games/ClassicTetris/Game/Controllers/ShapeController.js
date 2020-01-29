import ShapeBlock from "../Entries/Block/ShapeBlock.js";

export default class ShapeController {
    constructor() {
    }

    hasEmptyRow(shape, row){
        if(row >= shape.size)
            return false;

        for(let block of shape.getBlockByRow(row)){
            if(block instanceof ShapeBlock){
                return  false;

            }
        }
        return true;
    }

    hasEmptyCol(shape, col){
        if(col >= shape.size){
            return false;
        }

        for(let block of shape.getBlockByCol(col)){
            if(block instanceof ShapeBlock){
                return false;
            }
        }
        return true;
    }

    isBlockEmpty(shape, cord){
        if(shape.getBlockFrom(cord) instanceof ShapeBlock){
            return false;
        }
        return true;
    }
    //counting from down
    fieldHeight(shape, col){
        for(let r = shape.size - 1; r >= 0 ; r--){
            if(shape.getBlockFrom({row: r, col:col}) instanceof ShapeBlock){
                return r;
            }
        }
        return -1;
    }
    //counting from left, from 0
    emptyWidth(shape, row){
        for(let c = 0; c < shape.size; c++){
            if(shape.getBlockFrom({row: row, col:c}) instanceof ShapeBlock){
                return c  ;
            }
        }
        return 0;
    }

    //counting form right
    filedWidth(shape, row){
        for(let c = shape.size - 1; c >= 0 ; c--){
            if(shape.getBlockFrom({row: row, col:c}) instanceof ShapeBlock){
                return c ;
            }
        }
        return -1;
    }

    getOrientation(shape){
        let emptyRows = 0;
        let emptyCols = 0;
        for(let index = 0; index < shape.size; index++){
            if(this.hasEmptyCol(shape, index)){
                emptyCols++;
            }
            if(this.hasEmptyRow(shape, index)){
                emptyRows++;
            }
        }
        if(emptyCols < emptyRows){
            return 'horizontal'
        }
        return  'vertical';
    }

}