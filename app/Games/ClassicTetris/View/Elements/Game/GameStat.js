import ViewElement from "./../ViewElement.js";
import TimeFormater from "../../../Hellpers/TimeForrmater/TimeFormater.js";

export default class GameStat extends ViewElement{
    constructor() {
        super(...arguments);
    }

    render(){

        const x = 15;
        const y = (this._state.squareSize / 2 ) || 30;
        const dy = this._state.squareSize || 30;


        const rectWidth = this._state.width - this._state.initGameState.map._size.col * this._state.squareSize -3;
        const rectHeight = this._state.squareSize;

        let count = 0;
        let group = this._state.root.group().addClass('game-statistic');
        let combo = group.group().addClass('combo');
            combo.rect(rectWidth, rectHeight).dy(count * rectHeight);
            combo.text((add) =>{
            add.tspan('combo ');
            this.combo = add.tspan(this._state.initGameState.combo.toString());
        }).dx(x).cy(y + count++ * dy);
        let level = group.group().addClass('level');
            level.rect(rectWidth, rectHeight).dy(count * rectHeight);
            level.text((add) =>{
            add.tspan('level ')
            this.level = add.tspan(this._state.initGameState.level.toString())
        }).dx(x).cy(y + count++ * dy);
        let score = group.group().addClass('score');
            score.rect(rectWidth, rectHeight).dy(count * rectHeight);
            score.text((add) =>{
            add.tspan('score ')
            this.score = add.tspan(this._state.initGameState.level.toString())
        }).dx(x).cy(y + count++ * dy);
        let time = group.group().addClass('time');
            time.rect(rectWidth, rectHeight).dy(count * rectHeight);
            time.text((add) =>{
            add.tspan('time ');
            this.time = add.tspan((new TimeFormater).string(this._state.initGameState.time)).dx(10);
        }).dx(x).cy(y + count++ * dy);


    }

    update(data){
        this.combo.clear();
        this.combo.text(data.combo.toString());

        this.level.clear();
        this.level.text(data.level.toString());

        this.score.clear();
        this.score.text(data.score.toString())

        this.time.clear();
        this.time.text((new TimeFormater).string(data.time));
    }


}