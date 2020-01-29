import ViewElement from "./../../ViewElement.js";

export default class ShapeList extends ViewElement{
    constructor() {
        super(...arguments);
        this.config = {
            squareSizeRatio : 0.67 ,
            shapePadding : 5,
        }

    }

    setup(){
        this.width = this._state.width - this._state.initGameState.map._size.col * this._state.squareSize -3;
        this.height = this._state.height - this._state.squareSize * 4;
        this.squerSize = this._state.squareSize * this.config.squareSizeRatio;
        this.xShift = this._getXShift();
    }

    render() {
        this.setup();

        let container = this._state.root.group().addClass('shape-list').translate(0, this._state.squareSize * 4);

       // container.line(this.x,0, this._getXShift(), this.height).stroke('black')

        this._container = container.group().addClass('shape-list-container');
        this.update(this._state.initGameState);
    }


    _generateShape(svgGroup, shape){
         let size = this.squerSize;

        let shapeGroup = svgGroup.group().addClass(shape._name);
        for(let r = 0 ; r < shape._size; r++){//row
            for(let c = 0 ; c < shape._size; c++){//col
                let block = shape._internalMatrix[r][c]
                if(block.type === "shape"){
                    let rect = shapeGroup.rect(size, size).dx(size * c).dy(size * r);
                    for(let name of block.names){
                        rect.addClass(name);
                    }
                }

            }
        }
        return shapeGroup;
    }

    update(data) {
        if(this._compare(data.shapeQueue, this._lastUpdate) || !data.queueVisible){
            return;
        }

        this._container.clear();
        let shapes = data.shapeQueue;
        let stackHeight = 0 ;
        let shapesSvg = [];
        shapes.forEach((shape, index) => {
            let shapeGroup = this._generateShape(this._container, shape);
            shapesSvg.push(shapeGroup);
            let {height} = shapeGroup.bbox();
            shapeGroup.translate(this._getXShift(), stackHeight +15);
            stackHeight += height + this.config.shapePadding;//shape._size * this._state.squareSize * this.config.squareSizeRatio + this.config.shapePadding;
        });
        let h = this._container.parent().bbox().height
        let padding = (this.height - this._container.parent().bbox().height ) / shapes.length -3  ;
        shapesSvg.forEach( (shapeSvg , i) => shapeSvg.translate(0, padding * i ));
        this._lastUpdate = shapes;
    }



    _getXShift(){
        const colWidth = this._state.width - this._state.initGameState.map._size.col * this._state.squareSize -3;
        const size =  this._state.squareSize * this.config.squareSizeRatio;
        return (colWidth - 4 * size) / 2;
    }

    _compare(shapeQueue, shapeQueue2){
        return (shapeQueue && shapeQueue2) ?
         !shapeQueue.some((shape, index) =>
            (shapeQueue2[index]) ?
                shapeQueue2[index]._name !== shape._name
                : true)
            : false;
    }
    /*
    _compareOld(shapeQueue, shapeQueue2){
        if(!shapeQueue || !shapeQueue2){
            return false;
        }
        if(shapeQueue.length !== shapeQueue2.length){
            return false;
        }
        for(let i = 0 ; i < shapeQueue.length; i++){
            if(shapeQueue[i]._name !== shapeQueue2[i]._name){
                return false;
            }
        }
        return true;
    }*/
}