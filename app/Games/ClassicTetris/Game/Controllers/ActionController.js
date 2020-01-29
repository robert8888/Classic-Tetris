import MapUpdater from "../Updaters/MapUpdater.js";
import MoveController from "./MoveController.js";

import MapController from "./MapController.js";
import EventObject from "../../Hellpers/Events/EventObject.js";
import ShapeUpdater from "../Updaters/ShapeUpdater.js";
import ShapeController from "./ShapeController.js";

export default class ActionController extends EventObject{
    constructor(state) {
        super();

        this._gameState = state;

        this._setup(state);
    }

    set state(s){
        this._gameState = s;
        this._setup(s);
    }

    _setup(state){
        this._mapUpdater = new MapUpdater(state.map);
        this._mapController = new MapController(state.map);
        this._moveController = new MoveController(state);
        this._shapeUpdater = new ShapeUpdater();
        this._shapeControler = new ShapeController();
    }

    has(actionName){
        return ["moveLeft",
            "moveRight",
            "softDrop",
            "hardDrop",
            "rotate" ,
            "backRotate",
            "autoRotate",
            "pause"].includes(actionName);
    }

    do(actionName){
        if(this._gameState.gameOver){ return; }

        switch (actionName) {
            case "moveDown" : {
                return this._moveDown();
            }
            case "moveLeft": {
                return this._moveLeft();
            }
            case "moveRight": {
                return this._moveRight();
            }
            case "rotate" : {
                return this._rotate();
            }
            case "backRotate" : {
                return this._backRotate();
            }
            case "softDrop" : {
                return this._startSoftDrop();
            }
            case "hardDrop" : {
                return this._startHardDrop();
            }

            case 'autoRotate' : {
                return this._autoRotate();
            }

            case "pause" : {
                this.fire('pause');
                return true;
            }
        }
    }

    cancel(actionName){
        switch (actionName) {
            case "softDrop": return this._stopSoftDrop();
        }
    }



    _moveDown(){
        if(this._moveController.canDown()){
            this._gameState.shapePosition.row++; // = position;
            this._gameState.step++;
        }else{

            this._gameState.hardDrop = false;

            this._mapUpdater.add(this._gameState.currentShape, this._gameState.shapePosition);
            this.fire('newShape');

            let completed = this._mapController.findCompleted();
            if(completed.hasResults){
                this._mapUpdater.remove(completed);
                this.fire('completed', completed.length);
                this._gameState.lastSuccess = true;
            } else {
                this._gameState.lastSuccess = false;
                this._gameState.comboFactor = 0;
            }

        }

        this._updateProjection();

            //check that game is finished
        if(this._mapController.isFinished()){
            this.fire('gameOver');
        }

        this.fire('stateUpdate');
    }


    _moveLeft(){
        if(this._moveController.canLeft()){
            this._gameState.shapePosition.col--;
            this._updateProjection();
            return true;
        }
        return false;
    }

    _moveRight(){
        if(this._moveController.canRight()){
            this._gameState.shapePosition.col++;
            this._updateProjection();
            return true;
        }
        return false;
    }

    _rotate(){
        if(this._moveController.canRotate().value){
            this._shapeUpdater.rotate((this._gameState.currentShape));
            this._updateProjection();
            return true;
        } else if(this._moveController.canRotate().reason === "col out of left border"){ // left wall kick
            let minusCol = Math.abs(this._gameState.shapePosition.col);// out of left bound negative col value
            //will be possible rotation after moving position to right by minusCol
            if(this._moveController.canRotate( {col: 0 , row: this._gameState.shapePosition.row}).value
                &&  this._moveController.canRightBy({...this._gameState.shapePosition}, minusCol)) {
                for(let i = 0 ; i < minusCol ; i++){
                    this._moveRight();
                }
                this._rotate();
                this._updateProjection();
                return true;
            }
        }
        return  false;
    }

    _backRotate(){
        if(this._moveController.canBackRotate().value){
            this._shapeUpdater.backRotate((this._gameState.currentShape));
            this._updateProjection();
            return true;
        } else if(this._moveController.canBackRotate().reason === "col ouf of right border"){
            let minusCol = this._gameState.shapePosition.col + this._gameState.currentShape.size - this._gameState.map.colCount;
            if(this._moveController.canBackRotate({
                row: this._gameState.shapePosition.row,
                col: this._gameState.map.colCount - this._gameState.currentShape.size
            }) && this._moveController.canLeftBy({...this._gameState.shapePosition}, minusCol)){
                for(let i = 0 ; i < minusCol; i++){
                    this._moveLeft();
                }
                this._backRotate();
                this._updateProjection();
                return true;
            }
            console.log('to do right wall kick')
        }
        return  false;

    }

    _startSoftDrop(){
        if(!this._gameState.softDrop){
            this._gameState.softDrop = true;
        }
        return true;
    }

    _stopSoftDrop(){
        if(this._gameState.softDrop){
            this._gameState.softDrop = false;
        }
        return true;
    }

    _startHardDrop(){
        this._gameState.hardDrop = true;
        this.fire('hardDropInstant');
        return true;
    }

    _autoRotate(){
        if(!this._gameState.autoRotate) return true; // returning false or null will affect on moveFail event (check key press in game class)

        const shape = this._gameState.currentShape;

        //try any rotation
        if(!this._rotate()){//similar like canRotate but with wall kick
            return;
        }

        const getMinResult = () =>{
            let min = Infinity;
            let minRotations = [];
            const moveResults = getResultsOfMove();
            //find min
            for(let result of Object.values(moveResults)){
                if(result <= min) {
                    min = result;
                }
            }
            //get all min
            for(let [rotation, result] of Object.entries(moveResults)){
                if(result == min) {
                    minRotations.push(parseInt(rotation));
                }
            }
            return {minRotation : minRotations , min};
        }

        const getResultsOfMove = ()=>{
            const results = {};
            for(let rotation of [0,1,2,3]){
                this._shapeUpdater.rotate(shape);
                results[shape.rotation] = this._moveController.moveResult(shape);
            }
            console.log(results);
            return results;
        };

        let {minRotation : optimalRotations} = getMinResult();

        let orientations = {
            horizontal : null,
            vertical :null,
        };
        for(let rotation of optimalRotations){
            this._shapeUpdater.rotateTo(shape, rotation);
            let orientation = this._shapeControler.getOrientation(shape);//vertical or horizontal
            orientations[orientation] = rotation;
        }
        if(orientations.horizontal !== null){ // if is possibility to put shape in horizontal position take it
            this._shapeUpdater.rotateTo(shape, orientations.horizontal);
        } else if(orientations.vertical != null) {
            this._shapeUpdater.rotateTo(shape, orientations.vertical);
        }
        this._updateProjection();

        return true;
    }

    _updateProjection(){
        if(!this._gameState.showProjection){
            this._gameState.shapeProjectionPosition.col = -10;
            this._gameState.shapeProjectionPosition.row = -10;
            return;
        }

        let position = Object.assign({}, this._gameState.shapePosition);

        while(this._moveController.canMoveDown(this._gameState.currentShape, position)){
            position.row++;
        }
        this._gameState.shapeProjectionPosition = position;
    }
}