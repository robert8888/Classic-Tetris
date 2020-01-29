

import TimeFormater from "../../../../Hellpers/TimeForrmater/TimeFormater.js";
import OverLayer from "./OverLayer.js";

export default class GameOverScreen extends OverLayer{
    constructor() {
        super(...arguments);

    }

    render(){
        super.render('game-over');

        let score  = document.createElement('h4');
        this.score = document.createElement('span');
        score.textContent = "score: "
        score.classList.add('score');
        score.append(this.score);

        let level  = document.createElement('h4');
        this.level = document.createElement('span');
        level.textContent = "level: "
        level.classList.add('level');
        level.append(this.level);

        let time  = document.createElement('h4');
        time.textContent = "time: "
        this.time = document.createElement('span');
        time.classList.add('time');
        time.append(this.time);

        this.button = document.createElement('button');
        let buttonText = document.createElement('span');
        buttonText.textContent = "restart";
        let icon = document.createElement('i');
        icon.classList.add('fa');
        icon.classList.add('fa-undo');
        this.button.append(icon);
        this.button.append(buttonText);
        this.button.classList.add('restart');
        this.button.addEventListener('click', ()=>{
            this.hide();
            this.fire('restart');
        });

        let settingBtn = document.createElement('button');
        settingBtn.textContent = "settings";
        settingBtn.classList.add('btn-settings')
        settingBtn.addEventListener('click', ()=>{
            this.hide();
            this.fire('settings');
        });

        let header = document.createElement('h2');
        header.textContent ="Game Over";
        this.content.append(header)
        this.content.append(score);
        this.content.append(level);
        this.content.append(time);
        this.content.append(this.button);
        this.content.append(settingBtn);


    }

    update(data){
        this.score.textContent = data.score;
        this.level.textContent = data.level;
        this.time.textContent = (new TimeFormater()).stringDescribed(data.time);
    }


}