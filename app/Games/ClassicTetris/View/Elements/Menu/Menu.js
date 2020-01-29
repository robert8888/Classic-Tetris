import ViewElement from "../ViewElement.js";
import SettingScreen from "./MenuScreens/SettingScreen.js";
import KeySettingScreen from "./MenuScreens/KeySettingScreen.js";
import GameOverScreen from "./MenuScreens/GameOverScreen.js";
import PauseScreen from "./MenuScreens/PauseScreen.js";

export default class Menu extends ViewElement{
    constructor() {
        super(...arguments);
        this.screens = {};
    }

    show(screenName, data, config){
        switch (screenName) {
            case "setting": {
                this._showSetting()
                break;
            }
            case 'gameOver': {
                this._showGameOverScreen(data);
                break;
            }
            case 'pause' : {
                this._showPause(data, config);
                break;
            }
        }
    }

    hide(screenName){
        switch (screenName) {
            case 'pause': {
                this.screens.pause.hide();
            }
        }
    }

    hideAll(){
        for(let screen of Object.values(this.screens)){
            screen.hide();
        }
    }

    _showPause(data, config){
        if(!this.screens.pauseScreen) {
            let pauseScreen = new PauseScreen(this._state);
            pauseScreen.render();
            pauseScreen.update(data, config);
            pauseScreen.show();
            pauseScreen.on('goToKeySetting', () => {
                pauseScreen.hide();
                this._createKeySettingScreen(true);
            });
            pauseScreen.on('soundConfigurationUpdate', (config) =>{
                this.fire('soundConfigurationUpdate', config);
            })
            this.screens.pauseScreen  = pauseScreen;
        } else {
            this.screens.pauseScreen.update(data, config);
            this.screens.pauseScreen.show();
        }

    }

    _showSetting(){
        let settingScreen = new SettingScreen(this._state);
        settingScreen.render();
        settingScreen.show();

        settingScreen.on('start', (config) => {

            this._state.userConfig.gameConfig = config;
            this.fire('start', this._state.userConfig);
            settingScreen.hide();
        })
        settingScreen.on('goToKeyConfiguration', ()=>{
            this._createKeySettingScreen();
        })


        this.screens.setting = settingScreen;

    }

    _createKeySettingScreen(paused){
        let keyConfigScreen = new KeySettingScreen(this._state);
        keyConfigScreen.render(this._state.userConfig && this._state.userConfig.keyConfig);
        keyConfigScreen.show();
        keyConfigScreen.on('saveKeyConfiguration', (keyConfig)=>{
            if(!paused) {
                this.screens.setting.show();
            } else {
                this.screens.pauseScreen.show();
            }
            this._state.userConfig.keyConfig = keyConfig;
            this.fire('saveKeyConfiguration', keyConfig);
        })

        this.screens.keyConfig = keyConfigScreen;
    }

    _createGameOverScreen(){

        let gameOverScreen = new GameOverScreen(this._state);
        gameOverScreen.render();
        this.screens.gameOver = gameOverScreen;
    }

    _showGameOverScreen(data){
        this._createGameOverScreen();

        let screen = this.screens.gameOver;
        screen.update(data);
        screen.show();
        screen.on('restart', ()=>{
            console.log('restart ttt')
            screen.hide();
            this.fire('restart');
            screen.hide();
        });

        screen.on('settings', ()=>{
            this.show('setting');
            //this._createSettingsScreen(this._state.userConfig)
        })
    }



}