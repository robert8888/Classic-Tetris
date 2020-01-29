import config from "../Configuration/GameConfiguration.js";

export default class GameState {
    constructor(userConfig) {
        this.size = ['standard', 'big', 'large'][0]; // user config
        this.queueVisible = true;
        this.showProjection = true;
        this.autoRotate = false;
        this.score = 0;
        this.level = 0;
        this.comboFactor = 0;
        this.paused = false;
        this.gameOver = false;
        this.pauseStartTime = null;
        this.softDrop = false;
        this.hardDrop = false;
        this.step = 0;
        this.lastSuccess = null;
        this.currentShape = null;
        this.shapePosition = {row : null, col : null};
        this.shapeProjectionPosition =  {row : null, col : null};
        this.shapeQueue = [];
        this.startTime = (new Date()).getTime();
        this.map = null;
    }

    export(){
        return JSON.parse(JSON.stringify(
            {
                score : this.score,
                level : this.level,
                combo : this.comboFactor,
                time : (new Date()).getTime() - this.startTime,

                gameOver : this.gameOver,
                paused : this.paused,
                queueVisible : this.queueVisible,
                showProjection : this.showProjection,

                shapeQueue : this.shapeQueue,
                currentShape : this.currentShape,
                shapePosition : this.shapePosition,

                shapeProjectionPosition : this.shapeProjectionPosition,
                map : this.map,
            }
        ));
    }


}