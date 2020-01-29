import GameState from "./Entries/GameState.js";

import config from "./Configuration/GameConfiguration.js";
import KeyConfiguration from "./Configuration/KeyConfiguration/KeyConfiguration.js";

import ShapeGenerator from "./Entries/Shape/Generator/ShapeGenerator.js";
import ShapeController from "./Controllers/ShapeController.js";
import ShapeUpdater from "./Updaters/ShapeUpdater.js";
import GameMap from "./Entries/Map/GameMap.js";
import ActionController from "./Controllers/ActionController.js";

import EventObject from "../Hellpers/Events/EventObject.js";
import Generator from "./Entries/Shape/Generator/Generator.js";


export default class Game extends EventObject{
    constructor() {
        super();
    }

    createGame(config){
        this.userConfig = config;

        this._initialState(this.userConfig);



        this._setupShapes();
        this._setupMap();
        this._startPosition();

        this._controler = new ActionController(this._state);

        this._controler.on('completed', this._addPoint.bind(this));
        this._controler.on('gameOver', this._gameOver.bind(this));
        this._controler.on('newShape', this._nextShape.bind(this));
        this._controler.on('stateUpdate', this._stateUpdate.bind(this));
        this._controler.on('pause' , this.togglePause.bind(this));
        this._controler.on('hardDropInstant' , ()=>{
            clearTimeout(this.timer);
            this._tick();
            this.fire('sound', 'hard drop')
        });

    }

    get state(){
        return this._state.export();
    }

    set keyConfiguration(config){
        this._keyConfig = new KeyConfiguration(config);
    }

    get keyConfiguration(){
        if(!this._keyConfig){
            if(this.userConfig.keyConfig){
                this._keyConfig = new KeyConfiguration(this.userConfig.keyConfig);
            }
            else this._keyConfig = new KeyConfiguration();
        }
        return this._keyConfig;
    }

    keyDown(keyCode){
        if(!this._state)
            return;

        let actionName = this.keyConfiguration.get(keyCode);

        if(!actionName){
            return;
        }

        if(this._controler.do(actionName)){
            this._stateUpdate();
            this.fire('sound', 'move correct');
        } else {
            this.fire('sound', 'move fail');
        }
    }

    keyUp(keyCode){
        if(!this._state)
            return;
        
        let actionName =  this.keyConfiguration.get(keyCode);
        if(!actionName){
            return;
        }
        if(this._controler.cancel(actionName)){
            this._stateUpdate();
        };
    }

    action(actionName){
        if(this._controler.has(actionName)){
            if(this._controler.do(actionName)){
                this._stateUpdate();
                this.fire('sound', 'move correct');
            } else {
                this.fire('sound', 'move fail');
            }
        }else{
            throw Error(`invalid action name : ${actionName}`);
        }
    }

    cancel(actionName){
        if(this._controler.has(actionName)){
            if(this._controler.cancel(actionName)){
                this._stateUpdate();
            }
        }else{
            throw Error(`invalid action name : ${actionName}`);
        }
    }



    start(){
        this._state.paused =false;
        this._tick();
    }

    restart(){
        this._initialState(this.userConfig);
        this._setupShapes();
        this._setupMap();
        this._startPosition();

        this._controler.state = this._state;
        clearTimeout(this.timer);
        this._tick();
        this._stateUpdate();
    }


    togglePause(){
        if(!this._state.paused){
            this._state.paused = true;
            this._state.pauseStartTime  = (new Date).getTime();
        } else {
            this._state.paused = false;
            const pausedTime = (new Date).getTime() - this._state.pauseStartTime;
            this._state.startTime += pausedTime;
            this._state.pauseStartTime = null;
            clearTimeout(this.timer);
            this._tick();
        }
        this._stateUpdate();
    }

    //----------------------------------------------------------
    // Protected below
    //----------------

    _tick(){ //tick tack
        if(!this._state.paused && !this._state.gameOver){
            this._controler.do('moveDown');

            let interval;
            let intervalRatio = 1;
            if(this._state.hardDrop){
                interval = 50;
            } else {
                interval = config.levels[this._state.level].stepTime;
            }
            if(this._state.softDrop){
                intervalRatio = 0.5;
            }

            this.timer = setTimeout(()=> this._tick(), interval * intervalRatio);
        }
    }

    _initialState(userConfig){
        this._state = new GameState();

        this._state.size = userConfig.gameConfig.size;
        this._state.queueVisible = userConfig.gameConfig.queueVisible;
        this._state.showProjection = userConfig.gameConfig.showProjection;
        this._state.autoRotate = userConfig.gameConfig.autoRotate;
    }

    _setupShapes(){
        const shapeGenerator = new ShapeGenerator();

        for(let i = 0 ; i < 6; i++) {
            let shape = shapeGenerator.getRandom();
            this._rotateRandom(shape);
            this._state.shapeQueue.push(shape)
        }
        this._state.currentShape = shapeGenerator.getRandom();
    }

    _setupMap(){
        const size = config.size[this._state.size];
        this._state.map = new GameMap(size);
        this._startPosition();
    }

    _rotateRandom(shape){
        const shapeUpdater = new ShapeUpdater();

        let randomGenerator = new Generator();
        const randomRotate = randomGenerator._getRandomNumber(4);
        const coinFlip =  randomGenerator._getRandomNumber(2); // 0 or 1
        for(let rotate = 0; rotate < randomRotate; rotate++){
            if(coinFlip){
                shapeUpdater.backRotate(shape)
            }else {
                shapeUpdater.rotate(shape);
            }
        }
    }

    _startPosition(){
        let row = 0;
        let col;

        const shape = this._state.currentShape;
        const shapeController = new ShapeController();
        if(shapeController.hasEmptyRow(shape, 2)){
            row = 1;
        }

        //
        col = Math.floor(this._state.map.colCount / 2) - Math.floor(this._state.currentShape.size / 2);

        this._state.shapePosition.row = row;
        this._state.shapePosition.col = col;

        this._state.shapeProjectionPosition = Object.assign({}, this._state.shapePosition);

    }

    _nextShape(){
        const shapeGenerator = new ShapeGenerator();
        this._state.currentShape = this._state.shapeQueue.shift();
        let shape = shapeGenerator.getRandom();
        this._rotateRandom(shape);
        this._state.shapeQueue.push(shape);
        //reset position
        this._startPosition();
        //sound of add shape to map
        this.fire('sound', 'shape add');
    }

    _addPoint(rowAmount){
        let level = config.levels[this._state.level];
        let points = 0;
        if(rowAmount === 1){
              points = level.pointForRow;
        } else if(rowAmount > 1) {
              points = level.pointForRow * 2;
              this._state.comboFactor += rowAmount;
        }

        if(this._state.lastSuccess){
            this._state.comboFactor += 2;
        }
        else {
            this._state.comboFactor = 0;
        }

        if(this._state.comboFactor > 0 ){
            points *= this._state.comboFactor;
        }
        this._state.score += points;

        if(this._state.score >= config.levels[this._state.level].pointLimit){
            this._state.level++;
        }

        this.fire('sound', 'completed row');
    }

    _stateUpdate(){
        this.fire('stateUpdate', this._state.export())
    }

    _gameOver(){
        this._state.gameOver = true;
        const {score:s,  level:l, startTime:start} = this._state;
        this.fire('gameOver', {
            score : s,
            level : l,
            time: (new Date()).getTime() - start,
        });
        this.fire('sound', 'game over');
    }



}