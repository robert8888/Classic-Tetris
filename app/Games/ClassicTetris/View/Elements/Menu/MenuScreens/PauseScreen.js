import OverLayer from "./OverLayer.js";
import TimeFormater from "../../../../Hellpers/TimeForrmater/TimeFormater.js";
import {renderButton, renderInput, renderHeader} from "./Mixin/RenderElements.js";

export default class PauseScreen extends OverLayer{
    constructor() {
        super(...arguments);
        this.elements = {};
    }

    render(){
        super.render('pause')

        //haeder
        this.content.append(renderHeader('Pause'));

        /*game info*/
        for(let statEl of ['score', 'level', 'time']){
            let {div, span} = this._renderGameStatEl(statEl, statEl + " : ", '');
            this.elements[statEl] = span;
            this.content.append(div);
        }//

        //sound adjustment
        let {liItem: soundOnItem, inputElement: soundOnElement} = renderInput('Turn on game sounds', 'sound-on', {type:"checkbox"}, this._soundConfigChanged.bind(this));
        let {liItem: musicOnItem, inputElement: musicOnElement} = renderInput('Turn on music ', 'music-on', {type:"checkbox"}, this._soundConfigChanged.bind(this));
        let {liItem: soundVolumeItem, inputElement: soundVolumeElement} = renderInput('Volume ', 'sound-volume', {type:"range", min:0, max: 100}, this._soundConfigChanged.bind(this));
        this.elements.soundOn = [soundOnItem, soundOnElement];
        this.elements.music = [musicOnItem, musicOnElement];
        this.elements.volume = [soundVolumeItem, soundVolumeElement];
        let settingList = document.createElement('ul');
        settingList.classList.add('setting-list');
        settingList.append(soundOnItem);
        settingList.append(musicOnItem);
        settingList.append(soundVolumeItem);
        this.content.append(settingList);

        console.log(this._state);
        //*************

        //button key configuration
        let keyConfigButton = renderButton('key config', 'btn-key-config')
        keyConfigButton.addEventListener('click', ()=>this.fire('goToKeySetting'));
        this.content.append(keyConfigButton);

    }


    _renderGameStatEl(className, title, value){
            let wrapper = document.createElement('div');
            wrapper.classList.add('game-info-' + className+ '-wrapper');

            let titleEl = document.createElement('h4');
            titleEl.classList.add('game-info-' + className + '-title');
            titleEl.textContent = title;

            let spanValue = document.createElement('span');
            spanValue.classList.add('game-info-' + className + 'value');
            spanValue.textContent = value;

            titleEl.append(spanValue);
            wrapper.append(titleEl);

            return {div : wrapper, span : spanValue};
    }

    _soundConfigChanged(){
        this.fire('soundConfigurationUpdate', {
            soundOn: this.elements.soundOn[1].checked,
            music:this.elements.music[1].checked,
            volume: this.elements.volume[1].value,
        })
    }

    update(data, {gameConfig: {sound}}){
        for (let [key, element] of Object.entries(this.elements)){
            if(!(element instanceof Array)){ // game satt
                if(key === "time"){
                    element.textContent = (new TimeFormater()).stringDescribed(data['time']);
                    continue;
                }
                element.textContent = data[key];
            } else if(element instanceof Array) {
                let [li, input] = element;

                if(key === 'volume'){
                    input.value = sound[key];
                    if(sound.soundOn || sound.music) li.classList.add('checked');
                } else if(sound[key] === true){
                    input.checked = true;
                    li.classList.add('checked');
                } else if(sound[key] === false){
                    input.checked = false;
                    li.classList.remove('checked');
                }
                console.log(sound);
            }
        }
    }
}