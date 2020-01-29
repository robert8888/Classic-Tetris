import EmptyBlock from "../Entries/Block/EmptyBlock.js";
import ShapeBlock from "../Entries/Block/ShapeBlock.js";

export default class MapUpdater {
    constructor(map) {
        this._map = map
    }

    add(shape, position) {
        for (let row = 0; row < shape.size; row++) {
            this.addRow(shape, position, row)
        }
    }


    addRow(shape, position, row){
        for (let col = 0; col < shape.size; col++) {
            let block = shape.getBlockFrom({row: row, col: col});
            if(block instanceof ShapeBlock){
                this._map.setBlockOn(block , {row : position.row + row, col : position.col + col});
            }
        }
    }

    remove(rows){
        rows.forEach((row)=>{
            //remove
            for(let col = 0 ; col < this._map.size.col; col++){
                this._map.setBlockOn(null, {row: row, col: col})
            }
            //shift down
            for(let r = row; r > 1 ; r--) {
                for (let col = 0; col < this._map.size.col; col++) {
                    let blockUpper = this._map.getBlockFrom({row: r - 1, col: col})
                    this._map.setBlockOn(blockUpper, {row: r, col: col});
                }
            }

            //fill first row empty block
            row = 0;
            for(let col = 0 ; col < this._map.size.col; col++){
                this._map.setBlockOn(new EmptyBlock(), {row: row, col: col});
            }

        })

    }
}