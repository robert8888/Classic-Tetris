import ViewElement from "./../ViewElement.js";
import MatrixGenerator from "../../../Hellpers/Matrix/MatrixGenerator.js";


export default class GameMap extends ViewElement{
    constructor() {
        super(...arguments);

        this._createGradients();

        this._size = {
            col : this._state.initGameState.map._size.col,
            row : this._state.initGameState.map._size.row
        }
    }

    render() {
        let gameMap = this._state.root.group().addClass('game-map');

        const col = this._size.col
        const row = this._size.row;

        this._matrix = (new MatrixGenerator()).getEmptyMatrix(row, col);


        let squareWidth = (this._state.height / 2) / col - 0.15;

        const borderCorrection = 1;
        for(let element of this.elements()){
            let rect  = gameMap.rect();
            rect.width(squareWidth - borderCorrection).height(squareWidth - borderCorrection);
            rect.dx(squareWidth * element.col).dy(squareWidth * element.row);
            this._matrix[element.row][element.col] = rect;
        }

        //shift to squares up
        gameMap.dy(-2 * squareWidth );
        //to right
        gameMap.dx((this._state.width - squareWidth * col) -2);

        this._state.squareSize = squareWidth;

    }

    update(data){
        const matrix = data.map._internalMatrix;
        const shapeMatrix = data.currentShape._internalMatrix;
        const shapePosition = data.shapePosition;
        const projectionPosition = data.shapeProjectionPosition;
        const shapeSize = data.currentShape._size;

        for(let element of this.elements()){
            element.rect.attr('class', ""); // clearing class name

            let block = matrix[element.row][element.col]; // game map matrix

            //projection
            if((element.col >= projectionPosition.col)
                && (element.col < projectionPosition.col + shapeSize)
                && (element.row >= projectionPosition.row)
                && (element.row < projectionPosition.row + shapeSize)) {
                let shapeProjectionBlock =  Object.assign({}, shapeMatrix[element.row - projectionPosition.row][element.col - projectionPosition.col])
                if(shapeProjectionBlock.type === 'shape'){
                    shapeProjectionBlock.names.push('projection');
                    block = shapeProjectionBlock;
                }
            }
            //

            //shape
            if((element.col >= shapePosition.col)
            && (element.col < shapePosition.col + shapeSize)
            && (element.row >= shapePosition.row)
            && (element.row < shapePosition.row + shapeSize)){
                let shapeBlock =  shapeMatrix[element.row - shapePosition.row][element.col - shapePosition.col]
                if(shapeBlock.type === 'shape' ){
                    block = shapeBlock;
                }
            }

            for(let name of block.names){
                element.rect.addClass(name);
            }
        }
    }

    *elements(){
        for (let r = 0; r < this._size.row; r++) {
            for (let c = 0; c < this._size.col; c++) {
                yield {
                    row: r,
                    col: c,
                    rect : this._matrix[r][c]
                }
            }
        }
    }

    _createGradients() {
        let draw = this._state.root;
        const shapes = ['z-shape', 's-shape', 'l-shape', 'j-shape', 'o-shape', 'i-shape','t-shape', 'empty','projection'];
        for(let shape of shapes){
            let gradient = draw.gradient('radial', function(add) {
                add.stop(0);
                add.stop(1);
            });
            gradient.attr('id', shape + '-gradient');
        }
    }
}