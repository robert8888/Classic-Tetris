import Game from "./Game/Game.js";
import EventObject from "./Hellpers/Events/EventObject.js";
import View from "./View/View.js";
import SoundPlayer from "./Sound/SoundPlayer.js";


export default class CTetris extends EventObject{
    constructor(container, userConfig) {
        super();
        this._container = container;
        this.userConfig = userConfig || {};
    }

    _createGame(){
        this._game = new Game();
        this._view = new View(this._container, this.userConfig);
        this._soundPlayer = new SoundPlayer(this.userConfig.gameConfig.sound);


        this._game.on('gameOver', (result) => this.fire('gameOver', result));
        this._game.on('stateUpdate', (data) => this._view.update(data));
        this._game.on('sound', (soundName) => this._soundPlayer.play(soundName));

        document.addEventListener('keydown', (event)=>{
            this._game.keyDown(event.code);
        });
        document.addEventListener('keyup', (event)=>{
            this._game.keyUp(event.code);
        });

        this._view.menu.on('start', (config) => {
            this._game.createGame(config);
            this._view.clear();
            this._view.render(this._game.state);
            this._soundPlayer.config = config.gameConfig.sound;
            this._game.start();
            this.userConfig = config;
            this.fire('userConfigUpdate', config)
        });

        this._view.menu.on('restart', this.restart.bind(this));
        this._view.menu.on('keyConfiguration', (keyConfig)=>{
            this.userConfig.keyConfig = keyConfig;
            this._game.keyConfiguration = keyConfig
        });
        this._view.menu.on('soundConfigurationUpdate', (soundConfig) => {
            this.userConfig.gameConfig.sound = soundConfig;
            this._soundPlayer.config = soundConfig;
            this.fire('userConfigUpdate', this.userConfig);
        });

        this._view.mobileControls.on('action', this._game.action.bind(this._game));
        this._view.mobileControls.on('cancelAction', this._game.cancel.bind(this._game));
    }

    start(){
        this._createGame();
    }

    restart(){
        if(!this._game){
            this.start();
        }else{
            this._game.restart();
        }
    }

}