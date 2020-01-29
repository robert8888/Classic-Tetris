import EmptyBlock from "../Entries/Block/EmptyBlock.js";
import ShapeBlock from "../Entries/Block/ShapeBlock.js";

export default class MapController {
    constructor(map) {
        this._map = map;
    }

    findCompleted(){
        let completed = [];
        for(let row = 0; row < this._map.rowCount; row++){
            let isCompleted = true;
            for(let col = 0; col < this._map.colCount; col++){
                if(this._map.getBlockFrom({row: row, col:col}) instanceof EmptyBlock){
                    isCompleted = false;
                }
            }
            if(isCompleted){
                completed.push(row);
            }
        }
        completed.hasResults = ( completed.length > 0);
        return completed;
    }

    isFinished(){
        //checking second row that have shapeBlock
        let result = false;
        const row = 2;
        for(let col = 0; col < this._map.colCount; col++){
            if(this._map.getBlockFrom({row : row, col : col}) instanceof ShapeBlock){
                result = true;
            }
        }
        return result;
    }

    isCordInMap(cord){
        return !((cord.row >= this._map.rowCount)
              || (cord.col >= this._map.colCount)
              || (cord.col < 0));

    }

    isCordInMapReason(cord){
        if(cord.row >= this._map.rowCount){
            return {
                value : false,
                reason : 'row out of bottom'
            }
        }
        if(cord.col >= this._map.colCount){
            return {
                value: false,
                reason: 'col ouf of right border'
            }
        }
        if(cord.col < 0){
            return {
                value: false,
                reason: 'col out of left border'
            }
        }

        return {
            value: true,
            reason: null
        }
    }

    isFieldEmpty(cord){
        if(this.isCordInMap(cord)){
            return this._map.getBlockFrom(cord) instanceof EmptyBlock;
        }
        else return false;
    }

    isAccessible(cord){
        if(this.isCordInMap(cord)){
            return this._map.getBlockFrom(cord) instanceof EmptyBlock;
        }
        else return false;
    }

    isAccessibleReason(cord){
        if(this.isCordInMapReason(cord).value){
            if(this._map.getBlockFrom(cord) instanceof EmptyBlock){
                return  {
                    value : true,
                    reason: null
                }
            } else {
                return {
                    value : false,
                    reason : 'not empty block'
                }
            }
        }
        else return {
            reason: this.isCordInMapReason(cord).reason,
            value : false
        }
    }
}