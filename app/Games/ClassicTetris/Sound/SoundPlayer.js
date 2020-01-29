export default class SoundPlayer {
    constructor(config) {
        this._config = config;

        const path = './app/Games/ClassicTetris/Sound/Resources/';
        this._sounds  = {
            moveFail : path + "move_fail.mp3",
            moveCorrect : path + "move_correct.mp3",
            shapeAdd : path + "shape_add.mp3",
            completedRow: path + "row_completed.mp3",
            hardDrop: path + "hard_drop.mp3",
            gameOver: path + "game_over.mp3",
            background: path + "tetris_background.mp3",
        }
        this._players = {};

        if(config.music){
            this.play('background');
        }
    }

    play(soundName){
        if(this._config.soundOn){
            switch (soundName) {
                case "move fail" : {
                    this._startPlaying(this._sounds.moveFail);
                    break;
                }
                case "move correct" : {
                    this._startPlaying(this._sounds.moveCorrect);
                    break;
                }
                case "completed row" :{
                    this._startPlaying(this._sounds.completedRow);
                    break;
                }
                case "game over" : {
                    this._startPlaying(this._sounds.gameOver)
                    break;
                }
                case "hard drop" : {
                    this._startPlaying(this._sounds.hardDrop)
                    break;
                }
                case "shape add" : {
                    if(!this._players[this._sounds.completedRow]) {
                        this._startPlaying(this._sounds.shapeAdd);
                    }
                    break;
                }
            }
        }
    }

    set config(config){
        this._config = config;
        this._updatePlayers();
    }

    _updatePlayers(){
        for(let player of Object.values(this._players)){
            player.volume = parseInt(this._config.volume)/100;
        }

        if(this._config.music){
            this._startPlaying(this._sounds.background, true)
        } else {
            this._stopPlaying(this._sounds.background);
        }
    }

    _startPlaying(src, loop= false){
        if(this._players[src]){
            this._players[src].play();
        } else {
            let audio = document.createElement('audio');
            audio.src = src;
            audio.loop = loop;
            audio.volume = parseInt(this._config.volume)/100;
            audio.play();
            this._players[src] = audio;
            audio.addEventListener('ended', ()=>{
                delete this._players[src];
            })
        }
    }

    _stopPlaying(src){
        if(this._players[src]) {
            this._players[src].pause();
            delete this._players[src];
        }
    }

}