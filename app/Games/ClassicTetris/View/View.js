import GameMap from "./Elements/Game/GameMap.js";
import GameStat from "./Elements/Game/GameStat.js";

import MobileControls from "./Elements/Game/MobileControls.js";
import ShapeList from "./Elements/Game/ShapeList/ShapeList.js";

import EventObject from "../Hellpers/Events/EventObject.js";

import Menu from "./Elements/Menu/Menu.js";

export default class View extends EventObject{
    constructor(container, userConfig) {
        super();
        this.renderd = false;

        let clintRec = container.getBoundingClientRect();
        this._state = {
            width: clintRec.width,
            height: clintRec.height,
            squareSize : null,
            root : this._createSvgRoot(container),
            container : container,
            initGameState : null,
            userConfig: userConfig || {},
        }

        this.menu = new Menu(this._state);
        this.menu.show('setting');

        this.mobileControls = new MobileControls(this._state);
        this.mobileControls.render();
    }

    clear(){
        this._state.root.clear();
        this.renderd = false;
        this._gameViewElements = null;
        this._state.container.innerHTML = "";
        this._state.root = this._createSvgRoot(this._state.container);
    }

    render(initGameState){
        this._state.initGameState = initGameState;
        if(!this._gameViewElements){
            this._createElements();
        }
        if(this.renderd){
            return;
        }
        this._gameViewElements.forEach((viewElement) =>{
            viewElement.render(this._state);
        });
        this.renderd = true;
    }

    update(data){
       // console.log('draw', data);
        if(data.gameOver){
            this.menu.show('gameOver',data)
        } else if(data.paused){
            this.menu.show('pause',data, this._state.userConfig)
        } else {
            this.menu.hideAll();
            this._gameViewElements.forEach((viewElement) =>{
                viewElement.update(data);
            })
        }
    }

    _createElements(){
        this._gameViewElements = [
            new GameMap(this._state),
            new GameStat(this._state),
            new ShapeList(this._state),
            this.mobileControls,
        ]
    }

    _createSvgRoot(container){
        let root = new SVG();
        root.addClass('tetris');
        root.addTo('#' + container.id);
        root.size('100%', '100%');
        return root;
    }
}